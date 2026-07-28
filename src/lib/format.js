export function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Transforme les `portions entre accents graves` d'une consigne en <code>.
export function inlineCode(text) {
  return escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>')
}

// Coloration syntaxique minimaliste : un seul passage sur le code brut,
// chaque morceau est échappé avant d'être inséré dans le HTML.
const TOKENS =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(const|let|var|new|function|return|import|export|from|if|else|for|while|null|true|false|typeof|delete)\b|\b(THREE|window|document|Math|console)\b|\b(\d+\.?\d*)\b/g

const CLASSES = ['tok-comment', 'tok-string', 'tok-keyword', 'tok-global', 'tok-number']

export function highlightJs(source) {
  const code = source.trim()
  let html = ''
  let last = 0

  for (const match of code.matchAll(TOKENS)) {
    html += escapeHtml(code.slice(last, match.index))
    const group = match.slice(1).findIndex((value) => value !== undefined)
    html += `<span class="${CLASSES[group]}">${escapeHtml(match[0])}</span>`
    last = match.index + match[0].length
  }

  return html + escapeHtml(code.slice(last))
}
