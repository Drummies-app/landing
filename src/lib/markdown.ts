function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}

export function renderMarkdown(source: string): string {
  const blocks = source.trim().split(/\r?\n\r?\n/);
  return blocks
    .map((block) => {
      const lines = block.split(/\r?\n/);
      const heading = /^(#{1,4})\s+(.*)$/.exec(lines[0] ?? "");
      if (heading) {
        const level = Math.min(heading[1]!.length + 1, 5);
        return `<h${level}>${inline(heading[2]!)}</h${level}>`;
      }
      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        const items = lines
          .map((line) => `<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      if (lines.every((line) => /^>\s?/.test(line))) {
        return `<blockquote>${inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "))}</blockquote>`;
      }
      return `<p>${inline(lines.join(" "))}</p>`;
    })
    .join("\n");
}
