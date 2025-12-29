import DOMPurify from 'dompurify';

export const sanitizeAndSetInnerHTML = (htmlContent) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  return { __html: sanitizedHtml };
};
