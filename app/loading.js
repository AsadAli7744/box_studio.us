// Route transitions are handled by SiteLoader for non-home pages.
// Returning null keeps home navigations from blocking behind a full-page spinner.
export default function Loading() {
  return null;
}
