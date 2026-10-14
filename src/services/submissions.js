/**
 * Future backend integration point.
 * The website currently prepares requests on the visitor's device only.
 * Do not add a network call here until a real endpoint and file handling exist.
 */
export const submissionMode = 'local';

export function submitQuoteRequest() {
  return Promise.resolve({
    delivered: false,
    mode: submissionMode,
  });
}

export function submitContactInquiry() {
  return Promise.resolve({
    delivered: false,
    mode: submissionMode,
  });
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
