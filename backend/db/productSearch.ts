function searchWords(value: string): string[] {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').split(/[^a-z0-9]+/).filter(Boolean)
    .map(word => word === 'dam' ? 'vay' : word);
}

export function matchesProductSearch(
  product: { name: string; brand?: string; description?: string }, query: string,
): boolean {
  const terms = searchWords(query);
  if (terms.length === 0) return true;
  const words = searchWords(`${product.name} ${product.brand || ''} ${product.description || ''}`);
  return terms.every(term => words.some(word => word.startsWith(term)));
}
