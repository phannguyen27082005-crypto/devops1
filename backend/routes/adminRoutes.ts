import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Apply security middleware to ALL admin routes!
router.use(authenticateToken);
router.use(requireAdmin);

// ==========================================
// 1. DASHBOARD OVERVIEW & ANALYTICS
// ==========================================
router.get('/dashboard', (req: AuthRequest, res: Response) => {
  try {
    const stats = db.getDashboardStats();
    return res.json({ success: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải dữ liệu thống kê quản trị', error: error.message });
  }
});

// ==========================================
// 2. PRODUCT MANAGEMENT (CRUD)
// ==========================================
router.get('/products', (req: AuthRequest, res: Response) => {
  try {
    const { categoryId, search, status, page, limit } = req.query;
    const result = db.listProducts({
      categoryId: categoryId as string,
      search: search as string,
      status: (status as string) || 'ALL',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách sản phẩm', error: error.message });
  }
});

router.get('/products/:id', (req: AuthRequest, res: Response) => {
  try {
    const product = db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    return res.json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải sản phẩm', error: error.message });
  }
});

router.post('/products', (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      categoryId,
      brand,
      price,
      salePrice,
      description,
      details,
      images,
      variants,
      status,
      isFeatured,
      isNewArrival,
      isFlashSale,
    } = req.body;

    if (!name || !categoryId || !price) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Tên sản phẩm, Danh mục và Giá bán' });
    }

    if (Number(price) < 0 || (salePrice && Number(salePrice) < 0)) {
      return res.status(400).json({ success: false, message: 'Giá sản phẩm không được là số âm' });
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') + `-${Date.now().toString().slice(-4)}`;

    const formattedVariants = (Array.isArray(variants) ? variants : []).map((v: any, idx: number) => ({
      id: v.id || `var-${Date.now()}-${idx}`,
      productId: '',
      size: v.size || 'FreeSize',
      color: v.color || 'Tiêu chuẩn',
      colorCode: v.colorCode || '#000000',
      stock: Number(v.stock) || 0,
      price: v.price ? Number(v.price) : undefined,
      sku: v.sku || `${slug.toUpperCase().slice(0, 8)}-${v.size || 'FS'}-${idx}`,
    }));

    const newProduct = db.createProduct({
      name: name.trim(),
      slug,
      categoryId,
      brand: brand ? brand.trim() : 'Maison',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      description: description ? description.trim() : '',
      details: Array.isArray(details) ? details : [],
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
      variants: formattedVariants,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isFlashSale: Boolean(isFlashSale),
      status: status || 'ACTIVE',
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm mới thành công',
      data: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tạo sản phẩm', error: error.message });
  }
});

router.put('/products/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price !== undefined && Number(updates.price) < 0) {
      return res.status(400).json({ success: false, message: 'Giá sản phẩm không thể là số âm' });
    }

    const updated = db.updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm cần cập nhật' });
    }

    return res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật sản phẩm', error: error.message });
  }
});

router.delete('/products/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để xóa' });
    }
    return res.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa sản phẩm', error: error.message });
  }
});

// ==========================================
// 3. CATEGORY MANAGEMENT (CRUD)
// ==========================================
router.get('/categories', (req: AuthRequest, res: Response) => {
  try {
    const categories = db.listCategories();
    return res.json({ success: true, data: categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh mục', error: error.message });
  }
});

router.post('/categories', (req: AuthRequest, res: Response) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên danh mục' });
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const newCat = db.createCategory({
      name: name.trim(),
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    });

    return res.status(201).json({ success: true, message: 'Thêm danh mục thành công', data: newCat });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tạo danh mục', error: error.message });
  }
});

