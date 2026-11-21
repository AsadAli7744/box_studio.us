import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let client;

export function s3Configured() {
  // Credentials may come from env keys, shared profile, or host IAM role.
  return Boolean(process.env.AWS_S3_BUCKET && process.env.AWS_REGION);
}

export function s3Bucket() {
  return process.env.AWS_S3_BUCKET || '';
}

export function getS3Client() {
  if (!s3Configured()) {
    throw new Error('Set AWS_S3_BUCKET, AWS_REGION, and AWS credentials to store quote artwork.');
  }
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION,
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {}),
            }
          : undefined,
    });
  }
  return client;
}

export async function putS3Object({ key, body, contentType }) {
  const s3 = getS3Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: s3Bucket(),
      Key: key,
      Body: body,
      ContentType: contentType || 'application/octet-stream',
    }),
  );
  return key;
}

export async function getS3ObjectText(key) {
  const s3 = getS3Client();
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: s3Bucket(),
      Key: key,
    }),
  );
  return response.Body.transformToString('utf-8');
}

export async function getS3ObjectBuffer(key) {
  const s3 = getS3Client();
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: s3Bucket(),
      Key: key,
    }),
  );
  const bytes = await response.Body.transformToByteArray();
  return {
    buffer: Buffer.from(bytes),
    contentType: response.ContentType || 'application/octet-stream',
  };
}

export async function listS3Keys(prefix) {
  const s3 = getS3Client();
  const keys = [];
  let token;
  do {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: s3Bucket(),
        Prefix: prefix,
        ContinuationToken: token,
      }),
    );
    for (const item of response.Contents || []) {
      if (item.Key) keys.push(item.Key);
    }
    token = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

export async function signedS3Url(key, expiresIn = 60 * 15) {
  const s3 = getS3Client();
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: s3Bucket(),
      Key: key,
    }),
    { expiresIn },
  );
}
