export const submissionMode = 'api';

export async function submitQuoteRequest(formData) {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'The quote request could not be submitted.');
  }
  return {
    delivered: Boolean(data.delivered),
    id: data.id,
    mode: submissionMode,
  };
}

export function submitContactInquiry() {
  return Promise.resolve({
    delivered: false,
    mode: 'local',
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