router.put('/categories/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;
    const updated = db.updateCategory(id, {
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(image && { image: image.trim() }),
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }

    return res.json({ success: true, message: 'Cập nhật danh mục thành công', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật danh mục', error: error.message });
  }
});

router.delete('/categories/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteCategory(id);
    return res.json({ success: true, message: 'Đã xóa danh mục thành công' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. ORDER MANAGEMENT
// ==========================================
router.get('/orders', (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    const orders = db.listOrders({
      status: status as string,
      search: search as string,
    });
    return res.json({ success: true, data: orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách đơn hàng', error: error.message });
  }
});

router.get('/orders/:id', (req: AuthRequest, res: Response) => {
  try {
    const order = db.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    return res.json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết đơn hàng', error: error.message });
  }
});

router.put('/orders/:id/status', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ' });
    }

    const updated = db.updateOrderStatus(id, orderStatus, paymentStatus);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    return res.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng #${updated.orderCode} sang ${updated.orderStatus}`,
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái đơn hàng', error: error.message });
  }
});

// ==========================================
// 5. CUSTOMER MANAGEMENT
// ==========================================
router.get('/users', (req: AuthRequest, res: Response) => {
  try {
    const customers = db.listCustomers();
    return res.json({ success: true, data: customers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách khách hàng', error: error.message });
  }
});

router.put('/users/:id/status', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.toggleCustomerStatus(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng hoặc không thể thao tác trên tài khoản Quản trị' });
    }
    return res.json({
      success: true,
      message: `Đã ${updated.status === 'BLOCKED' ? 'khóa' : 'mở khóa'} tài khoản khách hàng thành công`,
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái người dùng', error: error.message });
  }
});

// ==========================================
// 6. INVENTORY MANAGEMENT
// ==========================================
router.get('/inventory', (req: AuthRequest, res: Response) => {
  try {
    const inventory = db.getInventory();
    return res.json({ success: true, data: inventory });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải kho hàng', error: error.message });
  }
});

router.put('/inventory/:productId/:variantId', (req: AuthRequest, res: Response) => {
  try {
    const { productId, variantId } = req.params;
    const { stock } = req.body;
    if (stock === undefined || Number(stock) < 0) {
      return res.status(400).json({ success: false, message: 'Số lượng tồn kho không được âm' });
    }

    const success = db.updateVariantStock(productId, variantId, Number(stock));
    if (!success) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm hoặc biến thể để cập nhật tồn kho' });
    }

    return res.json({ success: true, message: 'Cập nhật số lượng tồn kho thành công' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật tồn kho', error: error.message });
  }
});

// ==========================================
// 7. COUPON MANAGEMENT
// ==========================================
router.get('/coupons', (req: AuthRequest, res: Response) => {
  try {
    const coupons = db.listCoupons();
    return res.json({ success: true, data: coupons });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách mã giảm giá', error: error.message });
  }
});

router.post('/coupons', (req: AuthRequest, res: Response) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
    } = req.body;

    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin mã giảm giá' });
    }

    const existing = db.findCouponByCode(code);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Mã giảm giá này đã tồn tại' });
    }

    const newCoupon = db.createCoupon({
      code: code.trim().toUpperCase(),
      description: description || '',
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: Number(usageLimit) || 100,
      startDate,
      endDate,
      status: 'ACTIVE',
    });

    return res.status(201).json({ success: true, message: 'Tạo mã giảm giá thành công', data: newCoupon });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tạo mã giảm giá', error: error.message });
  }
});

router.put('/coupons/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateCoupon(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mã giảm giá' });
    }
    return res.json({ success: true, message: 'Cập nhật mã giảm giá thành công', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật mã giảm giá', error: error.message });
  }
});

router.delete('/coupons/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteCoupon(id);
    return res.json({ success: true, message: 'Đã xóa mã giảm giá thành công' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa mã giảm giá', error: error.message });
  }
});

// ==========================================
// 8. BANNER MANAGEMENT
// ==========================================
router.get('/banners', (req: AuthRequest, res: Response) => {
  try {
    const banners = db.listBanners(false);
    return res.json({ success: true, data: banners });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách banner', error: error.message });
  }
});

router.post('/banners', (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, badge, link, image, buttonText, position, order, active } = req.body;
    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Tiêu đề và Hình ảnh banner' });
    }

    const newBanner = db.createBanner({
      title: title.trim(),
      subtitle: subtitle || '',
      badge: badge || '',
      link: link || '/products',
      image: image.trim(),
      buttonText: buttonText || 'Khám phá ngay',
      position: position || 'HERO',
      order: Number(order) || 1,
      active: active !== undefined ? Boolean(active) : true,
    });

    return res.status(201).json({ success: true, message: 'Tạo banner mới thành công', data: newBanner });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tạo banner', error: error.message });
  }
});

router.put('/banners/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateBanner(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy banner' });
    }
    return res.json({ success: true, message: 'Cập nhật banner thành công', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật banner', error: error.message });
  }
});

router.delete('/banners/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteBanner(id);
    return res.json({ success: true, message: 'Đã xóa banner thành công' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa banner', error: error.message });
  }
});

