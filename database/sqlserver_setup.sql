-- =========================================================
-- DATABASE SETUP & SEED SCRIPT: NGUYEN FASHION STORE
-- Hệ quản trị CSDL: Microsoft SQL Server (T-SQL)
-- Sinh viên: Phan Nhất Nguyên - ST23B
-- Database: nguyen_fashion
-- Server: Thohihi\SQLEXPRESS (localhost\SQLEXPRESS)
-- =========================================================

USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'nguyen_fashion')
BEGIN
    CREATE DATABASE nguyen_fashion COLLATE Vietnamese_CI_AS;
END
GO

USE nguyen_fashion;
GO

-- 1. BẢNG USERS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    address NVARCHAR(MAX) NULL,
    avatar NVARCHAR(500) NULL,
    role VARCHAR(20) DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 2. BẢNG ADMINS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'admins')
CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    department NVARCHAR(50) DEFAULT N'BAN GIÁM ĐỐC',
    permissions NVARCHAR(MAX) NULL,
    last_login DATETIME2 NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
GO

-- 3. BẢNG CATEGORIES
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    image NVARCHAR(500) NULL,
    item_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 4. BẢNG SIZES & COLORS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sizes')
CREATE TABLE sizes (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name NVARCHAR(50) NOT NULL
);
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'colors')
CREATE TABLE colors (
    id VARCHAR(36) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL,
    hex_code VARCHAR(10) NOT NULL
);
GO

-- 5. BẢNG PRODUCTS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    category_id VARCHAR(36) NOT NULL,
    brand NVARCHAR(100) DEFAULT N'Nguyen',
    price DECIMAL(12, 2) NOT NULL,
    sale_price DECIMAL(12, 2) NULL,
    description NVARCHAR(MAX) NULL,
    details NVARCHAR(MAX) NULL,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    is_featured BIT DEFAULT 0,
    is_new_arrival BIT DEFAULT 1,
    is_flash_sale BIT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
GO

-- 6. BẢNG PRODUCT_IMAGES
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_images')
CREATE TABLE product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    image_url NVARCHAR(500) NOT NULL,
    is_primary BIT DEFAULT 0,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
GO

-- 7. BẢNG PRODUCT_VARIANTS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_variants')
CREATE TABLE product_variants (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    size NVARCHAR(20) NOT NULL,
    color NVARCHAR(50) NOT NULL,
    color_code VARCHAR(10) DEFAULT '#000000',
    stock INT NOT NULL DEFAULT 0,
    price DECIMAL(12, 2) NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
GO

-- 8. BẢNG COUPONS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'coupons')
CREATE TABLE coupons (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255) NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENT', 'FIXED')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(12, 2) DEFAULT 0,
    max_discount DECIMAL(12, 2) NULL,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 9. BẢNG BANNERS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'banners')
CREATE TABLE banners (
    id VARCHAR(36) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    subtitle NVARCHAR(MAX) NULL,
    badge NVARCHAR(50) NULL,
    link NVARCHAR(255) NOT NULL,
    image NVARCHAR(500) NOT NULL,
    button_text NVARCHAR(50) DEFAULT N'Xem ngay',
    position VARCHAR(20) DEFAULT 'HERO',
    display_order INT DEFAULT 0,
    active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 10. BẢNG ORDERS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_code VARCHAR(20) NOT NULL UNIQUE,
    user_id VARCHAR(36) NULL,
    customer_name NVARCHAR(100) NOT NULL,
    customer_email NVARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address NVARCHAR(MAX) NOT NULL,
    province NVARCHAR(100) NOT NULL,
    district NVARCHAR(100) NOT NULL,
    ward NVARCHAR(100) NOT NULL,
    note NVARCHAR(MAX) NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(12, 2) DEFAULT 30000,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    coupon_code VARCHAR(50) NULL,
    payment_method VARCHAR(20) DEFAULT 'COD',
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    order_status VARCHAR(20) DEFAULT 'PENDING',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
GO

-- 11. BẢNG ORDER_ITEMS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'order_items')
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    variant_id VARCHAR(36) NULL,
    product_name NVARCHAR(200) NOT NULL,
    size NVARCHAR(20) NOT NULL,
    color NVARCHAR(50) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    image_url NVARCHAR(500) NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
GO

-- 12. BẢNG REVIEWS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reviews')
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    user_name NVARCHAR(100) NULL,
    user_avatar NVARCHAR(500) NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment NVARCHAR(MAX) NOT NULL,
    images NVARCHAR(MAX) NULL,
    status VARCHAR(20) DEFAULT 'APPROVED',
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

-- =========================================================
-- DỌN DẸP DỮ LIỆU CŨ TRƯỚC KHI CHÈN MỚI
-- =========================================================
DELETE FROM reviews;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_variants;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM admins;
DELETE FROM users;
DELETE FROM coupons;
DELETE FROM banners;
DELETE FROM colors;
DELETE FROM sizes;
GO

