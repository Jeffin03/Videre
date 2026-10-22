/* ── explanationMarkdown renderer ─────────────────────────────────────────
   explanationMarkdown is an HTML string, not real markdown. This hand-rolled
   renderer supports exactly the subset documented in AGENTS.md:
   ### / #### headings, **bold**, *italic*, `code`, > blockquotes (grouped),
   - /* bullet lists, 1. numbered lists, and ``` fenced code blocks.
   Everything else falls through as escaped paragraph text.
   Shared by LessonViewer (lesson copy) and AskVidere (AI answers).
   ───────────────────────────────────────────────────────────────────────── */

export const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const inlineMarkdown = (text: string): string =>
  escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-100 font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-800">$1</code>');

export const renderExplanationMarkdown = (markdown: string): string => {
  // 1. Extract fenced code blocks first so their contents are never
  //    re-processed by the inline/block rules below.
  const codeBlocks: string[] = [];
  const source = markdown.replace(/```[a-z]*\r?\n([\s\S]*?)```/gi, (_match, code: string) => {
    const html =
      `<pre class="bg-slate-950 border border-slate-800 rounded-lg p-3 my-3 overflow-x-auto text-xs leading-relaxed text-cyan-200">` +
      `<code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`;
    codeBlocks.push(html);
    return `\n@@CODEBLOCK${codeBlocks.length - 1}@@\n`;
  });

  const out: string[] = [];
  let paragraph: string[] = [];
  let quote: string[] = [];
  let list: { tag: 'ul' | 'ol'; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p class="mb-3 last:mb-0">${paragraph.map(inlineMarkdown).join(' ')}</p>`);
      paragraph = [];
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      const inner = quote.map(l => inlineMarkdown(l.replace(/^>\s?/, ''))).join('<br/>');
      out.push(
        `<blockquote class="border-l-4 border-cyan-500 pl-4 py-2 my-2 text-cyan-200 italic bg-cyan-950/20 rounded-r">${inner}</blockquote>`
      );
      quote = [];
    }
  };
  const flushList = () => {
    if (list) {
      const cls = list.tag === 'ul'
        ? 'list-disc'
        : 'list-decimal';
      const items = list.items.map(i => `<li>${inlineMarkdown(i)}</li>`).join('');
      out.push(`<${list.tag} class="${cls} pl-5 my-2 space-y-1 marker:text-cyan-500">${items}</${list.tag}>`);
      list = null;
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushQuote();
    flushList();
  };

  for (const rawLine of source.split('\n')) {
    const line = rawLine.trimEnd();

    // Reserved placeholder line for an extracted code block
    const codeMatch = line.trim().match(/^@@CODEBLOCK(\d+)@@$/);
    if (codeMatch) {
      flushAll();
      out.push(codeBlocks[Number(codeMatch[1])]);
      continue;
    }

    if (!line.trim()) {
      flushAll();
      continue;
    }

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      flushAll();
      out.push(`<h3 class="text-lg font-bold text-slate-100 mt-4 mb-2">${inlineMarkdown(h3[1])}</h3>`);
      continue;
    }
    const h4 = line.match(/^####\s+(.*)$/);
    if (h4) {
      flushAll();
      out.push(`<h4 class="text-sm font-bold text-cyan-300 mt-3 mb-1 font-mono">${inlineMarkdown(h4[1])}</h4>`);
      continue;
    }

    if (/^\s*>/.test(line)) {
      flushParagraph();
      flushList();
      quote.push(line);
      continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      flushQuote();
      if (!list || list.tag !== 'ul') {
        flushList();
        list = { tag: 'ul', items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    const numbered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (numbered) {
      flushParagraph();
      flushQuote();
      if (!list || list.tag !== 'ol') {
        flushList();
        list = { tag: 'ol', items: [] };
      }
      list.items.push(numbered[1]);
      continue;
    }

    flushQuote();
    flushList();
    paragraph.push(line.trim());
  }

  flushAll();
  return out.join('\n');
};
