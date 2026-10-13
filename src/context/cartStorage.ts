import type { CartItem } from '../types';

export const cartStorageKey = (userId?: string) =>
  `maison_shopping_cart:${userId ? `user:${userId}` : 'guest'}`;

export function readCart(storage: Storage, key: string, restoreAnLegacyCart = false): CartItem[] {
  try {
    let saved = storage.getItem(key);
    // The owner of the old shared cart was confirmed as An by the user.
    // Keep the original as a backup; never import it into another account.
    if (saved === null && restoreAnLegacyCart) {
      saved = storage.getItem('maison_shopping_cart');
      if (saved !== null) storage.setItem(key, saved);
    }
    const items = saved ? JSON.parse(saved) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}