-- =========================================================
-- CHÈN DỮ LIỆU THAM CHIẾU (SIZES & COLORS)
-- =========================================================
INSERT INTO sizes (id, code, name) VALUES
('sz-s', 'S', N'Size S'),
('sz-m', 'M', N'Size M'),
('sz-l', 'L', N'Size L'),
('sz-xl', 'XL', N'Size XL'),
('sz-xxl', 'XXL', N'Size XXL');

INSERT INTO colors (id, name, hex_code) VALUES
('col-black', N'Đen', '#111827'),
('col-white', N'Trắng', '#F9FAFB'),
('col-beige', N'Be', '#F5F5DC'),
('col-navy', N'Xanh Navy', '#1E3A8A'),
('col-gray', N'Xám', '#6B7280'),
('col-blue', N'Xanh Jeans', '#3B82F6'),
('col-pink', N'Hồng Pastel', '#F472B6');
GO

-- =========================================================
-- CHÈN TÀI KHOẢN USERS & ADMINS
-- =========================================================
INSERT INTO users (id, name, email, password_hash, phone, avatar, role, status, created_at) VALUES ('usr-admin-1', N'Phan Nhất Nguyên-ST23B', N'phannguyen27082005@gmail.com', '$2b$10$bnpQDNpo5erDmlTg8GEWCOMoWgv2XLy9NBcDvN/jS7PZZFaiDY3RO', '0909123456', N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'ADMIN', 'ACTIVE', GETDATE());
INSERT INTO admins (id, user_id, department, permissions, created_at) VALUES ('admin-usr-admin-1', 'usr-admin-1', N'BAN GIÁM ĐỐC / IT DEVOPS', N'["ALL_PRIVILEGES"]', GETDATE());
INSERT INTO users (id, name, email, password_hash, phone, avatar, role, status, created_at) VALUES ('usr-cust-1', N'Nguyễn Thúy Vy', N'khachhang@example.com', '$2b$10$bnpQDNpo5erDmlTg8GEWCOZ9R6h.HZBJbkc4bw6OV0ljvDrEVhl2m', '0918765432', N'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE', GETDATE());
INSERT INTO users (id, name, email, password_hash, phone, avatar, role, status, created_at) VALUES ('usr-cust-2', N'Lê Minh Tuấn', N'minhtuan@gmail.com', '$2b$10$bnpQDNpo5erDmlTg8GEWCOZ9R6h.HZBJbkc4bw6OV0ljvDrEVhl2m', '0987654321', N'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE', GETDATE());
INSERT INTO users (id, name, email, password_hash, phone, avatar, role, status, created_at) VALUES ('usr-cust-3', N'Phạm Phương Linh', N'phuonglinh@gmail.com', '$2b$10$bnpQDNpo5erDmlTg8GEWCOZ9R6h.HZBJbkc4bw6OV0ljvDrEVhl2m', '0933221100', N'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'CUSTOMER', 'ACTIVE', GETDATE());
INSERT INTO users (id, name, email, password_hash, phone, avatar, role, status, created_at) VALUES ('user-2', N'Trần Hoàng Nam', N'nam.tran@example.com', '$2b$10$bnpQDNpo5erDmlTg8GEWCOZ9R6h.HZBJbkc4bw6OV0ljvDrEVhl2m', NULL, NULL, 'CUSTOMER', 'ACTIVE', GETDATE());
INSERT INTO users (id, name, email, password_hash, phone, avatar, role, status, created_at) VALUES ('user-3', N'Vũ Mai Hương', N'huong.vu@example.com', '$2b$10$bnpQDNpo5erDmlTg8GEWCOZ9R6h.HZBJbkc4bw6OV0ljvDrEVhl2m', NULL, NULL, 'CUSTOMER', 'ACTIVE', GETDATE());
INSERT INTO users (id, name, email, password_hash, phone, avatar, role, status, created_at) VALUES ('user-4', N'Đặng Quốc Bảo', N'bao.dang@example.com', '$2b$10$bnpQDNpo5erDmlTg8GEWCOZ9R6h.HZBJbkc4bw6OV0ljvDrEVhl2m', NULL, NULL, 'CUSTOMER', 'ACTIVE', GETDATE());
GO

-- =========================================================
-- CHÈN CATEGORIES
-- =========================================================
INSERT INTO categories (id, name, slug, description, image, item_count, created_at) VALUES ('cat-1', N'Áo Nam & Nữ', 'ao', N'Bộ sưu tập áo thun, sơ mi, polo cao cấp chất liệu cotton thoáng mát', N'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 0, GETDATE());
INSERT INTO categories (id, name, slug, description, image, item_count, created_at) VALUES ('cat-2', N'Quần Thời Trang', 'quan', N'Quần jeans, quần âu, kaki form chuẩn tôn dáng thời thượng', N'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', 0, GETDATE());
INSERT INTO categories (id, name, slug, description, image, item_count, created_at) VALUES ('cat-3', N'Váy & Đầm Nữ', 'vay', N'Thiết kế váy midi, đầm suông thanh lịch cho nàng công sở và dạo phố', N'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80', 0, GETDATE());
INSERT INTO categories (id, name, slug, description, image, item_count, created_at) VALUES ('cat-4', N'Áo Khoác & Blazer', 'ao-khoac', N'Blazer may đo tinh tế, áo khoác bomber ấm áp và phong cách', N'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80', 0, GETDATE());
INSERT INTO categories (id, name, slug, description, image, item_count, created_at) VALUES ('cat-5', N'Hoodie & Sweater', 'hoodie', N'Áo nỉ phong cách streetwear trẻ trung năng động giữ ấm mùa thu đông', N'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', 0, GETDATE());
INSERT INTO categories (id, name, slug, description, image, item_count, created_at) VALUES ('cat-6', N'Phụ Kiện Cao Cấp', 'phu-kien', N'Túi xách da, thắt lưng, nón và phụ kiện thời trang tạo điểm nhấn phong cách', N'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', 0, GETDATE());
GO

-- =========================================================
-- CHÈN PRODUCTS, IMAGES, VARIANTS
-- =========================================================
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-1', N'Áo Thun Basic Heavyweight Cotton', 'ao-thun-basic-heavyweight-cotton', 'cat-1', N'Maison Studio', 320000, 249000, N'Áo thun form relaxed-fit từ chất liệu 100% cotton định lượng 260gsm dày dặn, thấm hút mồ hôi tốt, giữ form dáng hoàn hảo sau nhiều lần giặt.', N'["100% Cotton chải kỹ cao cấp","Định lượng 260gsm dày dặn","Cổ bo dệt chắc chắn, không bai nhão","Công nghệ nhuộm reactive bền màu"]', 4.9, 48, 320, 1, 0, 1, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-1-img-1', 'prod-1', N'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-1-img-2', 'prod-1', N'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-1-img-3', 'prod-1', N'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80', 0, 3);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v1-1', 'prod-1', N'S', N'Trắng', '#ffffff', 25, 249000, 'TSHIRT-WHT-S', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v1-2', 'prod-1', N'M', N'Trắng', '#ffffff', 34, 249000, 'TSHIRT-WHT-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v1-3', 'prod-1', N'L', N'Trắng', '#ffffff', 18, 249000, 'TSHIRT-WHT-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v1-4', 'prod-1', N'M', N'Đen', '#111827', 28, 249000, 'TSHIRT-BLK-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v1-5', 'prod-1', N'L', N'Đen', '#111827', 12, 249000, 'TSHIRT-BLK-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v1-6', 'prod-1', N'XL', N'Xám Khói', '#6b7280', 7, 249000, 'TSHIRT-GRY-XL', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-2', N'Áo Sơ Mi Oxford Slimfit Dài Tay', 'ao-so-mi-oxford-slimfit-dai-tay', 'cat-1', N'Maison Bespoke', 490000, 389000, N'Áo sơ mi vải Oxford dệt thoi dầy dặn, thoáng khí, cổ áo đứng form chuẩn phong cách lịch lãm, phù hợp môi trường công sở lẫn các sự kiện thường nhật.', N'["Vải Oxford Cotton 100%","Nút cài ngọc trai cao cấp","Đường may chỉ đôi tinh tế","Chống nhăn tự nhiên khi ủi nhẹ"]', 4.8, 36, 195, 1, 1, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-2-img-1', 'prod-2', N'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-2-img-2', 'prod-2', N'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v2-1', 'prod-2', N'M', N'Xanh Nhạt', '#93c5fd', 15, 389000, 'OXFORD-BLU-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v2-2', 'prod-2', N'L', N'Xanh Nhạt', '#93c5fd', 8, 389000, 'OXFORD-BLU-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v2-3', 'prod-2', N'M', N'Trắng Sữa', '#f8fafc', 22, 389000, 'OXFORD-WHT-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v2-4', 'prod-2', N'L', N'Trắng Sữa', '#f8fafc', 16, 389000, 'OXFORD-WHT-L', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-3', N'Quần Tây Âu May Đo Classic Tapered', 'quan-tay-au-may-do-classic-tapered', 'cat-2', N'Maison Tailored', 580000, 479000, N'Quần âu xếp ly nhẹ, dáng tapered ôm dần xuống cổ chân tạo nét hiện đại. Vải wool pha co giãn nhẹ, giữ ly phẳng phiu suốt cả ngày dài.', N'["Poly Rayon pha Spandex 5%","Cạp quần tăng đơ co giãn ẩn 3cm","Túi chéo sâu tiện lợi","Khóa kéo YKK kim loại"]', 4.7, 29, 140, 1, 0, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-3-img-1', 'prod-3', N'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-3-img-2', 'prod-3', N'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v3-1', 'prod-3', N'29', N'Đen Tuyển', '#0f172a', 14, 479000, 'PANTS-BLK-29', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v3-2', 'prod-3', N'30', N'Đen Tuyển', '#0f172a', 19, 479000, 'PANTS-BLK-30', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v3-3', 'prod-3', N'31', N'Xám Đậm', '#334155', 9, 479000, 'PANTS-GRY-31', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v3-4', 'prod-3', N'32', N'Beige', '#d6c7b2', 6, 479000, 'PANTS-BEI-32', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-4', N'Quần Jeans Denim Vintage Straight Leg', 'quan-jeans-denim-vintage-straight-leg', 'cat-2', N'Maison Denim', 650000, 539000, N'Chất liệu vải denim 13.5oz dệt thoi mộc mạc, wash màu thủ công tạo hiệu ứng vintage tự nhiên. Form ống đứng tôn chân và cực kỳ dễ phối đồ.', N'["100% Cotton Denim 13.5oz","Wash màu axit thủ công","Đinh tán đồng chống rách góc túi","Đường chỉ vàng nổi bật"]', 4.9, 52, 280, 1, 1, 1, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-4-img-1', 'prod-4', N'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-4-img-2', 'prod-4', N'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v4-1', 'prod-4', N'29', N'Xanh Chàm', '#1e3a8a', 11, 539000, 'JEANS-IND-29', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v4-2', 'prod-4', N'30', N'Xanh Chàm', '#1e3a8a', 24, 539000, 'JEANS-IND-30', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v4-3', 'prod-4', N'31', N'Xanh Nhạt Wash', '#60a5fa', 17, 539000, 'JEANS-LGT-31', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v4-4', 'prod-4', N'32', N'Xanh Nhạt Wash', '#60a5fa', 8, 539000, 'JEANS-LGT-32', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-5', N'Đầm Midi Linen Thắt Eo Thanh Lịch', 'dam-midi-linen-that-eo-thanh-lich', 'cat-3', N'Maison Femme', 720000, 590000, N'Thiết kế đầm dáng xòe nhẹ nhàng từ sợi lanh tự nhiên cao cấp, thoáng khí và thân thiện với làn da. Đai thắt eo tôn dáng hoàn hảo cho phái đẹp.', N'["100% Linen dệt tự nhiên","Đai thắt eo rời tùy chỉnh","Túi sườn giấu kín tiện lợi","Khóa giọt lệ sau lưng mượt mà"]', 4.9, 41, 160, 1, 1, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-5-img-1', 'prod-5', N'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-5-img-2', 'prod-5', N'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v5-1', 'prod-5', N'S', N'Trắng Ngà', '#fef3c7', 18, 590000, 'DRESS-IVY-S', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v5-2', 'prod-5', N'M', N'Trắng Ngà', '#fef3c7', 12, 590000, 'DRESS-IVY-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v5-3', 'prod-5', N'S', N'Xanh Olive', '#65a30d', 9, 590000, 'DRESS-OLV-S', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v5-4', 'prod-5', N'M', N'Xanh Olive', '#65a30d', 5, 590000, 'DRESS-OLV-M', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-6', N'Chân Váy Chữ A Xếp Ly Tinh Tế', 'chan-vay-chu-a-xep-ly-tinh-te', 'cat-3', N'Maison Femme', 450000, 359000, N'Chân váy chữ A midi xếp ly chuẩn mực, dễ phối cùng áo sơ mi hoặc áo thun cho phong cách thanh lịch hàng ngày.', N'["Chất liệu Tuyết Mưa cao cấp","Không nhăn, giữ nếp ly vĩnh viễn","Lớp lót quần bảo hộ bên trong"]', 4.7, 22, 110, 0, 0, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-6-img-1', 'prod-6', N'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-6-img-2', 'prod-6', N'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v6-1', 'prod-6', N'S', N'Đen', '#000000', 20, 359000, 'SKIRT-BLK-S', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v6-2', 'prod-6', N'M', N'Đen', '#000000', 15, 359000, 'SKIRT-BLK-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v6-3', 'prod-6', N'S', N'Beige Kem', '#f5ebe0', 14, 359000, 'SKIRT-BEI-S', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v6-4', 'prod-6', N'M', N'Beige Kem', '#f5ebe0', 8, 359000, 'SKIRT-BEI-M', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-7', N'Áo Blazer Relaxed-Fit Unisex', 'ao-blazer-relaxed-fit-unisex', 'cat-4', N'Maison Studio', 990000, 849000, N'Áo khoác blazer phom rộng phóng khoáng, ve áo cổ điển, lót lụa mềm mượt bên trong mang đến cảm giác thoải mái và diện mạo chuẩn thời trang cao cấp.', N'["Wool Blend cao cấp nhẹ","Lót lụa habutai êm ái","Đệm vai mỏng tạo phom chuẩn","2 túi có nắp ngoài và 1 túi ngực"]', 5, 38, 145, 1, 1, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-7-img-1', 'prod-7', N'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-7-img-2', 'prod-7', N'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v7-1', 'prod-7', N'M', N'Nâu Cà Phê', '#78350f', 8, 849000, 'BLAZER-BRN-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v7-2', 'prod-7', N'L', N'Nâu Cà Phê', '#78350f', 5, 849000, 'BLAZER-BRN-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v7-3', 'prod-7', N'M', N'Đen Than', '#18181b', 12, 849000, 'BLAZER-BLK-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v7-4', 'prod-7', N'L', N'Đen Than', '#18181b', 10, 849000, 'BLAZER-BLK-L', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-8', N'Áo Khoác Bomber Minimalist Lót Gió', 'ao-khoac-bomber-minimalist-lot-gio', 'cat-4', N'Maison Sport', 790000, 650000, N'Bomber jacket chất liệu trượt nước nhẹ, bo chun cổ và tay áo co giãn êm ái, thích hợp cho thời tiết se lạnh và những chuyến vi vu dạo phố.', N'["Nylon trượt nước DWR","Khóa kéo kim loại 2 chiều trơn tru","Lớp lót chống tĩnh điện","Bo cổ dệt kim dày dặn"]', 4.8, 19, 92, 0, 1, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-8-img-1', 'prod-8', N'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-8-img-2', 'prod-8', N'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v8-1', 'prod-8', N'M', N'Xanh Rêu Đậm', '#365314', 16, 650000, 'BOMBER-GRN-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v8-2', 'prod-8', N'L', N'Xanh Rêu Đậm', '#365314', 11, 650000, 'BOMBER-GRN-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v8-3', 'prod-8', N'XL', N'Đen Mờ', '#27272a', 7, 650000, 'BOMBER-BLK-XL', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-9', N'Áo Hoodie Oversize Nỉ Bông Cotton', 'ao-hoodie-oversize-ni-bong-cotton', 'cat-5', N'Maison Street', 550000, 429000, N'Áo hoodie phom rộng đường phố chất vải nỉ chân cua 380gsm siêu dày dặn, lớp lót mịn màng giữ ấm cơ thể trong những ngày mùa đông.', N'["Vải nỉ chân cua 380gsm dầy","Mũ trùm đầu 2 lớp đứng form","Túi kangaroo rộng rãi","Dây rút cotton dẹt cùng màu"]', 4.9, 65, 410, 1, 0, 1, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-9-img-1', 'prod-9', N'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-9-img-2', 'prod-9', N'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v9-1', 'prod-9', N'M', N'Xám Tiêu', '#9ca3af', 20, 429000, 'HOODIE-GRY-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v9-2', 'prod-9', N'L', N'Xám Tiêu', '#9ca3af', 14, 429000, 'HOODIE-GRY-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v9-3', 'prod-9', N'M', N'Beige Ấm', '#f5ebe0', 18, 429000, 'HOODIE-BEI-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v9-4', 'prod-9', N'L', N'Beige Ấm', '#f5ebe0', 9, 429000, 'HOODIE-BEI-L', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-10', N'Áo Sweater Cổ Tròn Dệt Kim Tối Giản', 'ao-sweater-co-tron-det-kim-toi-gian', 'cat-5', N'Maison Studio', 480000, 390000, N'Sweater dệt kim sợi len pha cotton mềm mượt, không ngứa, phom dáng thanh mảnh thích hợp mặc đơn hoặc mặc layer bên trong áo sơ mi/blazer.', N'["Sợi dệt 50% Cotton, 50% Acrylic mềm mại","Cổ tròn co giãn linh hoạt","Đường dệt rib ở gấu và tay áo"]', 4.8, 28, 175, 0, 1, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-10-img-1', 'prod-10', N'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-10-img-2', 'prod-10', N'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v10-1', 'prod-10', N'M', N'Xanh Navy', '#172554', 15, 390000, 'SWEATER-NVY-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v10-2', 'prod-10', N'L', N'Xanh Navy', '#172554', 10, 390000, 'SWEATER-NVY-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v10-3', 'prod-10', N'M', N'Trắng Sữa', '#fafaf9', 22, 390000, 'SWEATER-CRM-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v10-4', 'prod-10', N'L', N'Trắng Sữa', '#fafaf9', 6, 390000, 'SWEATER-CRM-L', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-11', N'Túi Xách Da Minimalist Tote Bag', 'tui-xach-da-minimalist-tote-bag', 'cat-6', N'Maison Leather', 850000, 699000, N'Túi tote da PU vi sợi hạt mịn chống trầy cao cấp, ngăn chứa rộng đựng vừa laptop 14 inch cùng sổ tay, tài liệu cho ngày làm việc năng động.', N'["Da tổng hợp sợi siêu mịn Microfiber","Ngăn chống sốc đựng laptop 14\"","Khóa nam châm hít chắc chắn","Quai đeo chịu lực 8kg"]', 4.9, 33, 150, 1, 0, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-11-img-1', 'prod-11', N'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-11-img-2', 'prod-11', N'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v11-1', 'prod-11', N'FreeSize', N'Nâu Da Bò', '#78350f', 15, 699000, 'TOTE-BRN', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v11-2', 'prod-11', N'FreeSize', N'Đen Huyền', '#000000', 20, 699000, 'TOTE-BLK', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-12', N'Thắt Lưng Da Bò Khóa Kim Loại Phay Xước', 'that-lung-da-bo-khoa-kim-loai-phay-xuoc', 'cat-6', N'Maison Leather', 350000, 280000, N'Dây nịt da bò thật 100% nguyên tấm bền bỉ, mặt khóa hợp kim mạ titan phay xước chống gỉ tạo phong cách nam tính sang trọng.', N'["100% Da bò thật nguyên tấm","Bản rộng 3.4cm tiêu chuẩn","Khóa kim loại chống hoen gỉ"]', 4.8, 17, 95, 0, 0, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-12-img-1', 'prod-12', N'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-12-img-2', 'prod-12', N'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v12-1', 'prod-12', N'110cm', N'Đen Mờ', '#18181b', 30, 280000, 'BELT-BLK-110', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v12-2', 'prod-12', N'115cm', N'Nâu Đậm', '#451a03', 18, 280000, 'BELT-BRN-115', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-13', N'Áo Polo Pique Cotton Dệt Tổ Ong', 'ao-polo-pique-cotton-det-to-ong', 'cat-1', N'Maison Studio', 390000, 320000, N'Polo pique mắt chim dệt tổ ong thấm hút mồ hôi tối đa, cổ dệt jacquard bền đẹp giúp giữ vẻ lịch sự trong cả công việc lẫn các buổi gặp gỡ bạn bè.', N'["Vải pique cá sấu dệt tổ ong","Thành phần 95% cotton 5% spandex","Cúc áo khắc laser thương hiệu"]', 4.7, 25, 140, 0, 1, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-13-img-1', 'prod-13', N'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-13-img-2', 'prod-13', N'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v13-1', 'prod-13', N'M', N'Trắng', '#ffffff', 18, 320000, 'POLO-WHT-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v13-2', 'prod-13', N'L', N'Trắng', '#ffffff', 12, 320000, 'POLO-WHT-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v13-3', 'prod-13', N'M', N'Xanh Rêu', '#365314', 14, 320000, 'POLO-GRN-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v13-4', 'prod-13', N'L', N'Xanh Rêu', '#365314', 8, 320000, 'POLO-GRN-L', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-14', N'Quần Khaki Chino Dáng Suông Hiện Đại', 'quan-khaki-chino-dang-suong-hien-dai', 'cat-2', N'Maison Casual', 490000, 410000, N'Chino chất vải kaki cotton chéo dầy, co giãn nhẹ. Thiết kế phom suông vừa vặn, dễ dàng phối cùng sneaker và áo thun hoặc áo sơ mi.', N'["Kaki dệt chéo 100% cotton","Wash mềm chống nhăn và chống co rút","Túi mổ sau có khuy gài thanh lịch"]', 4.8, 31, 180, 0, 0, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-14-img-1', 'prod-14', N'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-14-img-2', 'prod-14', N'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v14-1', 'prod-14', N'30', N'Beige Cát', '#e7d8c9', 15, 410000, 'CHINO-BEI-30', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v14-2', 'prod-14', N'31', N'Beige Cát', '#e7d8c9', 11, 410000, 'CHINO-BEI-31', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v14-3', 'prod-14', N'32', N'Xanh Đen', '#0f172a', 16, 410000, 'CHINO-NVY-32', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-15', N'Áo Khoác Trench Coat Dáng Dài Thu Đông', 'ao-khoac-trench-coat-dang-dai-thu-dong', 'cat-4', N'Maison Bespoke', 1450000, 1190000, N'Chiếc áo khoác trench coat kinh điển với đai thắt eo và ve cổ lớn sang trọng. Vải gabardine cản gió và chống thấm nước mưa nhẹ xuất sắc.', N'["Vải cotton gabardine tráng cản gió","Khuy cài sừng tự nhiên","Đai lưng và đai cổ tay điều chỉnh linh hoạt"]', 4.9, 16, 55, 1, 1, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-15-img-1', 'prod-15', N'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-15-img-2', 'prod-15', N'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v15-1', 'prod-15', N'M', N'Beige Cổ Điển', '#d4b996', 6, 1190000, 'TRENCH-BEI-M', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v15-2', 'prod-15', N'L', N'Beige Cổ Điển', '#d4b996', 4, 1190000, 'TRENCH-BEI-L', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v15-3', 'prod-15', N'M', N'Đen Quý Phái', '#111827', 5, 1190000, 'TRENCH-BLK-M', GETDATE());
INSERT INTO products (id, name, slug, category_id, brand, price, sale_price, description, details, rating, review_count, sold_count, is_featured, is_new_arrival, is_flash_sale, status, created_at) VALUES ('prod-16', N'Mũ Beanie Len Dệt Kim Ấm Áp', 'mu-beanie-len-det-kim-am-ap', 'cat-6', N'Maison Street', 190000, 149000, N'Nón len dệt kim gân co giãn 4 chiều vừa vặn mọi cỡ đầu, giữ ấm đầu và tạo điểm nhấn cực chất cho outfit mùa lạnh.', N'["Len Merino pha acrylic cao cấp không xù","Logo dệt tag Maison dập nổi"]', 4.8, 24, 188, 0, 0, 0, 'ACTIVE', GETDATE());
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-16-img-1', 'prod-16', N'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80', 1, 1);
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES ('prod-16-img-2', 'prod-16', N'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', 0, 2);
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v16-1', 'prod-16', N'FreeSize', N'Đen', '#000000', 25, 149000, 'BEANIE-BLK', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v16-2', 'prod-16', N'FreeSize', N'Xám Ghi', '#6b7280', 22, 149000, 'BEANIE-GRY', GETDATE());
INSERT INTO product_variants (id, product_id, size, color, color_code, stock, price, sku, created_at) VALUES ('v16-3', 'prod-16', N'FreeSize', N'Vàng Mù Tạt', '#ca8a04', 14, 149000, 'BEANIE-YEL', GETDATE());
GO

-- =========================================================
-- CHÈN COUPONS
-- =========================================================
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, used_count, start_date, end_date, status, created_at) VALUES ('coup-1', 'WELCOME50', N'Giảm 50.000đ cho đơn hàng đầu tiên từ 399.000đ', 'FIXED', 50000, 399000, NULL, 500, 84, '2025-01-01', '2026-12-31', 'ACTIVE', GETDATE());
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, used_count, start_date, end_date, status, created_at) VALUES ('coup-2', 'MAISON10', N'Giảm 10% cho toàn bộ giỏ hàng từ 600.000đ', 'PERCENT', 10, 600000, 150000, 300, 42, '2025-01-01', '2026-12-31', 'ACTIVE', GETDATE());
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, used_count, start_date, end_date, status, created_at) VALUES ('coup-3', 'VIP100', N'Giảm ngay 100.000đ cho đơn hàng từ 1.000.000đ', 'FIXED', 100000, 1000000, NULL, 100, 19, '2025-01-01', '2026-12-31', 'ACTIVE', GETDATE());
GO

