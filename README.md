# 🛍️ NGUYEN FASHION E-COMMERCE PLATFORM

> **Đồ Án Môn Học / Project:** Hệ Thống Website Thương Mại Điện Tử & Quản Trị Bán Hàng Thời Trang Full-stack  
> **Sinh viên thực hiện:** Phan Nhất Nguyên  
> **Lớp:** ST23B  
> **Email:** phannguyen27082005@gmail.com  
> **Trường:** Đại Học Đông Á (Dong A University)  
> **Repository:** [https://github.com/phannguyen27082005-crypto/devops1](https://github.com/phannguyen27082005-crypto/devops1)

---

## 📖 Giới Thiệu Dự Án

**Nguyen Fashion** là nền tảng thương mại điện tử chuyên về thời trang cao cấp với phong cách thiết kế tối giản, hiện đại (Minimalist & Luxury). Hệ thống được xây dựng hoàn chỉnh cả hai phân hệ:
1. **Storefront (Khách hàng):** Trải nghiệm mua sắm mượt mà, xem danh mục, lọc giá/size/màu, tìm kiếm thông minh, giỏ hàng, đặt hàng thanh toán (COD / Chuyển khoản QR ngân hàng tự động).
2. **Admin Portal (Hệ thống Quản Trị):** Dashboard theo dõi doanh thu trực quan, thống kê trạng thái đơn hàng, quản lý danh mục, sản phẩm và biến thể (size, màu sắc, tồn kho), quản lý mã giảm giá coupon, banner khuyến mãi, đánh giá từ khách hàng và cài đặt cửa hàng.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

* **Frontend:**
  * React 19 + TypeScript
  * Vite 6 (Fast build & Dev server)
  * Tailwind CSS v4 (Modern Styling & Responsive Design)
  * Framer Motion / Motion (Hiệu ứng động mượt mà)
  * Lucide React (Bộ icon vector chuẩn)
  * React Router DOM v7 (Định tuyến SPA)
* **Backend:**
  * Node.js & Express.js (RESTful API Server)
  * JSON Local Database Engine + Hỗ trợ Schema MySQL ([`database/schema.sql`](database/schema.sql))
  * JWT (JSON Web Token) & Bcryptjs (Bảo mật & Phân quyền User / Admin)
  * VietQR Integration (Tạo mã thanh toán QR ngân hàng tự động)

---

## 🔑 Tài Khoản Đăng Nhập Mẫu (Testing Accounts)

| Phân hệ | Tài khoản Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | **`phannguyen27082005@gmail.com`** | **`Admin@123456`** | Toàn quyền quản trị Dashboard, Sản phẩm, Đơn hàng, Doanh thu, Cài đặt |
| **Khách hàng (Customer)** | **`khachhang@example.com`** | **`Customer@123456`** | Mua hàng, Giỏ hàng, Đặt đơn COD/QR, Xem lịch sử mua sắm |

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu tiên quyết:
- Đã cài đặt **Node.js** (Khuyến nghị phiên bản 18+ hoặc 20+)
- Đã cài đặt **Git**

### Các bước thực hiện:

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/phannguyen27082005-crypto/devops1.git
   cd Devops1
   ```

2. **Cài đặt các thư viện phụ thuộc:**
   ```bash
   npm install
   ```

3. **Cấu hình file môi trường (`.env`):**
   Tạo file `.env` (hoặc sao chép từ `.env.example`):
   ```bash
   PORT=3000
   APP_URL=http://localhost:3000
   JWT_SECRET=nguyen-fashion-secret-key-2025
   NODE_ENV=development
   ```

4. **Khởi chạy ứng dụng (Development mode):**
   ```bash
   npm run dev
   ```

5. **Truy cập hệ thống trên trình duyệt:**
   * **Trang chủ Cửa hàng:** [http://localhost:3000](http://localhost:3000)
   * **Trang Quản trị Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)
   * **Kiểm tra API Health:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🐳 Đóng Gói & Chạy Bằng Docker (DevOps Standard)

> **Docker Hub Repositories (Đồng bộ song song):**
> - Tài khoản 1: [https://hub.docker.com/r/admin212112/devops1](https://hub.docker.com/r/admin212112/devops1)
> - Tài khoản 2: [https://hub.docker.com/r/nguyen20051/devops1](https://hub.docker.com/r/nguyen20051/devops1)

### 1. Khởi chạy nhanh bằng Docker Compose:
```bash
docker compose up -d
```
Ứng dụng sẽ tự động build và chạy trên cổng `http://localhost:3000`.

### 2. Hoặc Build và Chạy Docker thủ công:
```bash
# Kéo image về máy
docker pull admin212112/devops1:latest
# hoặc: docker pull nguyen20051/devops1:latest

# Chạy container
docker run -d -p 3000:3000 --name nguyen_fashion admin212112/devops1:latest
```

### 3. Tự động hóa CI/CD lên Docker Hub qua GitHub Actions:
Dự án đã tích hợp sẵn workflow CI/CD tại [`.github/workflows/docker.yml`](.github/workflows/docker.yml).
Mỗi khi có commit mới vào `main`, GitHub Actions sẽ tự động build và push image đồng thời lên cả 2 tài khoản Docker Hub:
- **`admin212112/devops1:latest`**
- **`nguyen20051/devops1:latest`**

---

## 🌟 Các Tính Năng Nổi Bật

### 🛒 Dành cho Khách Hàng:
- 🌟 Banner quảng cáo động với hiệu ứng trượt.
- 🔍 Tìm kiếm sản phẩm theo từ khóa thời gian thực.
- 🏷️ Danh mục thời trang phong phú: Áo, Quần, Váy & Đầm, Áo Khoác, Phụ Kiện.
- 🎨 Trang chi tiết sản phẩm chọn biến thể linh hoạt (Màu sắc, Kích cỡ Size, số lượng tồn kho theo biến thể).
- 🛍️ Giỏ hàng lưu trữ LocalStorage thông minh, tự động tính toán tổng tiền.
- 🎟️ Áp dụng mã giảm giá khuyến mãi (VD: `MAISON10`, `TET2025`).
- 💳 Đặt hàng với 2 phương thức: COD (Thanh toán khi nhận hàng) hoặc Chuyển khoản ngân hàng quét mã VietQR tự động theo số tiền và mã đơn.
- 📦 Tra cứu và theo dõi trạng thái đơn hàng thời gian thực.

### 🛡️ Dành cho Quản Trị Viên (Admin):
- 📊 **Dashboard Tổng Quan:** Thống kê doanh thu, số lượng đơn hàng, số sản phẩm, số khách hàng, biểu đồ doanh thu theo thời gian.
- 📦 **Quản lý Sản Phẩm:** Thêm mới, chỉnh sửa, xóa, quản lý nhiều biến thể màu sắc & size, trạng thái hoạt động.
- 🗂️ **Quản lý Danh Mục:** Quản lý cây danh mục sản phẩm thời trang.
- 📑 **Quản lý Đơn Hàng:** Cập nhật trạng thái đơn (Chờ xử lý, Đang giao, Hoàn thành, Đã hủy).
- 🏷️ **Quản lý Mã Giảm Giá:** Tạo mã giảm giá theo %, theo số tiền cố định, giới hạn lượt dùng và ngày hết hạn.
- 🖼️ **Quản lý Banner:** Cập nhật hình ảnh banner slider trang chủ.
- ⭐ **Quản lý Đánh Giá:** Phê duyệt hoặc ẩn các bình luận đánh giá từ người dùng.
- ⚙️ **Cài Đặt Cửa Hàng:** Cập nhật tên cửa hàng, hotline, địa chỉ và thông tin tài khoản ngân hàng nhận tiền.

---

## 📁 Cấu Trúc Thư Mục Dự Án

### Kết nối và cập nhật SQL Server

- `backend/db/sqlClient.ts`: cấu hình kết nối SQL Server từ các biến `DB_*` trong `.env`.
- `backend/db/syncToSqlServer.ts`: thêm/cập nhật dữ liệu từ `data/store.json` vào SQL theo ID; giữ bản ghi SQL đang có. Nhận diện sản phẩm cũ theo slug và giữ sản phẩm ngừng bán để bảo toàn lịch sử đơn.
- `backend/db/database.ts`: website đọc/ghi JSON và tự gọi đồng bộ SQL sau khi lưu. SQL hiện là bản dữ liệu đồng bộ, chưa phải nguồn đọc trực tiếp của các API.
- `database/sqlserver_setup.sql`: cấu trúc bảng SQL Server cho lần cài đặt đầu tiên.
- `server.ts`: endpoint `/api/health` kiểm tra kết nối SQL.

Máy hiện tại dùng `localhost\SQLEXPRESS` (tương đương `Thohihi\SQLEXPRESS`), database `nguyen_fashion`.
Thông tin đăng nhập SQL đặt trong `.env`, không đưa lên GitHub. Xem `.env.example` để cấu hình máy khác.

Chạy cập nhật: `npm run db:sync`. Trong SSMS, kết nối server trên rồi Refresh database `nguyen_fashion` → Tables.

```
├── backend/                   # Mã nguồn Express Backend
│   ├── db/                    # Cơ sở dữ liệu JSON Engine & Seed Data
│   ├── middleware/            # JWT Auth & Phân quyền Admin/User
│   └── routes/                # Các API endpoints (auth, products, orders,...)
├── database/                  # Schema CSDL SQL (schema.sql)
├── data/                      # Lưu trữ dữ liệu JSON store.json
├── src/                       # Mã nguồn React Frontend
│   ├── context/               # AuthContext, CartContext, NotificationContext
│   ├── layouts/               # CustomerLayout & AdminLayout
│   ├── pages/
│   │   ├── admin/             # 11 trang quản trị Admin
│   │   └── customer/          # 12 trang giao diện khách hàng
│   ├── services/              # Kết nối API Axios/Fetch client
│   └── types.ts               # Định nghĩa TypeScript Types
├── server.ts                  # File khởi động Server tích hợp Vite + Express
├── vite.config.ts             # Cấu hình Vite & Tailwind v4
└── package.json               # Cấu hình gói và dependencies
```

---

© 2026 **Phan Nhất Nguyên - ST23B** • [Đại Học Đông Á](https://donga.edu.vn)
