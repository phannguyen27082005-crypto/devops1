import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// In-memory cart store keyed by userId or sessionId
// Cart key: userId (if logged in) or x-session-id / session query param
interface ServerCartItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  slug: string;
  size: string;
  color: string;
  colorCode?: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  maxStock: number;
  sku?: string;
}

const userCarts: Map<string, ServerCartItem[]> = new Map();

function getCartKey(req: AuthRequest): string {
  if (req.user?.id) {
    return req.user.id;
  }
  const sessionHeader = req.headers['x-session-id'] as string;
  if (sessionHeader) {
    return sessionHeader;
  }
  const sessionQuery = req.query.sessionId as string;
  if (sessionQuery) {
    return sessionQuery;
  }
  // Default fallback ip / client identifier
  return (req.ip || 'anonymous-session').replace(/:/g, '_');
}

// 1. GET /api/cart
router.get('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const key = getCartKey(req);
    const items = userCarts.get(key) || [];

    // Re-verify stocks in case inventory changed
    const validatedItems = items.map(item => {
      const prod = db.findProductById(item.productId);
      if (!prod) return { ...item, maxStock: 0 };
      const variant = prod.variants.find(v => v.id === item.variantId);
      const stock = variant ? variant.stock : 0;
      return {
        ...item,
        price: prod.salePrice || prod.price,
        originalPrice: prod.price,
        maxStock: stock,
        quantity: Math.min(item.quantity, Math.max(1, stock)),
      };
    });

    userCarts.set(key, validatedItems);

    const subtotal = validatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const totalQuantity = validatedItems.reduce((acc, i) => acc + i.quantity, 0);

    return res.json({
      success: true,
      data: {
        items: validatedItems,
        totalQuantity,
        subtotal,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải giỏ hàng', error: error.message });
  }
});

// 2. POST /api/cart (Add item to cart)
router.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const key = getCartKey(req);
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp productId' });
    }

    const prod = db.findProductById(productId);
    if (!prod) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    const variant = prod.variants.find(v => v.id === variantId) || prod.variants[0];
    if (!variant) {
      return res.status(400).json({ success: false, message: 'Sản phẩm không có biến thể hợp lệ' });
    }

    if (variant.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Sản phẩm đã hết hàng trong kho' });
    }

    let items = userCarts.get(key) || [];
    const existingIndex = items.findIndex(i => i.productId === prod.id && i.variantId === variant.id);

    const unitPrice = prod.salePrice || prod.price;
    const addQty = Math.max(1, Number(quantity) || 1);

    if (existingIndex > -1) {
      const newQty = Math.min(items[existingIndex].quantity + addQty, variant.stock);
      items[existingIndex].quantity = newQty;
      items[existingIndex].price = unitPrice;
      items[existingIndex].maxStock = variant.stock;
    } else {
      const newItem: ServerCartItem = {
        id: `${prod.id}_${variant.id}`,
        productId: prod.id,
        variantId: variant.id,
        productName: prod.name,
        slug: prod.slug,
        size: variant.size,
        color: variant.color,
        colorCode: variant.colorCode,
        price: unitPrice,
        originalPrice: prod.price,
        quantity: Math.min(addQty, variant.stock),
        image: prod.images[0] || '',
        maxStock: variant.stock,
        sku: variant.sku,
      };
      items.push(newItem);
    }

    userCarts.set(key, items);

    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);

    return res.status(200).json({
      success: true,
      message: 'Đã thêm sản phẩm vào giỏ hàng',
      data: {
        items,
        totalQuantity,
        subtotal,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi thêm vào giỏ hàng', error: error.message });
  }
});

// 3. PUT /api/cart/:variantId (Update item quantity)
router.put('/:variantId', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const key = getCartKey(req);
    const { variantId } = req.params;
    const { quantity } = req.body;

    let items = userCarts.get(key) || [];
    const itemIndex = items.findIndex(i => i.variantId === variantId || i.id === variantId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ hàng' });
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      items.splice(itemIndex, 1);
    } else {
      const max = items[itemIndex].maxStock;
      items[itemIndex].quantity = Math.min(newQty, max);
    }

    userCarts.set(key, items);

    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);

    return res.json({
      success: true,
      message: 'Cập nhật số lượng giỏ hàng thành công',
      data: {
        items,
        totalQuantity,
        subtotal,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật giỏ hàng', error: error.message });
  }
});

// 4. DELETE /api/cart/:variantId (Remove item)
router.delete('/:variantId', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const key = getCartKey(req);
    const { variantId } = req.params;

    let items = userCarts.get(key) || [];
    items = items.filter(i => i.variantId !== variantId && i.id !== variantId);
    userCarts.set(key, items);

    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);

    return res.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
      data: {
        items,
        totalQuantity,
        subtotal,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa sản phẩm khỏi giỏ hàng', error: error.message });
  }
});

// 5. DELETE /api/cart (Clear whole cart)
router.delete('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const key = getCartKey(req);
    userCarts.delete(key);

    return res.json({
      success: true,
      message: 'Đã làm trống giỏ hàng',
      data: {
        items: [],
        totalQuantity: 0,
        subtotal: 0,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi làm sạch giỏ hàng', error: error.message });
  }
});

export default router;