-- =========================================================
-- CHÈN BANNERS
-- =========================================================
INSERT INTO banners (id, title, subtitle, badge, link, image, button_text, position, display_order, active, created_at) VALUES ('ban-1', N'BỘ SƯU TẬP THU ĐÔNG 2025', N'Đẳng cấp thời trang tối giản với chất liệu Organic Cotton và Linen cao cấp.', N'NEW ARRIVALS', '/products', N'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80', N'Khám Phá Ngay', 'HERO', 1, 1, GETDATE());
INSERT INTO banners (id, title, subtitle, badge, link, image, button_text, position, display_order, active, created_at) VALUES ('ban-2', N'FLASH SALE CUỐI TUẦN', N'Giảm giá lên đến 40% cho các dòng sản phẩm Áo Khoác & Blazer độc quyền.', N'GIẢM ĐẾN 40%', '/products?sale=true', N'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop&q=80', N'Săn Deal Ngay', 'HERO', 2, 1, GETDATE());
INSERT INTO banners (id, title, subtitle, badge, link, image, button_text, position, display_order, active, created_at) VALUES ('ban-3', N'MINIMALIST ELEGANCE', N'Phong cách tối giản vượt thời gian dành cho người yêu thích sự tinh tế.', N'EDITOR''S PICK', '/category/ao', N'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80', N'Xem Chi Tiết', 'MIDDLE', 3, 1, GETDATE());
GO

