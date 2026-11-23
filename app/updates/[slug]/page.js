import { notFound } from 'next/navigation';
import HighlightArticlePage from '../../../src/views/HighlightArticlePage';
import { getHighlight, highlightArticles } from '../../../src/data/highlights';
import { absoluteSeoUrl, buildPageMetadata } from '../../../src/lib/seo';

export function generateStaticParams() {
  return highlightArticles.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getHighlight(slug);
  if (!article) {
    return buildPageMetadata({
      title: 'Update not found | Box Studio',
      description: 'This Box Studio update is not available.',
      path: `/updates/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${article.title} | Box Studio`,
    description: article.subtitle,
    path: `/updates/${article.slug}`,
    image: absoluteSeoUrl(article.heroImage),
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const article = getHighlight(slug);
  if (!article) notFound();
  return <HighlightArticlePage article={article} />;
}
