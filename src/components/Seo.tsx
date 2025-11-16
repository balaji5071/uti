import { Helmet } from 'react-helmet-async';

export type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  path?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
};

const BASE_TITLE = 'UTI Beauty Parlour';
const BASE_DESCRIPTION = 'Professional beauty parlour in Ambagarh Chowki offering bridal makeup, hair styling, facials, and premium self-care experiences.';
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://utibeautyparlour.com';
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop';

const buildCanonicalUrl = (path?: string) => {
  if (!path) return SITE_URL;
  try {
    return new URL(path, SITE_URL).toString();
  } catch (error) {
    // Fallback to site url if the provided path is not valid
    return SITE_URL;
  }
};

export default function Seo({
  title,
  description,
  keywords,
  image,
  path,
  structuredData,
  noIndex = false,
}: SeoProps) {
  const normalizedTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  const normalizedDescription = description ?? BASE_DESCRIPTION;
  const canonicalUrl = buildCanonicalUrl(path);
  const metaImage = image ?? DEFAULT_IMAGE;
  const keywordContent = keywords?.join(', ');

  return (
    <Helmet prioritizeSeoTags>
      <title>{normalizedTitle}</title>
      <meta name="description" content={normalizedDescription} />
      {keywordContent && <meta name="keywords" content={keywordContent} />}
      <meta property="og:title" content={normalizedTitle} />
      <meta property="og:description" content={normalizedDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={BASE_TITLE} />
      <meta property="og:image" content={metaImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={normalizedTitle} />
      <meta name="twitter:description" content={normalizedDescription} />
      <meta name="twitter:image" content={metaImage} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export { SITE_URL, BASE_TITLE };
