import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import truncate from 'html-truncate';

interface HtmlRendererProps {
  html: string;
  maxLength?: number;
}

export const HtmlRenderer: React.FC<HtmlRendererProps> = ({ html, maxLength }) => {
  // Sanitize the HTML to prevent XSS attacks, then truncate if needed
  const processedHtml = useMemo(() => {
    const sanitized = DOMPurify.sanitize(html);

    // If maxLength is specified, truncate the HTML while preserving structure
    if (maxLength && maxLength > 0) {
      return truncate(sanitized, maxLength, {
        suffix: '...'
      });
    }

    return sanitized;
  }, [html, maxLength]);

  return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />;
};