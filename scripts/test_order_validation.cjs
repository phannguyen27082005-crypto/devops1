const assert = require('node:assert/strict');
const { build } = require('esbuild');
const vm = require('node:vm');
const express = require('express');

(async () => {
  const product = { id: 'p', name: 'Polo', status: 'ACTIVE', price: 390000, salePrice: 329000,
    images: [], variants: [{ id: 'v', stock: 5, size: 'M', color: 'Black' }] };
  let created;
  const db = {
    findProductById: id => id === 'p' ? product : undefined,
    getSettings: () => ({ freeShippingThreshold: 500000, shippingFeeStandard: 30000 }),
    findCouponByCode: () => ({ startDate: '2020-01-01', endDate: '2020-01-02', minOrderValue: 0, usedCount: 0, usageLimit: 100 }),
    createOrder: data => (created = { ...data, id: 'order-test', orderCode: 'MS-TEST' }),
    findOrderById: id => id === 'order-test' ? created : undefined,
  };
  const result = await build({ entryPoints: ['backend/routes/orderRoutes.ts'], bundle: true,
    platform: 'node', format: 'cjs', packages: 'external', write: false,
    plugins: [{ name: 'isolated-data', setup(build) {
      build.onResolve({ filter: /\/db\/database\.js$/ }, () => ({ path: 'db', namespace: 'stub' }));
      build.onResolve({ filter: /\/middleware\/auth\.js$/ }, () => ({ path: 'auth', namespace: 'stub' }));
      build.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'db'
        ? 'export const db = globalThis.testDb;'
        : 'export const JWT_SECRET="isolated-test-secret"; export const optionalAuth = (_req,_res,next)=>next(); export const authenticateToken=optionalAuth;' }));
    }}] });
  const mod = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, { require, module: mod, exports: mod.exports,
    globalThis: { testDb: db }, console });
  const app = express(); app.use(express.json()); app.use('/orders', mod.exports.default);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    async function post(items, couponCode) {
      return fetch(`http://127.0.0.1:${server.address().port}/orders`, { method: 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          customerName: 'Test', customerPhone: '0901234567', shippingAddress: 'Test', items, couponCode }) });
    }
    const item = { productId: 'p', variantId: 'v', quantity: 1, price: 1 };
    const placed = await post([item]);
    assert.equal(placed.status, 201);
    const placement = await placed.json();
    const orderUrl = `http://127.0.0.1:${server.address().port}/orders/order-test`;
    assert.equal((await fetch(orderUrl)).status, 404);
    assert.equal((await fetch(orderUrl, { headers: { 'x-order-token': placement.accessToken } })).status, 200);
    assert.equal((await fetch(orderUrl, { headers: { 'x-order-token': 'invalid' } })).status, 404);
    assert.equal(created.subtotal, 329000); // Client price cannot override catalog price.
    assert.equal(created.totalAmount, 359000);
    for (const quantity of [-1, 0, 1.5, 6]) assert.equal((await post([{ ...item, quantity }])).status, 400);
    assert.equal((await post([{ ...item, quantity: 3 }, { ...item, quantity: 3 }])).status, 400);
    assert.equal((await post([item], 'EXPIRED')).status, 400);
    assert.equal(product.variants[0].stock, 5);
    console.log('PASS: catalog prices, shipping, quantity, aggregate stock, expired coupon, no stock inflation');
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
