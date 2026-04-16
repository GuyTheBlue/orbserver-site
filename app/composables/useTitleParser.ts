export function useTitleParser(text: string) {
  if (!text) return []

  const parts = text.split(/(#h#.*?#\/h#|#br#)/g)
  
  return parts.map((part, index) => {
    if (part === '#br#') {
      return { type: 'br', id: index }
    }
    if (part.startsWith('#h#') && part.endsWith('#/h#')) {
      return { type: 'highlight', content: part.slice(3, -4), id: index }
    }
    return { type: 'text', content: part, id: index }
  }).filter(part => part.type === 'br' || part.content)
}