-- =========================================================
-- CHÈN REVIEWS
-- =========================================================
INSERT INTO reviews (id, product_id, user_id, user_name, user_avatar, rating, comment, images, status, created_at) VALUES ('rev-1', 'prod-1', 'user-2', N'Minh Hoàng', NULL, 5, N'Chất vải thun rất dày dặn, giặt máy 3 lần rồi vẫn không hề bị giãn cổ. Form áo mặc lên rất đứng dáng!', N'[]', 'APPROVED', GETDATE());
INSERT INTO reviews (id, product_id, user_id, user_name, user_avatar, rating, comment, images, status, created_at) VALUES ('rev-2', 'prod-1', 'user-3', N'Thùy Trang', NULL, 5, N'Giao hàng siêu nhanh, đóng gói hộp cứng rất sang xịn mịn. Màu đen rất tuyền, vải mát không bị nóng.', N'[]', 'APPROVED', GETDATE());
INSERT INTO reviews (id, product_id, user_id, user_name, user_avatar, rating, comment, images, status, created_at) VALUES ('rev-3', 'prod-4', 'user-2', N'Minh Hoàng', NULL, 5, N'Quần lên dáng chuẩn straight leg che khuyết điểm chân tốt, màu wash chàm cực kỳ thời trang.', N'[]', 'APPROVED', GETDATE());
INSERT INTO reviews (id, product_id, user_id, user_name, user_avatar, rating, comment, images, status, created_at) VALUES ('rev-4', 'prod-7', 'user-4', N'Thanh Nhã', NULL, 5, N'Mặc đi làm hay đi tiệc nhẹ đều rất sang. Lớp lót lụa mềm mượt, ve áo sắc nét chuẩn may đo.', N'[]', 'APPROVED', GETDATE());
GO

