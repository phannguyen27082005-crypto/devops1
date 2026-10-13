const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { transformSync } = require('esbuild');
const code = transformSync(fs.readFileSync('src/context/cartStorage.ts', 'utf8'), {
  loader: 'ts', format: 'cjs',
}).code;
const moduleResult = { exports: {} };
vm.runInNewContext(code, { module: moduleResult, exports: moduleResult.exports });
const { cartStorageKey, readCart } = moduleResult.exports;
const values = new Map();
const storage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
};
const an = cartStorageKey('an');
const admin = cartStorageKey('admin');
const guest = cartStorageKey();
const legacyItems = [{ id: 'one' }, { id: 'two' }, { id: 'three' }];
storage.setItem('maison_shopping_cart', JSON.stringify(legacyItems));
assert.equal(readCart(storage, admin).length, 0);
assert.equal(readCart(storage, guest).length, 0);
assert.equal(readCart(storage, an, true).length, 3);
storage.setItem(admin, JSON.stringify([{ id: 'admin-only' }]));
assert.equal(readCart(storage, an, true).length, 3);
assert.equal(readCart(storage, admin)[0].id, 'admin-only');
// Clearing An's cart must not restore the shared legacy items on the next login.
storage.setItem(an, '[]');
assert.equal(readCart(storage, an, true).length, 0);
assert.equal(readCart(storage, admin).length, 1);
storage.setItem(guest, 'invalid json');
assert.equal(readCart(storage, guest).length, 0);
assert.equal(new Set([an, admin, guest]).size, 3);
console.log('PASS: account separation, legacy ownership, reload, clear, malformed storage');
