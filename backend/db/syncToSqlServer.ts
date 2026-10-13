import fs from 'fs';
import path from 'path';
import { getPool, sql } from './sqlClient.js';

interface SyncData {
  users: any[];
  categories: any[];
  products: any[];
  orders: any[];
  coupons: any[];
  banners: any[];
  reviews: any[];
}

export async function syncDatabaseToSqlServer(): Promise<void> {
  const pool = await getPool();
  console.log('[Sync] Bắt đầu đồng bộ dữ liệu vào SQL Server...');

  // 1. Đọc dữ liệu từ store.json
  const dataPath = path.join(process.cwd(), 'data', 'store.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Không tìm thấy file dữ liệu: ${dataPath}`);
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data: SyncData = JSON.parse(raw);

  // 2. Đảm bảo cấu trúc bảng và cột bổ sung
  await pool.request().query(`
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('orders') AND name = 'return_request')
      ALTER TABLE orders ADD return_request NVARCHAR(MAX) NULL;
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('orders') AND name = 'cancel_reason')
      ALTER TABLE orders ADD cancel_reason NVARCHAR(MAX) NULL;
    DECLARE @constraintName SYSNAME;
    SELECT @constraintName = name FROM sys.check_constraints
      WHERE parent_object_id = OBJECT_ID('orders') AND definition LIKE '%order_status%';
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID('orders')
      AND definition LIKE '%order_status%' AND definition LIKE '%RETURN_REQUESTED%')
    BEGIN
      IF @constraintName IS NOT NULL
        EXEC('ALTER TABLE orders DROP CONSTRAINT ' + @constraintName);
      ALTER TABLE orders ADD CONSTRAINT CK_orders_status CHECK
        (order_status IN ('PENDING','CONFIRMED','PROCESSING','SHIPPING','DELIVERED','CANCELLED','RETURN_REQUESTED'));
    END;
    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('product_variants') AND name = 'size' AND max_length < 200)
      ALTER TABLE product_variants ALTER COLUMN size NVARCHAR(100) NOT NULL;
    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('order_items') AND name = 'size' AND max_length < 200)
      ALTER TABLE order_items ALTER COLUMN size NVARCHAR(100) NULL;
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('products') AND name = 'details')
      ALTER TABLE products ADD details NVARCHAR(MAX) NULL;

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('categories') AND name = 'item_count')
      ALTER TABLE categories ADD item_count INT DEFAULT 0;

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('reviews') AND name = 'user_name')
      ALTER TABLE reviews ADD user_name NVARCHAR(100) NULL;

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('reviews') AND name = 'user_avatar')
      ALTER TABLE reviews ADD user_avatar NVARCHAR(500) NULL;
  `);

  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    // Older SQL seeds used different product IDs. Reuse the row with the same
    // unique slug and remap references in this import, preserving foreign keys.
    const existingProducts = await transaction.request().query('SELECT id, slug FROM products');
    const productIds = new Map<string, string>();
    for (const product of data.products) {
      const existing = existingProducts.recordset.find(row => row.slug === product.slug);
      productIds.set(product.id, existing?.id || product.id);
      product.id = existing?.id || product.id;
    }
    for (const review of data.reviews) review.productId = productIds.get(review.productId) || review.productId;
    for (const order of data.orders) {
      for (const item of order.items || []) item.productId = productIds.get(item.productId) || item.productId;
    }
    const importedProductIds = new Set([...data.products.map(p => p.id), ...existingProducts.recordset.map(p => p.id)]);
    for (const order of data.orders) {
      for (const item of order.items || []) {
        if (!importedProductIds.has(item.productId)) {
          // Keep snapshots of removed products for historical order references.
          data.products.push({ id: item.productId, name: item.productName,
            slug: `archived-${item.productId}`, categoryId: data.categories[0].id,
            price: item.price, description: 'Sản phẩm ngừng bán, lưu cho lịch sử đơn hàng.',
            images: item.imageUrl ? [item.imageUrl] : [], variants: [], status: 'INACTIVE' });
          importedProductIds.add(item.productId);
        }
      }
    }
    // Preserve SQL-only records and update matching IDs.
    // 4. Đồng bộ Sizes & Colors tham chiếu
    console.log('[Sync] Đang chèn Sizes & Colors...');
    const sizes = [
      { id: 'sz-s', code: 'S', name: 'Size S' },
      { id: 'sz-m', code: 'M', name: 'Size M' },
      { id: 'sz-l', code: 'L', name: 'Size L' },
      { id: 'sz-xl', code: 'XL', name: 'Size XL' },
      { id: 'sz-xxl', code: 'XXL', name: 'Size XXL' },
    ];
    for (const s of sizes) {
      await transaction.request()
        .input('id', sql.VarChar(36), s.id)
        .input('code', sql.VarChar(10), s.code)
        .input('name', sql.NVarChar(50), s.name)
        .query(`IF EXISTS (SELECT 1 FROM [sizes] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [sizes] SET [code] = @code, [name] = @name WHERE id = @id;
          ELSE INSERT INTO sizes (id, code, name) VALUES (@id, @code, @name);`);
    }

    const colors = [
      { id: 'col-black', name: 'Đen', hex: '#111827' },
      { id: 'col-white', name: 'Trắng', hex: '#F9FAFB' },
      { id: 'col-beige', name: 'Be', hex: '#F5F5DC' },
      { id: 'col-navy', name: 'Xanh Navy', hex: '#1E3A8A' },
      { id: 'col-gray', name: 'Xám', hex: '#6B7280' },
      { id: 'col-blue', name: 'Xanh Jeans', hex: '#3B82F6' },
      { id: 'col-pink', name: 'Hồng Pastel', hex: '#F472B6' },
    ];
    for (const c of colors) {
      await transaction.request()
        .input('id', sql.VarChar(36), c.id)
        .input('name', sql.NVarChar(50), c.name)
        .input('hex', sql.VarChar(10), c.hex)
        .query(`IF EXISTS (SELECT 1 FROM [colors] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [colors] SET [name] = @name, [hex_code] = @hex WHERE id = @id;
          ELSE INSERT INTO colors (id, name, hex_code) VALUES (@id, @name, @hex);`);
    }

    // 5. Đồng bộ Users & Admins
    console.log(`[Sync] Đang chèn ${data.users.length} Users...`);
    const existingUserIds = new Set(data.users.map(u => u.id));

    // Bổ sung tài khoản cho các user xuất hiện trong reviews nếu chưa có
    const extraUsers = [
      { id: 'user-2', name: 'Trần Hoàng Nam', email: 'nam.tran@example.com', role: 'CUSTOMER', status: 'ACTIVE' },
      { id: 'user-3', name: 'Vũ Mai Hương', email: 'huong.vu@example.com', role: 'CUSTOMER', status: 'ACTIVE' },
      { id: 'user-4', name: 'Đặng Quốc Bảo', email: 'bao.dang@example.com', role: 'CUSTOMER', status: 'ACTIVE' },
    ];
    for (const eu of extraUsers) {
      if (!existingUserIds.has(eu.id)) {
        data.users.push({
          ...eu,
          passwordHash: '$2b$10$bnpQDNpo5erDmlTg8GEWCOZ9R6h.HZBJbkc4bw6OV0ljvDrEVhl2m',
          phone: '0977889900',
          createdAt: '2025-01-10T00:00:00Z',
        });
        existingUserIds.add(eu.id);
      }
    }

    // Preserve author references in historical/demo reviews without creating
    // usable login accounts for authors absent from the local user list.
    const sqlUsers = await transaction.request().query('SELECT id FROM users');
    const knownUsers = new Set([...data.users.map(u => u.id), ...sqlUsers.recordset.map(u => u.id)]);
    for (const reference of [...data.reviews, ...data.orders]) {
      if (reference.userId && !knownUsers.has(reference.userId)) {
        data.users.push({ id: reference.userId, name: reference.userName || reference.customerName || 'Khách hàng cũ',
          email: `${reference.userId}@seed.invalid`, passwordHash: '', role: 'CUSTOMER', status: 'BLOCKED' });
        knownUsers.add(reference.userId);
      }
    }

    for (const u of data.users) {
      await transaction.request()
        .input('id', sql.VarChar(36), u.id)
        .input('name', sql.NVarChar(100), u.name)
        .input('email', sql.NVarChar(150), u.email)
        .input('pwd', sql.VarChar(255), u.passwordHash)
        .input('phone', sql.VarChar(20), u.phone || null)
        .input('avatar', sql.NVarChar(500), u.avatar || null)
        .input('role', sql.VarChar(20), u.role)
        .input('status', sql.VarChar(20), u.status)
        .input('createdAt', sql.DateTime2, new Date(u.createdAt || Date.now()))
        .query(`
          IF EXISTS (SELECT 1 FROM [users] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [users] SET [name] = @name, [email] = @email, [password_hash] = @pwd, [phone] = @phone, [avatar] = @avatar, [role] = @role, [status] = @status WHERE id = @id;
          ELSE INSERT INTO users (id, name, email, password_hash, phone, avatar, role, status, created_at)
          VALUES (@id, @name, @email, @pwd, @phone, @avatar, @role, @status, @createdAt);
        `);

      if (u.role === 'ADMIN') {
        await transaction.request()
          .input('adminId', sql.VarChar(36), `admin-${u.id}`)
          .input('userId', sql.VarChar(36), u.id)
          .input('dept', sql.NVarChar(50), 'BAN GIÁM ĐỐC / IT DEVOPS')
          .input('perms', sql.NVarChar(sql.MAX), JSON.stringify(['ALL_PRIVILEGES', 'PRODUCTS_MANAGE', 'ORDERS_MANAGE', 'REVENUE_VIEW']))
          .query(`
            IF EXISTS (SELECT 1 FROM [admins] WITH (UPDLOCK, HOLDLOCK) WHERE id = @adminId)
            UPDATE [admins] SET [user_id] = @userId, [department] = @dept, [permissions] = @perms WHERE id = @adminId;
          ELSE INSERT INTO admins (id, user_id, department, permissions, created_at)
            VALUES (@adminId, @userId, @dept, @perms, GETDATE());
          `);
      }
    }

    // 6. Đồng bộ Categories
    console.log(`[Sync] Đang chèn ${data.categories.length} Categories...`);
    for (const cat of data.categories) {
      await transaction.request()
        .input('id', sql.VarChar(36), cat.id)
        .input('name', sql.NVarChar(100), cat.name)
        .input('slug', sql.VarChar(120), cat.slug)
        .input('desc', sql.NVarChar(sql.MAX), cat.description || null)
        .input('image', sql.NVarChar(500), cat.image || null)
        .input('itemCount', sql.Int, cat.itemCount || 0)
        .query(`
          IF EXISTS (SELECT 1 FROM [categories] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [categories] SET [name] = @name, [slug] = @slug, [description] = @desc, [image] = @image, [item_count] = @itemCount WHERE id = @id;
          ELSE INSERT INTO categories (id, name, slug, description, image, item_count, created_at)
          VALUES (@id, @name, @slug, @desc, @image, @itemCount, GETDATE());
        `);
    }

    // 7. Đồng bộ Products, Product Images, Product Variants
    console.log(`[Sync] Đang chèn ${data.products.length} Products và các biến thể...`);
    for (const prod of data.products) {
      await transaction.request()
        .input('id', sql.VarChar(36), prod.id)
        .input('name', sql.NVarChar(200), prod.name)
        .input('slug', sql.VarChar(250), prod.slug)
        .input('categoryId', sql.VarChar(36), prod.categoryId)
        .input('brand', sql.NVarChar(100), prod.brand || 'Nguyen')
        .input('price', sql.Decimal(12, 2), prod.price)
        .input('salePrice', sql.Decimal(12, 2), prod.salePrice || null)
        .input('desc', sql.NVarChar(sql.MAX), prod.description || '')
        .input('rating', sql.Decimal(2, 1), prod.rating || 5.0)
        .input('reviewCount', sql.Int, prod.reviewCount || 0)
        .input('soldCount', sql.Int, prod.soldCount || 0)
        .input('isFeatured', sql.Bit, prod.isFeatured ? 1 : 0)
        .input('isNewArrival', sql.Bit, prod.isNewArrival ? 1 : 0)
        .input('isFlashSale', sql.Bit, prod.isFlashSale ? 1 : 0)
        .input('status', sql.VarChar(20), prod.status || 'ACTIVE')
        .input('details', sql.NVarChar(sql.MAX), JSON.stringify(prod.details || []))
        .input('createdAt', sql.DateTime2, new Date(prod.createdAt || Date.now()))
        .query(`
          IF EXISTS (SELECT 1 FROM [products] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [products] SET [name] = @name, [slug] = @slug, [category_id] = @categoryId, [brand] = @brand, [price] = @price, [sale_price] = @salePrice, [description] = @desc, [rating] = @rating, [review_count] = @reviewCount, [sold_count] = @soldCount, [is_featured] = @isFeatured, [is_new_arrival] = @isNewArrival, [is_flash_sale] = @isFlashSale, [status] = @status, [details] = @details WHERE id = @id;
          ELSE INSERT INTO products (
            id, name, slug, category_id, brand, price, sale_price, description,
            rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale,
            status, details, created_at
          ) VALUES (
            @id, @name, @slug, @categoryId, @brand, @price, @salePrice, @desc,
            @rating, @reviewCount, @soldCount, @isFeatured, @isNewArrival, @isFlashSale,
            @status, @details, @createdAt
          );
        `);

      // Chèn hình ảnh sản phẩm
      if (Array.isArray(prod.images)) {
        for (let i = 0; i < prod.images.length; i++) {
          const imgUrl = prod.images[i];
          await transaction.request()
            .input('imgId', sql.VarChar(36), `${prod.id}-img-${i + 1}`)
            .input('productId', sql.VarChar(36), prod.id)
            .input('imageUrl', sql.NVarChar(500), imgUrl)
            .input('isPrimary', sql.Bit, i === 0 ? 1 : 0)
            .input('displayOrder', sql.Int, i + 1)
            .query(`
              IF EXISTS (SELECT 1 FROM [product_images] WITH (UPDLOCK, HOLDLOCK) WHERE id = @imgId)
            UPDATE [product_images] SET [product_id] = @productId, [image_url] = @imageUrl, [is_primary] = @isPrimary, [display_order] = @displayOrder WHERE id = @imgId;
          ELSE INSERT INTO product_images (id, product_id, image_url, is_primary, display_order)
              VALUES (@imgId, @productId, @imageUrl, @isPrimary, @displayOrder);
            `);
        }
      }

      // Chèn biến thể (Variants: size, color, stock, sku)
      if (Array.isArray(prod.variants)) {
        for (const v of prod.variants) {
          await transaction.request()
            .input('varId', sql.VarChar(36), v.id)
            .input('productId', sql.VarChar(36), prod.id)
            .input('size', sql.NVarChar(100), v.size)
            .input('color', sql.NVarChar(50), v.color)
            .input('colorCode', sql.VarChar(10), v.colorCode || '#000000')
            .input('stock', sql.Int, v.stock || 0)
            .input('price', sql.Decimal(12, 2), v.price || prod.salePrice || prod.price)
            .input('sku', sql.VarChar(50), v.sku)
            .query(`
              IF EXISTS (SELECT 1 FROM [product_variants] WITH (UPDLOCK, HOLDLOCK) WHERE id = @varId)
            UPDATE [product_variants] SET [product_id] = @productId, [size] = @size, [color] = @color, [color_code] = @colorCode, [stock] = @stock, [price] = @price, [sku] = @sku WHERE id = @varId;
          ELSE INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at)
              VALUES (@varId, @productId, @size, @color, @colorCode, @stock, @price, @sku, GETDATE());
            `);
        }
      }
    }

    // 8. Đồng bộ Coupons
    console.log(`[Sync] Đang chèn ${data.coupons.length} Coupons...`);
    for (const coup of data.coupons) {
      await transaction.request()
        .input('id', sql.VarChar(36), coup.id)
        .input('code', sql.VarChar(50), coup.code)
        .input('desc', sql.NVarChar(255), coup.description || '')
        .input('discountType', sql.VarChar(20), coup.discountType)
        .input('discountValue', sql.Decimal(10, 2), coup.discountValue)
        .input('minOrder', sql.Decimal(12, 2), coup.minOrderValue || 0)
        .input('maxDiscount', sql.Decimal(12, 2), coup.maxDiscount || null)
        .input('usageLimit', sql.Int, coup.usageLimit || 100)
        .input('usedCount', sql.Int, coup.usedCount || 0)
        .input('startDate', sql.Date, new Date(coup.startDate))
        .input('endDate', sql.Date, new Date(coup.endDate))
        .input('status', sql.VarChar(20), coup.status || 'ACTIVE')
        .query(`
          IF EXISTS (SELECT 1 FROM [coupons] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [coupons] SET [code] = @code, [description] = @desc, [discount_type] = @discountType, [discount_value] = @discountValue, [min_order_value] = @minOrder, [max_discount] = @maxDiscount, [usage_limit] = @usageLimit, [used_count] = @usedCount, [start_date] = @startDate, [end_date] = @endDate, [status] = @status WHERE id = @id;
          ELSE INSERT INTO coupons (
            id, code, description, discount_type, discount_value, min_order_value,
            max_discount, usage_limit, used_count, start_date, end_date, status, created_at
          ) VALUES (
            @id, @code, @desc, @discountType, @discountValue, @minOrder,
            @maxDiscount, @usageLimit, @usedCount, @startDate, @endDate, @status, GETDATE()
          );
        `);
    }

    // 9. Đồng bộ Banners
    console.log(`[Sync] Đang chèn ${data.banners.length} Banners...`);
    for (const b of data.banners) {
      await transaction.request()
        .input('id', sql.VarChar(36), b.id)
        .input('title', sql.NVarChar(200), b.title)
        .input('subtitle', sql.NVarChar(sql.MAX), b.subtitle || '')
        .input('badge', sql.NVarChar(50), b.badge || null)
        .input('link', sql.NVarChar(255), b.link)
        .input('image', sql.NVarChar(500), b.image)
        .input('btnText', sql.NVarChar(50), b.buttonText || 'Xem ngay')
        .input('pos', sql.VarChar(20), b.position || 'HERO')
        .input('order', sql.Int, b.order || 1)
        .input('active', sql.Bit, b.active ? 1 : 0)
        .query(`
          IF EXISTS (SELECT 1 FROM [banners] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [banners] SET [title] = @title, [subtitle] = @subtitle, [badge] = @badge, [link] = @link, [image] = @image, [button_text] = @btnText, [position] = @pos, [display_order] = @order, [active] = @active WHERE id = @id;
          ELSE INSERT INTO banners (id, title, subtitle, badge, link, image, button_text, position, display_order, active, created_at)
          VALUES (@id, @title, @subtitle, @badge, @link, @image, @btnText, @pos, @order, @active, GETDATE());
        `);
    }

    // 10. Đồng bộ Reviews
    console.log(`[Sync] Đang chèn ${data.reviews.length} Reviews...`);
    const knownProductIds = new Set([...data.products.map(p => p.id), ...existingProducts.recordset.map(p => p.id)]);
    for (const r of data.reviews) {
      if (!knownProductIds.has(r.productId)) {
        console.warn(`[Sync] Giữ đánh giá ${r.id} trong JSON: sản phẩm ${r.productId} không còn tồn tại.`);
        continue;
      }
      await transaction.request()
        .input('id', sql.VarChar(36), r.id)
        .input('productId', sql.VarChar(36), r.productId)
        .input('userId', sql.VarChar(36), r.userId)
        .input('userName', sql.NVarChar(100), r.userName || '')
        .input('userAvatar', sql.NVarChar(500), r.userAvatar || '')
        .input('rating', sql.Int, r.rating)
        .input('comment', sql.NVarChar(sql.MAX), r.comment)
        .input('images', sql.NVarChar(sql.MAX), JSON.stringify(r.images || []))
        .input('status', sql.VarChar(20), r.status || 'APPROVED')
        .input('createdAt', sql.DateTime2, new Date(r.createdAt || Date.now()))
        .query(`
          IF EXISTS (SELECT 1 FROM [reviews] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [reviews] SET [product_id] = @productId, [user_id] = @userId, [user_name] = @userName, [user_avatar] = @userAvatar, [rating] = @rating, [comment] = @comment, [images] = @images, [status] = @status WHERE id = @id;
          ELSE INSERT INTO reviews (id, product_id, user_id, user_name, user_avatar, rating, comment, images, status, created_at)
          VALUES (@id, @productId, @userId, @userName, @userAvatar, @rating, @comment, @images, @status, @createdAt);
        `);
    }

    // 11. Đồng bộ Orders & Order Items
    console.log(`[Sync] Đang chèn ${data.orders.length} Orders và chi tiết đơn...`);
    for (const ord of data.orders) {
      await transaction.request()
        .input('id', sql.VarChar(36), ord.id)
        .input('orderCode', sql.VarChar(20), ord.orderCode)
        .input('userId', sql.VarChar(36), ord.userId || null)
        .input('name', sql.NVarChar(100), ord.customerName)
        .input('email', sql.NVarChar(150), ord.customerEmail)
        .input('phone', sql.VarChar(20), ord.customerPhone)
        .input('address', sql.NVarChar(sql.MAX), ord.shippingAddress)
        .input('province', sql.NVarChar(100), ord.province || 'Hồ Chí Minh')
        .input('district', sql.NVarChar(100), ord.district || '')
        .input('ward', sql.NVarChar(100), ord.ward || '')
        .input('note', sql.NVarChar(sql.MAX), ord.note || null)
        .input('subtotal', sql.Decimal(12, 2), ord.subtotal)
        .input('shippingFee', sql.Decimal(12, 2), ord.shippingFee ?? 30000)
        .input('discount', sql.Decimal(12, 2), ord.discountAmount || 0)
        .input('total', sql.Decimal(12, 2), ord.totalAmount)
        .input('coupon', sql.VarChar(50), ord.couponCode || null)
        .input('payMethod', sql.VarChar(20), ord.paymentMethod || 'COD')
        .input('payStatus', sql.VarChar(20), ord.paymentStatus || 'PENDING')
        .input('orderStatus', sql.VarChar(20), ord.orderStatus || 'PENDING')
        .input('createdAt', sql.DateTime2, new Date(ord.createdAt || Date.now()))
        .input('updatedAt', sql.DateTime2, new Date(ord.updatedAt || Date.now()))
        .query(`
          IF EXISTS (SELECT 1 FROM [orders] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [orders] SET [order_code] = @orderCode, [user_id] = @userId, [customer_name] = @name, [customer_email] = @email, [customer_phone] = @phone, [shipping_address] = @address, [province] = @province, [district] = @district, [ward] = @ward, [note] = @note, [subtotal] = @subtotal, [shipping_fee] = @shippingFee, [discount_amount] = @discount, [total_amount] = @total, [coupon_code] = @coupon, [payment_method] = @payMethod, [payment_status] = @payStatus, [order_status] = @orderStatus, [updated_at] = @updatedAt WHERE id = @id;
          ELSE INSERT INTO orders (
            id, order_code, user_id, customer_name, customer_email, customer_phone,
            shipping_address, province, district, ward, note, subtotal, shipping_fee,
            discount_amount, total_amount, coupon_code, payment_method, payment_status,
            order_status, created_at, updated_at
          ) VALUES (
            @id, @orderCode, @userId, @name, @email, @phone,
            @address, @province, @district, @ward, @note, @subtotal, @shippingFee,
            @discount, @total, @coupon, @payMethod, @payStatus,
            @orderStatus, @createdAt, @updatedAt
          );
        `);

      await transaction.request()
        .input('id', sql.VarChar(36), ord.id)
        .input('cancelReason', sql.NVarChar(sql.MAX), ord.cancelReason || null)
        .input('returnRequest', sql.NVarChar(sql.MAX), ord.returnRequest ? JSON.stringify(ord.returnRequest) : null)
        .query('UPDATE orders SET cancel_reason = @cancelReason, return_request = @returnRequest WHERE id = @id');

      if (Array.isArray(ord.items)) {
        for (const item of ord.items) {
          await transaction.request()
            .input('id', sql.VarChar(36), item.id)
            .input('orderId', sql.VarChar(36), ord.id)
            .input('productId', sql.VarChar(36), item.productId)
            .input('varId', sql.VarChar(36), item.variantId || null)
            .input('prodName', sql.NVarChar(200), item.productName)
            .input('size', sql.NVarChar(100), item.size || 'M')
            .input('color', sql.NVarChar(50), item.color || 'Trắng')
            .input('price', sql.Decimal(12, 2), item.price)
            .input('qty', sql.Int, item.quantity)
            .input('total', sql.Decimal(12, 2), item.total)
            .input('img', sql.NVarChar(500), item.imageUrl || null)
            .query(`
              IF EXISTS (SELECT 1 FROM [order_items] WITH (UPDLOCK, HOLDLOCK) WHERE id = @id)
            UPDATE [order_items] SET [order_id] = @orderId, [product_id] = @productId, [variant_id] = @varId, [product_name] = @prodName, [size] = @size, [color] = @color, [price] = @price, [quantity] = @qty, [total] = @total, [image_url] = @img WHERE id = @id;
          ELSE INSERT INTO order_items (
                id, order_id, product_id, variant_id, product_name, size, color, price, quantity, total, image_url
              ) VALUES (
                @id, @orderId, @productId, @varId, @prodName, @size, @color, @price, @qty, @total, @img
              );
            `);
        }
      }
    }

    await transaction.commit();
    console.log('[Sync] Hoàn tất đồng bộ dữ liệu vào Microsoft SQL Server thành công 100%!');
  } catch (err: any) {
    try { await transaction.rollback(); } catch { /* Keep the original SQL error if already rolled back. */ }
    console.error('[Sync] Lỗi trong quá trình đồng bộ, đã rollback:', err.message);
    throw err;
  }
}

// Nếu gọi trực tiếp từ CLI
if (typeof process !== 'undefined' && process.argv[1] && process.argv[1].includes('syncToSqlServer')) {
  syncDatabaseToSqlServer()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