-- =========================================================
-- CHÈN ORDERS & ORDER_ITEMS
-- =========================================================
INSERT INTO orders (id, order_code, user_id, customer_name, customer_email, customer_phone, shipping_address, province, district, ward, note, subtotal, shipping_fee, discount_amount, total_amount, coupon_code, payment_method, payment_status, order_status, created_at, updated_at) VALUES ('ord-1001', 'ORD-250101', 'usr-cust-1', N'Nguyễn Thúy Vy', N'khachhang@example.com', '0918765432', N'Tòa nhà Landmark 81, 720A Điện Biên Phủ', N'Hồ Chí Minh', N'Quận Bình Thạnh', N'Phường 22', N'Giao trong giờ hành chính giúp mình', 728000, 30000, 50000, 708000, 'WELCOME50', 'COD', 'PAID', 'DELIVERED', GETDATE(), GETDATE());
INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, size, color, price, quantity, total, image_url) VALUES ('item-1', 'ord-1001', 'prod-1', NULL, N'Áo Thun Basic Heavyweight Cotton', N'M', N'Trắng', 249000, 2, 498000, N'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80');
INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, size, color, price, quantity, total, image_url) VALUES ('item-2', 'ord-1001', 'prod-13', NULL, N'Áo Polo Pique Cotton Dệt Tổ Ong', N'M', N'Trắng', 320000, 1, 320000, N'https://images.unsplash.com/photo-1625910513413-568393527a20?w=400&auto=format&fit=crop&q=80');
INSERT INTO orders (id, order_code, user_id, customer_name, customer_email, customer_phone, shipping_address, province, district, ward, note, subtotal, shipping_fee, discount_amount, total_amount, coupon_code, payment_method, payment_status, order_status, created_at, updated_at) VALUES ('ord-1002', 'ORD-250102', 'usr-cust-2', N'Lê Minh Tuấn', N'minhtuan@gmail.com', '0987654321', N'Số 45 Tràng Tiền', N'Hà Nội', N'Quận Hoàn Kiếm', N'Phường Tràng Tiền', N'Gọi trước khi giao', 1388000, 0, 138800, 1249200, 'MAISON10', 'BANK_TRANSFER', 'PAID', 'PROCESSING', GETDATE(), GETDATE());
INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, size, color, price, quantity, total, image_url) VALUES ('item-3', 'ord-1002', 'prod-7', NULL, N'Áo Blazer Relaxed-Fit Unisex', N'L', N'Đen Than', 849000, 1, 849000, N'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop&q=80');
INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, size, color, price, quantity, total, image_url) VALUES ('item-4', 'ord-1002', 'prod-4', NULL, N'Quần Jeans Denim Vintage Straight Leg', N'31', N'Xanh Chàm', 539000, 1, 539000, N'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80');
INSERT INTO orders (id, order_code, user_id, customer_name, customer_email, customer_phone, shipping_address, province, district, ward, note, subtotal, shipping_fee, discount_amount, total_amount, coupon_code, payment_method, payment_status, order_status, created_at, updated_at) VALUES ('ord-1003', 'ORD-250103', 'usr-cust-3', N'Phạm Phương Linh', N'phuonglinh@gmail.com', '0933221100', N'124 Nguyễn Văn Linh', N'Đà Nẵng', N'Quận Hải Châu', N'Phường Nam Dương', N'', 590000, 30000, 0, 620000, NULL, 'COD', 'PENDING', 'PENDING', GETDATE(), GETDATE());
INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, size, color, price, quantity, total, image_url) VALUES ('item-5', 'ord-1003', 'prod-5', NULL, N'Đầm Midi Linen Thắt Eo Thanh Lịch', N'M', N'Trắng Ngà', 590000, 1, 590000, N'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80');
GO

PRINT N'>>> HOÀN TẤT THIẾT LẬP CƠ SỞ DỮ LIỆU NGUYEN_FASHION TRÊN SQL SERVER THÀNH CÔNG 100%! <<<';
