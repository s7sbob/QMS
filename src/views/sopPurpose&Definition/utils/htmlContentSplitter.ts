/**
 * HTML Content Splitter Utility
 * Splits HTML content into smaller chunks for pagination
 */

export interface ContentChunk {
  id: string;
  htmlEn: string;
  htmlAr: string;
}

/**
 * Split HTML content into pageable chunks at natural break points.
 * Break points include: paragraphs, list items, divs, line breaks, and table rows.
 */
export function splitHtmlContent(htmlEn: string, htmlAr: string): ContentChunk[] {
  const chunksEn = splitSingleHtml(htmlEn);
  const chunksAr = splitSingleHtml(htmlAr);

  // Match English and Arabic chunks by index
  const maxLength = Math.max(chunksEn.length, chunksAr.length);
  const result: ContentChunk[] = [];

  for (let i = 0; i < maxLength; i++) {
    result.push({
      id: `chunk-${i}`,
      htmlEn: chunksEn[i] || '',
      htmlAr: chunksAr[i] || '',
    });
  }

  return result;
}

/**
 * Split a single HTML string into chunks at block-level elements
 */
function splitSingleHtml(html: string): string[] {
  if (!html || html.trim() === '') {
    return [''];
  }

  // Create a temporary container to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const container = doc.body.firstElementChild;

  if (!container) {
    return [html];
  }

  const chunks: string[] = [];

  // Process child nodes
  const processNode = (node: Node): string[] => {
    const nodeChunks: string[] = [];

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        nodeChunks.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Block-level elements that create natural break points
      const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'blockquote', 'pre'];

      if (blockElements.includes(tagName)) {
        // Each block element becomes its own chunk
        nodeChunks.push(element.outerHTML);
      } else if (tagName === 'br') {
        // Line breaks create a break point
        nodeChunks.push('<br/>');
      } else if (tagName === 'ul' || tagName === 'ol') {
        // For lists, split into individual list items
        const listItems = element.querySelectorAll('li');
        if (listItems.length > 0) {
          listItems.forEach((li) => {
            // Wrap each li in its parent list type for proper rendering
            const wrapper = document.createElement(tagName);
            wrapper.appendChild(li.cloneNode(true));
            nodeChunks.push(wrapper.outerHTML);
          });
        } else {
          nodeChunks.push(element.outerHTML);
        }
      } else if (tagName === 'table') {
        // For tables, split into individual rows (keeping thead if present)
        const thead = element.querySelector('thead');
        const rows = element.querySelectorAll('tbody tr, tr:not(thead tr)');

        if (rows.length > 0) {
          rows.forEach((row, index) => {
            // Create a new table for each row
            const wrapper = document.createElement('table');
            wrapper.className = element.className;
            wrapper.setAttribute('style', element.getAttribute('style') || '');

            // Include thead in first chunk if present
            if (thead && index === 0) {
              wrapper.appendChild(thead.cloneNode(true));
            }

            const tbody = document.createElement('tbody');
            tbody.appendChild(row.cloneNode(true));
            wrapper.appendChild(tbody);
            nodeChunks.push(wrapper.outerHTML);
          });
        } else {
          nodeChunks.push(element.outerHTML);
        }
      } else {
        // Inline elements or unknown - keep as is
        nodeChunks.push(element.outerHTML);
      }
    }

    return nodeChunks;
  };

  // Process all child nodes of the container
  container.childNodes.forEach((child) => {
    const nodeChunks = processNode(child);
    chunks.push(...nodeChunks);
  });

  // If no chunks were created, return the original HTML
  if (chunks.length === 0) {
    return [html];
  }

  // Merge small consecutive inline chunks to avoid too many tiny pieces
  return mergeSmallChunks(chunks);
}

/**
 * Merge small consecutive chunks to avoid excessive fragmentation
 */
function mergeSmallChunks(chunks: string[], minChunkLength: number = 50): string[] {
  const merged: string[] = [];
  let current = '';

  for (const chunk of chunks) {
    // Check if this is a block-level element that should stay separate
    const isBlockElement = /^<(p|div|h[1-6]|li|ul|ol|table|tr|blockquote|pre)/i.test(chunk);

    if (isBlockElement) {
      // Save any accumulated inline content first
      if (current.trim()) {
        merged.push(current);
        current = '';
      }
      merged.push(chunk);
    } else {
      // Accumulate inline content
      current += chunk;

      // If accumulated content is long enough, flush it
      if (current.length >= minChunkLength) {
        merged.push(current);
        current = '';
      }
    }
  }

  // Don't forget remaining content
  if (current.trim()) {
    merged.push(current);
  }

  return merged.length > 0 ? merged : [''];
}

/**
 * Estimate the height of HTML content in pixels
 * This is a rough estimate for pre-layout calculations
 */
export function estimateContentHeight(html: string): number {
  if (!html || html.trim() === '') {
    return 0;
  }

  // Base line height in pixels
  const lineHeight = 20;
  const paddingPerBlock = 16;

  // Count block elements
  const blockCount = (html.match(/<(p|div|h[1-6]|li|tr|blockquote|pre)[^>]*>/gi) || []).length;

  // Count line breaks
  const brCount = (html.match(/<br\s*\/?>/gi) || []).length;

  // Estimate text lines (rough: every 80 chars is about one line)
  const textContent = html.replace(/<[^>]*>/g, '');
  const textLines = Math.ceil(textContent.length / 80);

  // Calculate estimated height
  const height = (blockCount * paddingPerBlock) + (brCount * lineHeight) + (textLines * lineHeight);

  return Math.max(height, lineHeight); // At least one line height
}
