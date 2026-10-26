import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

let queue = Promise.resolve();

function git(args) {
  return new Promise((resolve, reject) => {
    execFile('git', args, { cwd: process.cwd(), windowsHide: true, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout: String(stdout || ''), stderr: String(stderr || '') });
    });
  });
}

function output(error) {
  return [error?.stderr, error?.stdout, error?.message].map((item) => String(item || '')).join('\n');
}

function hidden(text) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  let clean = String(text || '').trim();
  if (token) clean = clean.split(token).join('');
  return clean.replace(/\s+/g, ' ').slice(0, 500);
}

function referencedAssets(catalog) {
  const sources = [
    ...(catalog.heroSlides || []).map((slide) => slide.image),
    ...catalog.categories.map((category) => category.image),
    ...catalog.products.flatMap((product) => product.images.map((image) => image.src)),
  ];
  const root = path.resolve(process.cwd(), 'public', 'assets');
  const paths = [];
  for (const src of sources) {
    if (!src?.startsWith('/assets/')) continue;
    const name = src.slice('/assets/'.length);
    if (!/^[a-zA-Z0-9._-]+$/.test(name)) throw new Error('A catalog image path is not safe to publish.');
    const absolute = path.resolve(root, name);
    if (absolute !== path.join(root, name)) throw new Error('A catalog image path is not safe to publish.');
    if (!fs.existsSync(absolute)) throw new Error(`The uploaded file ${src} is missing from public/assets.`);
    paths.push(`public/assets/${name}`);
  }
  return [...new Set(paths)];
}

const PUBLISH_MESSAGE = 'Publish category and product catalog';

async function commitsWaiting() {
  try {
    const { stdout } = await git(['log', '--format=%s', '@{upstream}..HEAD']);
    return stdout.split('\n').map((line) => line.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

async function currentBranch() {
  const branch = (await git(['rev-parse', '--abbrev-ref', 'HEAD'])).stdout.trim();
  if (!branch || branch === 'HEAD') throw new Error('The site folder is not on a git branch.');
  return branch;
}

async function pushBranch(branch) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const push = ['push', 'origin', `HEAD:${branch}`];
  const args = token ? ['-c', `http.extraheader=AUTHORIZATION: bearer ${token}`, ...push] : push;
  try {
    await git(args);
  } catch (error) {
    throw new Error(hidden(output(error)) || 'GitHub rejected the push.');
  }
}

async function publishNow(catalog) {
  const paths = ['content/catalog.json', ...referencedAssets(catalog)];
  if (!fs.existsSync(path.join(process.cwd(), 'content', 'catalog.json'))) {
    throw new Error('The catalog file was not written.');
  }
  const waiting = await commitsWaiting();
  if (waiting.some((subject) => subject !== PUBLISH_MESSAGE)) {
    throw new Error('Publish did not push. This copy of the site already has other commits that are not on GitHub.');
  }
  const branch = await currentBranch();
  if (waiting.length) await pushBranch(branch);

  await git(['add', '--', ...paths]);
  try {
    await git(['commit', '--only', '-m', PUBLISH_MESSAGE, '--', ...paths]);
  } catch (error) {
    const text = output(error);
    if (/nothing to commit|no changes added to commit/i.test(text)) {
      return { status: 'live', message: 'Already published. No catalog changes to push.' };
    }
    throw new Error(hidden(text) || 'Git could not commit the catalog.');
  }
  await pushBranch(branch);
  return { status: 'live', message: `Live. Pushed to GitHub on ${branch}. The site updates when that deployment finishes.` };
}

export function publishCatalog(catalog) {
  const run = queue.then(() => publishNow(catalog));
  queue = run.then(() => undefined, () => undefined);
  return run;
}
