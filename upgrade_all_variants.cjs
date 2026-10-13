const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, 'data', 'store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

// Helper to generate variants for a product
function generateVariants(productId, prefix, colors, sizes, basePrice) {
  const variants = [];
  let index = 1;
  for (const c of colors) {
    for (const s of sizes) {
      variants.push({
        id: `v-${prefix}-${index++}`,
        productId: productId,
        size: s,
        color: c.name,
        colorCode: c.hex,
        stock: Math.floor(Math.random() * 25) + 15, // 15 - 40 items in stock
        sku: `${prefix.toUpperCase()}-${c.code}-${s}`
      });
    }
  }
  return variants;
}

// Map each product to its dedicated rich colors and sizes
const productVariantConfig = {
  // CAT 1: Áo Nam & Nữ
  'prod-ao-1': {
    prefix: 'ao1',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' },
      { name: 'Đen', hex: '#111827', code: 'BLK' },
      { name: 'Xám Tiêu', hex: '#9ca3af', code: 'GRY' },
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' }
    ]
  },
  'prod-ao-2': {
    prefix: 'ao2',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' },
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' },
      { name: 'Đen', hex: '#111827', code: 'BLK' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' }
    ]
  },
  'prod-ao-3': {
    prefix: 'ao3',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' },
      { name: 'Xanh Nhạt', hex: '#bfdbfe', code: 'BLU' },
      { name: 'Hồng Nhạt', hex: '#fce7f3', code: 'PNK' }
    ]
  },
  'prod-ao-4': {
    prefix: 'ao4',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xám Tiêu', hex: '#9ca3af', code: 'GRY' },
      { name: 'Đen', hex: '#111827', code: 'BLK' },
      { name: 'Trắng Kem', hex: '#fef08a', code: 'CRM' },
      { name: 'Nâu Rêu', hex: '#78350f', code: 'BRN' }
    ]
  },
  'prod-ao-5': {
    prefix: 'ao5',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' },
      { name: 'Be Sữa', hex: '#f5f5dc', code: 'BGE' },
      { name: 'Trắng Gạo', hex: '#f8fafc', code: 'WHT' }
    ]
  },
  'prod-ao-6': {
    prefix: 'ao6',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Đen Phối Trắng', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' },
      { name: 'Trắng Phối Đỏ', hex: '#ffffff', code: 'WHT' }
    ]
  },
  'prod-ao-7': {
    prefix: 'ao7',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xám Ghi', hex: '#9ca3af', code: 'GRY' }
    ]
  },
  'prod-ao-8': {
    prefix: 'ao8',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Sọc Xanh', hex: '#60a5fa', code: 'BLU' },
      { name: 'Sọc Đen', hex: '#374151', code: 'BLK' },
      { name: 'Sọc Nâu', hex: '#92400e', code: 'BRN' }
    ]
  },
  'prod-ao-9': {
    prefix: 'ao9',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xám', hex: '#9ca3af', code: 'GRY' },
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' },
      { name: 'Xanh Cổ Vịt', hex: '#0f766e', code: 'TEA' }
    ]
  },
  'prod-ao-10': {
    prefix: 'ao10',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' },
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Đỏ Đô', hex: '#991b1b', code: 'RED' }
    ]
  },

  // CAT 2: Quần Thời Trang
  'prod-quan-1': {
    prefix: 'q1',
    sizes: ['29', '30', '31', '32', '33', '34'],
    colors: [
      { name: 'Xanh Indigo', hex: '#1d4ed8', code: 'IND' },
      { name: 'Xanh Nhạt Vintage', hex: '#60a5fa', code: 'BLU' },
      { name: 'Đen Tuyền', hex: '#18181b', code: 'BLK' }
    ]
  },
  'prod-quan-2': {
    prefix: 'q2',
    sizes: ['29', '30', '31', '32', '33', '34'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xám Than', hex: '#374151', code: 'GRY' },
      { name: 'Xanh Đen', hex: '#0f172a', code: 'NVY' },
      { name: 'Be Khaki', hex: '#d4b996', code: 'BGE' }
    ]
  },
  'prod-quan-3': {
    prefix: 'q3',
    sizes: ['29', '30', '31', '32', '33', '34'],
    colors: [
      { name: 'Be Khaki', hex: '#d4b996', code: 'BGE' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Đất', hex: '#78350f', code: 'BRN' }
    ]
  },
  'prod-quan-4': {
    prefix: 'q4',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Be Khaki', hex: '#d4b996', code: 'BGE' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' },
      { name: 'Trắng Kem', hex: '#fef08a', code: 'WHT' }
    ]
  },
  'prod-quan-5': {
    prefix: 'q5',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Khói', hex: '#64748b', code: 'SMK' },
      { name: 'Xanh Nhạt Hàn Quốc', hex: '#93c5fd', code: 'BLU' },
      { name: 'Đen Wash', hex: '#27272a', code: 'BLK' }
    ]
  },
  'prod-quan-6': {
    prefix: 'q6',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xám Ghi', hex: '#9ca3af', code: 'GRY' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' }
    ]
  },
  'prod-quan-7': {
    prefix: 'q7',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xám Tiêu', hex: '#9ca3af', code: 'GRY' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' }
    ]
  },
  'prod-quan-8': {
    prefix: 'q8',
    sizes: ['29', '30', '31', '32', '33', '34'],
    colors: [
      { name: 'Xanh Đen', hex: '#0f172a', code: 'NVY' },
      { name: 'Đen Tuyền', hex: '#18181b', code: 'BLK' },
      { name: 'Ghi Sáng', hex: '#9ca3af', code: 'GRY' }
    ]
  },
  'prod-quan-9': {
    prefix: 'q9',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Be Khaki', hex: '#d4b996', code: 'BGE' }
    ]
  },
  'prod-quan-10': {
    prefix: 'q10',
    sizes: ['29', '30', '31', '32', '33', '34'],
    colors: [
      { name: 'Đen Tuyền', hex: '#18181b', code: 'BLK' },
      { name: 'Đen Khói', hex: '#3f3f46', code: 'SMK' }
    ]
  },

  // CAT 3: Váy & Đầm Nữ
  'prod-vay-1': {
    prefix: 'v1',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Đen Quyến Rũ', hex: '#18181b', code: 'BLK' },
      { name: 'Be Nude', hex: '#f5f5dc', code: 'BGE' },
      { name: 'Hồng Nude', hex: '#fed7aa', code: 'PNK' }
    ]
  },
  'prod-vay-2': {
    prefix: 'v2',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Trắng Kem', hex: '#fef08a', code: 'CRM' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Tây', hex: '#854d0e', code: 'BRN' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' }
    ]
  },
  'prod-vay-3': {
    prefix: 'v3',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Xanh Pastel', hex: '#bae6fd', code: 'BLU' },
      { name: 'Trắng Tinh Khôi', hex: '#ffffff', code: 'WHT' },
      { name: 'Hồng Phấn', hex: '#fbcfe8', code: 'PNK' }
    ]
  },
  'prod-vay-4': {
    prefix: 'v4',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Nhạt', hex: '#a16207', code: 'BRN' },
      { name: 'Be Sữa', hex: '#f5f5dc', code: 'BGE' },
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' }
    ]
  },
  'prod-vay-5': {
    prefix: 'v5',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Xanh Nhạt', hex: '#93c5fd', code: 'BLU' },
      { name: 'Xanh Đậm', hex: '#1e40af', code: 'NVY' },
      { name: 'Đen Wash', hex: '#27272a', code: 'BLK' }
    ]
  },
  'prod-vay-6': {
    prefix: 'v6',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Hoa Vàng', hex: '#facc15', code: 'YEL' },
      { name: 'Hoa Xanh', hex: '#60a5fa', code: 'BLU' },
      { name: 'Hoa Hồng', hex: '#f472b6', code: 'PNK' }
    ]
  },
  'prod-vay-7': {
    prefix: 'v7',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' },
      { name: 'Hồng Nhạt', hex: '#fbcfe8', code: 'PNK' }
    ]
  },
  'prod-vay-8': {
    prefix: 'v8',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Đỏ Rượu', hex: '#881337', code: 'RED' },
      { name: 'Đen Quyến Rũ', hex: '#18181b', code: 'BLK' },
      { name: 'Vàng Champagne', hex: '#fde047', code: 'GLD' },
      { name: 'Xanh Emerald', hex: '#065f46', code: 'GRN' }
    ]
  },
  'prod-vay-9': {
    prefix: 'v9',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Đen', hex: '#0f172a', code: 'NVY' },
      { name: 'Nâu Tây', hex: '#78350f', code: 'BRN' }
    ]
  },
  'prod-vay-10': {
    prefix: 'v10',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Trắng Sữa', hex: '#f8fafc', code: 'WHT' },
      { name: 'Vàng Mustard', hex: '#eab308', code: 'YEL' },
      { name: 'Cam Đất', hex: '#c2410c', code: 'ORG' }
    ]
  },

  // CAT 4: Áo Khoác & Blazer
  'prod-khoac-1': {
    prefix: 'k1',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Đen', hex: '#0f172a', code: 'NVY' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xám Bạc', hex: '#9ca3af', code: 'GRY' },
      { name: 'Đỏ Đô', hex: '#991b1b', code: 'RED' }
    ]
  },
  'prod-khoac-2': {
    prefix: 'k2',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xám Bạc', hex: '#cbd5e1', code: 'GRY' },
      { name: 'Xanh Nhạt', hex: '#93c5fd', code: 'BLU' },
      { name: 'Hồng Phấn', hex: '#fbcfe8', code: 'PNK' },
      { name: 'Xanh Mint', hex: '#a7f3d0', code: 'GRN' }
    ]
  },
  'prod-khoac-3': {
    prefix: 'k3',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Vintage', hex: '#3b82f6', code: 'BLU' },
      { name: 'Xanh Đậm', hex: '#1d4ed8', code: 'NVY' },
      { name: 'Đen Khói', hex: '#27272a', code: 'BLK' }
    ]
  },
  'prod-khoac-4': {
    prefix: 'k4',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Tây', hex: '#854d0e', code: 'BRN' },
      { name: 'Xám Khói', hex: '#64748b', code: 'GRY' },
      { name: 'Be Sữa', hex: '#f5f5dc', code: 'BGE' }
    ]
  },
  'prod-khoac-5': {
    prefix: 'k5',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Kem Be', hex: '#fef08a', code: 'CRM' },
      { name: 'Nâu Cafe', hex: '#78350f', code: 'BRN' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' }
    ]
  },
  'prod-khoac-6': {
    prefix: 'k6',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' }
    ]
  },
  'prod-khoac-7': {
    prefix: 'k7',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xám Nhạt', hex: '#9ca3af', code: 'GRY' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Dương', hex: '#3b82f6', code: 'BLU' },
      { name: 'Cam Đất', hex: '#ea580c', code: 'ORG' }
    ]
  },
  'prod-khoac-8': {
    prefix: 'k8',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' },
      { name: 'Đen Tuyền', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Sang Trọng', hex: '#78350f', code: 'BRN' }
    ]
  },
  'prod-khoac-9': {
    prefix: 'k9',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xám Tiêu', hex: '#9ca3af', code: 'GRY' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' }
    ]
  },
  'prod-khoac-10': {
    prefix: 'k10',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' },
      { name: 'Ghi Sáng', hex: '#9ca3af', code: 'GRY' },
      { name: 'Vàng Đất', hex: '#ca8a04', code: 'YEL' }
    ]
  },

  // CAT 5: Hoodie & Sweater
  'prod-hd-1': {
    prefix: 'hd1',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xám Nhạt', hex: '#9ca3af', code: 'GRY' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Trắng Kem', hex: '#fef08a', code: 'CRM' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' }
    ]
  },
  'prod-hd-2': {
    prefix: 'hd2',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' },
      { name: 'Be Kem', hex: '#f5f5dc', code: 'BGE' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Đất', hex: '#78350f', code: 'BRN' }
    ]
  },
  'prod-hd-3': {
    prefix: 'hd3',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xám Tiêu', hex: '#9ca3af', code: 'GRY' },
      { name: 'Xanh Đen', hex: '#0f172a', code: 'NVY' },
      { name: 'Nâu Cafe', hex: '#78350f', code: 'BRN' }
    ]
  },
  'prod-hd-4': {
    prefix: 'hd4',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Trắng Kem', hex: '#fef08a', code: 'CRM' },
      { name: 'Nâu Tây', hex: '#854d0e', code: 'BRN' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' },
      { name: 'Xám Tro', hex: '#9ca3af', code: 'GRY' }
    ]
  },
  'prod-hd-5': {
    prefix: 'hd5',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Nâu Cà Phê', hex: '#78350f', code: 'BRN' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xám Khói', hex: '#64748b', code: 'GRY' }
    ]
  },
  'prod-hd-6': {
    prefix: 'hd6',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Trắng Sữa', hex: '#f8fafc', code: 'WHT' },
      { name: 'Xám Đậm', hex: '#374151', code: 'GRY' },
      { name: 'Nâu Be', hex: '#a16207', code: 'BRN' }
    ]
  },
  // prod-hd-7: Áo Hoodie Dáng Lửng Cropped Năng Động (USER'S REQUESTED SCREENSHOT)
  'prod-hd-7': {
    prefix: 'hd7',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Vàng Mustard', hex: '#eab308', code: 'YEL' }, // EXACT color worn by model in photo!
      { name: 'Hồng Pastel', hex: '#fbcfe8', code: 'PNK' },
      { name: 'Đen Basic', hex: '#18181b', code: 'BLK' },
      { name: 'Trắng Kem', hex: '#fef08a', code: 'CRM' },
      { name: 'Xám Tiêu', hex: '#9ca3af', code: 'GRY' }
    ]
  },
  'prod-hd-8': {
    prefix: 'hd8',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Nâu Be', hex: '#a16207', code: 'BRN' },
      { name: 'Xanh Rêu', hex: '#3f6212', code: 'GRN' },
      { name: 'Kem Sữa', hex: '#fef08a', code: 'CRM' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' }
    ]
  },
  'prod-hd-9': {
    prefix: 'hd9',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' },
      { name: 'Xám Ghi', hex: '#9ca3af', code: 'GRY' },
      { name: 'Đen Tuyền', hex: '#18181b', code: 'BLK' }
    ]
  },
  'prod-hd-10': {
    prefix: 'hd10',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Trắng Phối Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Xám Phối Xanh', hex: '#1e3a8a', code: 'NVY' },
      { name: 'Kem Phối Nâu', hex: '#78350f', code: 'BRN' }
    ]
  },

  // CAT 6: Phụ Kiện Cao Cấp
  'prod-pk-1': {
    prefix: 'pk1',
    sizes: ['Vừa (14 Inch)', 'Lớn (15.6 Inch)'],
    colors: [
      { name: 'Đen Tuyền', hex: '#18181b', code: 'BLK' },
      { name: 'Xám Than', hex: '#374151', code: 'GRY' },
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' }
    ]
  },
  'prod-pk-2': {
    prefix: 'pk2',
    sizes: ['Tiêu Chuẩn (FreeSize)'],
    colors: [
      { name: 'Trắng Ngà', hex: '#fef08a', code: 'CRM' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Bò', hex: '#854d0e', code: 'BRN' }
    ]
  },
  'prod-pk-3': {
    prefix: 'pk3',
    sizes: ['FreeSize'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Be', hex: '#d4b996', code: 'BGE' },
      { name: 'Trắng', hex: '#ffffff', code: 'WHT' },
      { name: 'Xanh Navy', hex: '#1e3a8a', code: 'NVY' }
    ]
  },
  'prod-pk-4': {
    prefix: 'pk4',
    sizes: ['FreeSize'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Vàng Mustard', hex: '#eab308', code: 'YEL' },
      { name: 'Be Sữa', hex: '#f5f5dc', code: 'BGE' }
    ]
  },
  'prod-pk-5': {
    prefix: 'pk5',
    sizes: ['110cm', '115cm', '120cm', '125cm'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Bò', hex: '#854d0e', code: 'BRN' },
      { name: 'Nâu Đậm', hex: '#451a03', code: 'DKB' }
    ]
  },
  'prod-pk-6': {
    prefix: 'pk6',
    sizes: ['Tiêu Chuẩn (FreeSize)'],
    colors: [
      { name: 'Nâu Đậm', hex: '#451a03', code: 'DKB' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Sáng', hex: '#854d0e', code: 'BRN' }
    ]
  },
  'prod-pk-7': {
    prefix: 'pk7',
    sizes: ['FreeSize'],
    colors: [
      { name: 'Gọng Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Gọng Đồi Mồi', hex: '#78350f', code: 'BRN' },
      { name: 'Gọng Bạc', hex: '#9ca3af', code: 'SLV' }
    ]
  },
  'prod-pk-8': {
    prefix: 'pk8',
    sizes: ['FreeSize'],
    colors: [
      { name: 'Xám Tiêu', hex: '#9ca3af', code: 'GRY' },
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Nâu Tây', hex: '#854d0e', code: 'BRN' },
      { name: 'Be Kem', hex: '#fef08a', code: 'CRM' }
    ]
  },
  'prod-pk-9': {
    prefix: 'pk9',
    sizes: ['FreeSize (38-42)'],
    colors: [
      { name: 'Mix 3 Màu (Đen/Trắng/Xám)', hex: '#18181b', code: 'MIX' },
      { name: 'Set Full Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Set Full Trắng', hex: '#ffffff', code: 'WHT' }
    ]
  },
  'prod-pk-10': {
    prefix: 'pk10',
    sizes: ['38-39', '40-41', '42-43', '44-45'],
    colors: [
      { name: 'Đen', hex: '#18181b', code: 'BLK' },
      { name: 'Trắng Sữa', hex: '#f8fafc', code: 'WHT' },
      { name: 'Xám Bạc', hex: '#9ca3af', code: 'GRY' }
    ]
  }
};

let updatedCount = 0;
store.products.forEach(prod => {
  const config = productVariantConfig[prod.id];
  if (config) {
    prod.variants = generateVariants(prod.id, config.prefix, config.colors, config.sizes, prod.price);
    updatedCount++;
  }
});

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log(`Successfully updated variants for ${updatedCount} products in ${storePath}`);
