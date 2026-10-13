import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/orders (Create order)
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      province,
      district,
      ward,
      note,
      paymentMethod,
      items,
      couponCode,
    } = req.body;

    if (!customerName || !customerPhone || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng của bạn đang trống' });
    }

    // Validate item stock & prices
    let subtotal = 0;
    const validatedItems = [];
    const requestedStock = new Map<string, number>();

    for (const item of items) {
      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Số lượng sản phẩm phải là số nguyên dương' });
      }
      let prod = db.findProductById(item.productId);
      if (!prod && item.productName) {
        prod = (db as any).findProductByName?.(item.productName);
      }

      if (!prod || prod.status !== 'ACTIVE') {
        return res.status(400).json({ success: false, message: 'Sản phẩm không tồn tại hoặc đã ngừng bán. Vui lòng cập nhật giỏ hàng.' });
      }
      let variant = item.variantId ? prod.variants?.find((v: any) => v.id === item.variantId) : undefined;
      if (!variant && !item.variantId && prod.variants && prod.variants.length > 0) {
        variant = prod.variants.find((v: any) => v.size === item.size && v.color === item.color);
      }

      if (!variant) {
        return res.status(400).json({ success: false, message: 'Size hoặc màu sản phẩm không hợp lệ' });
      }
      const stockKey = `${prod.id}:${variant.id}`;
      const quantityRequested = (requestedStock.get(stockKey) || 0) + item.quantity;
      if (variant.stock < quantityRequested) {
        return res.status(400).json({ success: false, message: `${prod.name} chỉ còn ${variant.stock} sản phẩm cho size và màu đã chọn` });
      }
      requestedStock.set(stockKey, quantityRequested);

      const unitPrice = variant.price || prod.salePrice || prod.price;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        orderId: '',
        productId: prod.id,
        variantId: variant?.id || item.variantId || 'v-default',
        productName: prod.name,
        size: variant.size,
        color: variant.color,
        price: unitPrice,
        quantity: item.quantity,
        total: itemTotal,
        imageUrl: item.imageUrl || item.image || (prod.images && prod.images[0]) || '',
      });
    }

    // Shipping fee
    const settings = db.getSettings();
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFeeStandard;

    // Coupon calculation
    let discountAmount = 0;
    if (couponCode) {
      const coupon = db.findCouponByCode(couponCode.trim());
      const today = new Date().toISOString().split('T')[0];
      if (!coupon || coupon.startDate > today || coupon.endDate < today || coupon.usedCount >= coupon.usageLimit || subtotal < coupon.minOrderValue) {
        return res.status(400).json({ success: false, message: 'Mã giảm giá không còn hợp lệ hoặc đơn hàng chưa đủ điều kiện' });
      }
      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENT') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

    const finalEmail = customerEmail && customerEmail.trim()
      ? customerEmail.trim().toLowerCase()
      : `${customerPhone.trim().replace(/\D/g, '') || 'guest'}@nguyenfashion.vn`;

    const newOrder = db.createOrder({
      userId: req.user?.id,
      customerName: customerName.trim(),
      customerEmail: finalEmail,
      customerPhone: customerPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      province: province || 'Việt Nam',
      district: district || '',
      ward: ward || '',
      note: note ? note.trim() : '',
      subtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      couponCode: couponCode ? couponCode.trim().toUpperCase() : undefined,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'BANK_TRANSFER' ? 'PENDING' : 'PENDING',
      orderStatus: 'PENDING',
      items: validatedItems,
    });

    return res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: newOrder,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi xử lý đơn hàng', error: error.message });
  }
});

// GET /api/orders (Customer order history)
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const orders = db.listOrders({ userId: req.user!.id });
    return res.json({ success: true, data: orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải lịch sử đơn hàng', error: error.message });
  }
});

// GET /api/orders/:id (Order details)
router.get('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = db.findOrderById(id);

    if (!order || (order.userId !== req.user!.id && req.user!.role !== 'ADMIN')) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    return res.json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết đơn hàng', error: error.message });
  }
});

// PUT /api/orders/:id/cancel (Customer cancel order)
router.put('/:id/cancel', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = db.findOrderById(id) || db.listOrders().find(o => o.orderCode === id);
    if (!order || (order.userId !== req.user!.id && req.user!.role !== 'ADMIN')) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    // Only allow cancelling if order is in PENDING or CONFIRMED state
    if (order.orderStatus === 'SHIPPING' || order.orderStatus === 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng đang trên đường giao hoặc đã giao thành công, không thể tự hủy. Vui lòng liên hệ hotline.',
      });
    }

    if (order.orderStatus === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Đơn hàng này đã bị hủy trước đó' });
    }

    const cancelReasonText = reason && reason.trim() ? reason.trim() : 'Khách hàng yêu cầu hủy đơn';
    const updated = db.cancelOrder(order.id, cancelReasonText);

    return res.json({
      success: true,
      message: 'Hủy đơn hàng thành công',
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi hủy đơn hàng', error: error.message });
  }
});

// POST /api/orders/:id/return (Customer request return or exchange size)
router.post('/:id/return', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, reason, targetSize, bankInfo, note } = req.body;

    const order = db.findOrderById(id) || db.listOrders().find(o => o.orderCode === id);
    if (!order || (order.userId !== req.user!.id && req.user!.role !== 'ADMIN')) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    if (order.orderStatus === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng này đã bị hủy, không thể yêu cầu trả hàng hoặc đổi size.',
      });
    }

    const updated = db.requestReturnOrder(order.id, {
      type: type || 'EXCHANGE_SIZE',
      reason: reason || 'Mang không vừa size (quá chật / quá rộng)',
      targetSize: targetSize || undefined,
      bankInfo: bankInfo || undefined,
      note: note ? note.trim() : undefined,
    });

    return res.json({
      success: true,
      message: type === 'EXCHANGE_SIZE'
        ? 'Gửi yêu cầu đổi size thành công! Shipper sẽ liên hệ mang size mới đổi tận nơi cho bạn.'
        : 'Gửi yêu cầu trả hàng & hoàn tiền thành công! CSKH sẽ liên hệ hỗ trợ thu hồi và hoàn tiền.',
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi gửi yêu cầu trả hàng / đổi size', error: error.message });
  }
});

export default router;