// ==========================================
// 9. REVIEWS MODERATION
// ==========================================
router.get('/reviews', (req: AuthRequest, res: Response) => {
  try {
    const reviews = db.listReviews();
    return res.json({ success: true, data: reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách đánh giá', error: error.message });
  }
});

router.put('/reviews/:id/toggle', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.toggleReviewStatus(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }
    return res.json({
      success: true,
      message: `Đã ${updated.status === 'APPROVED' ? 'hiện' : 'ẩn'} đánh giá`,
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái đánh giá', error: error.message });
  }
});

router.delete('/reviews/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteReview(id);
    return res.json({ success: true, message: 'Đã xóa đánh giá thành công' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa đánh giá', error: error.message });
  }
});

// ==========================================
// 10. STORE SETTINGS
// ==========================================
router.get('/settings', (req: AuthRequest, res: Response) => {
  try {
    const settings = db.getSettings();
    return res.json({ success: true, data: settings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải cài đặt cửa hàng', error: error.message });
  }
});

router.put('/settings', (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    return res.json({ success: true, message: 'Cập nhật thông tin cửa hàng thành công', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật cài đặt', error: error.message });
  }
});

// ==========================================
// 11. SQL SERVER DATABASE MANAGEMENT & MONITORING
// ==========================================
router.get('/db/status', async (req: AuthRequest, res: Response) => {
  try {
    const { checkSqlConnection, getPool } = await import('../db/sqlClient.js');
    const health = await checkSqlConnection();

    let tableCounts: Record<string, number> = {};
    if (health.connected) {
      const pool = await getPool();
      const r = await pool.request().query(`
        SELECT t.NAME AS TableName, p.rows AS RowCounts
        FROM sys.tables t
        INNER JOIN sys.partitions p ON t.object_id = p.OBJECT_ID
        WHERE p.index_id IN (0,1)
        ORDER BY t.NAME
      `);
      for (const row of r.recordset) {
        tableCounts[row.TableName] = row.RowCounts;
      }
    }

    return res.json({
      success: true,
      data: {
        engine: 'Microsoft SQL Server',
        connected: health.connected,
        message: health.message,
        version: health.version,
        server: `${process.env.DB_SERVER || 'localhost'}\\${process.env.DB_INSTANCE || 'SQLEXPRESS'}`,
        database: process.env.DB_NAME || 'nguyen_fashion',
        tableCounts,
        inMemoryStats: {
          products: db.listProducts({ status: 'ALL', limit: 1000 }).total,
          customers: db.listCustomers().length,
          orders: db.listOrders().length,
          categories: db.listCategories().length,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi kiểm tra CSDL SQL Server', error: error.message });
  }
});

router.post('/db/sync', async (req: AuthRequest, res: Response) => {
  try {
    const { syncDatabaseToSqlServer } = await import('../db/syncToSqlServer.js');
    await syncDatabaseToSqlServer();
    return res.json({
      success: true,
      message: 'Đồng bộ toàn bộ dữ liệu vào Microsoft SQL Server (nguyen_fashion) thành công 100%!',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi đồng bộ dữ liệu vào SQL Server', error: error.message });
  }
});

// ==========================================
// 12. ADVANCED REVENUE & SALES ANALYTICS
// ==========================================
router.get('/analytics/revenue', (req: AuthRequest, res: Response) => {
  try {
    const orders = db.listOrders();
    const deliveredOrders = orders.filter(o => o.orderStatus === 'DELIVERED');
    const confirmedOrders = orders.filter(o => o.orderStatus !== 'CANCELLED');

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const potentialRevenue = confirmedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Sales by category
    const categorySales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const order of deliveredOrders) {
      for (const item of order.items) {
        const prod = db.findProductById(item.productId);
        const catName = prod?.categoryName || 'Khác';
        if (!categorySales[catName]) {
          categorySales[catName] = { name: catName, quantity: 0, revenue: 0 };
        }
        categorySales[catName].quantity += item.quantity;
        categorySales[catName].revenue += item.total;
      }
    }

    // Top selling products
    const productSales: Record<string, { id: string; name: string; sold: number; revenue: number; image?: string }> = {};
    for (const order of confirmedOrders) {
      for (const item of order.items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            name: item.productName,
            sold: 0,
            revenue: 0,
            image: item.imageUrl,
          };
        }
        productSales[item.productId].sold += item.quantity;
        productSales[item.productId].revenue += item.total;
      }
    }

    const topSelling = Object.values(productSales)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return res.json({
      success: true,
      data: {
        totalRevenue,
        potentialRevenue,
        totalOrders: orders.length,
        deliveredOrdersCount: deliveredOrders.length,
        pendingOrdersCount: orders.filter(o => o.orderStatus === 'PENDING').length,
        categorySales: Object.values(categorySales),
        topSellingProducts: topSelling,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi tải báo cáo doanh thu', error: error.message });
  }
});

export default router;
