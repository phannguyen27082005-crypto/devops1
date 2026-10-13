import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';
import { getPool, sql } from '../db/sqlClient.js';

const router = Router();
router.use(authenticateToken);
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().input('userId', sql.VarChar(36), req.user!.id)
      .query('SELECT payload FROM dbo.account_carts WHERE user_id=@userId');
    const stored = result.recordset.length ? JSON.parse(result.recordset[0].payload) : [];
    const items = stored.flatMap((item: any) => {
      const product = db.findProductById(item.productId);
      const variant = product?.variants.find(v => v.id === item.variantId);
      if (!product || product.status !== 'ACTIVE' || !variant || variant.stock <= 0) return [];
      return [{ ...item, productName: product.name, size: variant.size, color: variant.color,
        price: variant.price || product.salePrice || product.price, originalPrice: product.price,
        maxStock: variant.stock, quantity: Math.min(item.quantity, variant.stock) }];
    });
    res.json({ success: true, data: { items, exists: result.recordset.length > 0 } });
  } catch (error) { next(error); }
});
router.put('/', async (req: AuthRequest, res, next) => {
  try {
    if (!Array.isArray(req.body.items) || req.body.items.length > 100) {
      res.status(400).json({ success: false, message: 'Giỏ hàng không hợp lệ' }); return;
    }
    const items: any[] = [];
    for (const input of req.body.items) {
      if (!input || !Number.isSafeInteger(input.quantity) || input.quantity <= 0) {
        res.status(400).json({ success: false, message: 'Số lượng giỏ hàng không hợp lệ' }); return;
      }
      const product = db.findProductById(input.productId);
      const variant = product?.variants.find(v => v.id === input.variantId);
      if (!product || product.status !== 'ACTIVE' || !variant || variant.stock <= 0) continue;
      const existing = items.find(i => i.variantId === variant.id && i.productId === product.id);
      if (existing) { existing.quantity = Math.min(existing.quantity + input.quantity, variant.stock); continue; }
      items.push({ id: `${product.id}_${variant.id}`, productId: product.id, variantId: variant.id,
        productName: product.name, slug: product.slug, size: variant.size, color: variant.color,
        colorCode: variant.colorCode, price: variant.price || product.salePrice || product.price,
        originalPrice: product.price, quantity: Math.min(input.quantity, variant.stock),
        image: (variant as any).image || (product as any).colorImages?.[variant.color]?.[0] || product.images[0] || '',
        maxStock: variant.stock, sku: variant.sku });
    }
    const pool = await getPool();
    await pool.request().input('userId', sql.VarChar(36), req.user!.id)
      .input('payload', sql.NVarChar(sql.MAX), JSON.stringify(items)).query(`
        SET XACT_ABORT ON; BEGIN TRANSACTION;
        IF EXISTS (SELECT 1 FROM dbo.account_carts WITH (UPDLOCK,HOLDLOCK) WHERE user_id=@userId)
          UPDATE dbo.account_carts SET payload=@payload, updated_at=SYSUTCDATETIME() WHERE user_id=@userId;
        ELSE INSERT INTO dbo.account_carts (user_id,payload) VALUES (@userId,@payload);
        COMMIT TRANSACTION;
      `);
    res.json({ success: true, data: { items } });
  } catch (error) { next(error); }
});
export default router;
