const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, 'data', 'store.json');
const currentStore = JSON.parse(fs.readFileSync(storePath, 'utf8'));

// 60 Everyday Wear Products (10 per category)
const products = [
  // CAT 1: Áo Nam & Nữ (10 items)
  {
    id: "prod-ao-1",
    name: "Áo Thun Basic Heavyweight Cotton",
    slug: "ao-thun-basic-heavyweight-cotton",
    categoryId: "cat-1",
    brand: "Nguyên Studio",
    price: 290000,
    salePrice: 249000,
    description: "Áo thun basic hàng ngày form relaxed-fit từ chất liệu 100% cotton định lượng 260gsm dày dặn, thấm hút mồ hôi tốt, mặc đi học đi làm cực dễ chịu.",
    details: ["100% Cotton chải kỹ cao cấp", "Định lượng 260gsm dày dặn", "Cổ bo dệt chắc chắn, không bai nhão", "Độ co rút < 2% sau khi giặt"],
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao1-1", productId: "prod-ao-1", size: "M", color: "Trắng", colorCode: "#ffffff", stock: 35, sku: "TS-WHT-M" },
      { id: "v-ao1-2", productId: "prod-ao-1", size: "L", color: "Trắng", colorCode: "#ffffff", stock: 40, sku: "TS-WHT-L" },
      { id: "v-ao1-3", productId: "prod-ao-1", size: "M", color: "Đen", colorCode: "#111827", stock: 28, sku: "TS-BLK-M" },
      { id: "v-ao1-4", productId: "prod-ao-1", size: "L", color: "Đen", colorCode: "#111827", stock: 32, sku: "TS-BLK-L" }
    ],
    rating: 4.9, reviewCount: 64, soldCount: 420, isFeatured: true, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-10T00:00:00Z"
  },
  {
    id: "prod-ao-2",
    name: "Áo Polo Pique Cotton Dệt Tổ Ong",
    slug: "ao-polo-pique-cotton-det-to-ong",
    categoryId: "cat-1",
    brand: "Nguyên Studio",
    price: 390000,
    salePrice: 320000,
    description: "Áo polo dệt tổ ong thoáng khí, cổ bẻ thanh lịch phù hợp cho cả đi làm văn phòng và gặp gỡ bạn bè cuối tuần.",
    details: ["Vải Pique mắt chim dệt kim tinh xảo", "Cổ áo dệt sợi chống quăn mép", "Form Regular fit ôm nhẹ ngực"],
    images: ["https://images.unsplash.com/photo-1625910513413-7e2468351c91?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao2-1", productId: "prod-ao-2", size: "M", color: "Xanh Navy", colorCode: "#1e3a8a", stock: 25, sku: "POLO-NVY-M" },
      { id: "v-ao2-2", productId: "prod-ao-2", size: "L", color: "Xanh Navy", colorCode: "#1e3a8a", stock: 20, sku: "POLO-NVY-L" },
      { id: "v-ao2-3", productId: "prod-ao-2", size: "M", color: "Trắng", colorCode: "#ffffff", stock: 30, sku: "POLO-WHT-M" }
    ],
    rating: 4.8, reviewCount: 38, soldCount: 260, isFeatured: true, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-12T00:00:00Z"
  },
  {
    id: "prod-ao-3",
    name: "Áo Sơ Mi Trắng Oxford Slim-Fit",
    slug: "ao-so-mi-trang-oxford-slim-fit",
    categoryId: "cat-1",
    brand: "Nguyên Sartorial",
    price: 450000,
    salePrice: 399000,
    description: "Áo sơ mi vải Oxford dệt thoi mật độ cao, chống nhăn tự nhiên, cổ gài nút button-down thanh lịch trang trọng.",
    details: ["100% sợi cotton tự nhiên", "Cổ Button-down chống gãy gập", "Hàng cúc xà cừ khắc chìm"],
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao3-1", productId: "prod-ao-3", size: "S", color: "Trắng", colorCode: "#ffffff", stock: 15, sku: "OXF-WHT-S" },
      { id: "v-ao3-2", productId: "prod-ao-3", size: "M", color: "Trắng", colorCode: "#ffffff", stock: 24, sku: "OXF-WHT-M" },
      { id: "v-ao3-3", productId: "prod-ao-3", size: "L", color: "Trắng", colorCode: "#ffffff", stock: 18, sku: "OXF-WHT-L" }
    ],
    rating: 4.9, reviewCount: 52, soldCount: 310, isFeatured: true, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-05T00:00:00Z"
  },
  {
    id: "prod-ao-4",
    name: "Áo Thun Cổ Tròn Oversize Dáng Rộng",
    slug: "ao-thun-co-tron-oversize-dang-rong",
    categoryId: "cat-1",
    brand: "Nguyên Studio",
    price: 280000,
    description: "Áo thun dáng thụng streetwear trẻ trung, vai trễ phóng khoáng, dễ dàng mix match cùng quần jean hoặc quần short.",
    details: ["Chất cotton khô 250gsm", "Form vai trễ drop-shoulder", "Đường may đè 2 kim kiên cố"],
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao4-1", productId: "prod-ao-4", size: "M", color: "Xám Tiêu", colorCode: "#9ca3af", stock: 20, sku: "OV-GRY-M" },
      { id: "v-ao4-2", productId: "prod-ao-4", size: "L", color: "Xám Tiêu", colorCode: "#9ca3af", stock: 22, sku: "OV-GRY-L" }
    ],
    rating: 4.7, reviewCount: 29, soldCount: 185, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-15T00:00:00Z"
  },
  {
    id: "prod-ao-5",
    name: "Áo Sơ Mi Đũi Linen Ngắn Tay Mùa Hè",
    slug: "ao-so-mi-dui-linen-ngan-tay",
    categoryId: "cat-1",
    brand: "Nguyên Studio",
    price: 360000,
    salePrice: 299000,
    description: "Sơ mi ngắn tay chất liệu đũi pha linen mộc mạc, thấm hút mồ hôi tối ưu cho những ngày nắng nóng hoặc đi du lịch.",
    details: ["70% Linen, 30% Cotton mát lạnh", "Cổ Cuba mở phóng khoáng", "Túi ốp ngực tiện lợi"],
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao5-1", productId: "prod-ao-5", size: "M", color: "Xanh Rêu", colorCode: "#3f6212", stock: 18, sku: "LIN-GRN-M" },
      { id: "v-ao5-2", productId: "prod-ao-5", size: "L", color: "Be Sữa", colorCode: "#f5f5dc", stock: 25, sku: "LIN-BGE-L" }
    ],
    rating: 4.8, reviewCount: 19, soldCount: 142, isFeatured: false, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-14T00:00:00Z"
  },
  {
    id: "prod-ao-6",
    name: "Áo Polo Thể Thao Phối Viền Cổ Bo",
    slug: "ao-polo-the-thao-phoi-vien-co-bo",
    categoryId: "cat-1",
    brand: "Nguyên Active",
    price: 350000,
    description: "Polo sợi tổng hợp co giãn 4 chiều kháng khuẩn, viền cổ bo dệt thời trang, phù hợp cho vận động và đi làm.",
    details: ["Vải Poly Coolmax thấm hút siêu tốc", "Chống nhăn tuyệt đối", "Đường may Flatlock không gây cọ xát"],
    images: ["https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao6-1", productId: "prod-ao-6", size: "L", color: "Đen Phối Trắng", colorCode: "#18181b", stock: 30, sku: "POLO-ACT-L" }
    ],
    rating: 4.9, reviewCount: 42, soldCount: 290, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-08T00:00:00Z"
  },
  {
    id: "prod-ao-7",
    name: "Áo Thun Ba Lỗ Tank Top Cotton Thoáng Mát",
    slug: "ao-thun-ba-lo-tank-top-cotton",
    categoryId: "cat-1",
    brand: "Nguyên Active",
    price: 180000,
    salePrice: 149000,
    description: "Áo ba lỗ mặc lót trong sơ mi hoặc mặc tập gym, ở nhà thoải mái mát mẻ chất 100% cotton co giãn 2 chiều.",
    details: ["100% Cotton chải", "Nách áo khoét vừa vặn", "Đường viền cổ êm ái"],
    images: ["https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao7-1", productId: "prod-ao-7", size: "M", color: "Trắng", colorCode: "#ffffff", stock: 50, sku: "TANK-WHT-M" },
      { id: "v-ao7-2", productId: "prod-ao-7", size: "L", color: "Đen", colorCode: "#000000", stock: 45, sku: "TANK-BLK-L" }
    ],
    rating: 4.7, reviewCount: 51, soldCount: 380, isFeatured: false, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-04T00:00:00Z"
  },
  {
    id: "prod-ao-8",
    name: "Áo Sơ Mi Kẻ Sọc Xanh Casual",
    slug: "ao-so-mi-ke-soc-xanh-casual",
    categoryId: "cat-1",
    brand: "Nguyên Studio",
    price: 420000,
    description: "Họa tiết kẻ sọc xanh thanh lịch chuẩn phong cách Hàn Quốc, diện đi học, đi làm hay đi cà phê đều cực kỳ cuốn hút.",
    details: ["Chất Poplin mềm mịn ít nhăn", "Họa tiết sọc nhuyễn tôn dáng", "Form suông nhẹ hiện đại"],
    images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao8-1", productId: "prod-ao-8", size: "M", color: "Sọc Xanh", colorCode: "#38bdf8", stock: 22, sku: "SMI-STR-M" },
      { id: "v-ao8-2", productId: "prod-ao-8", size: "L", color: "Sọc Xanh", colorCode: "#38bdf8", stock: 19, sku: "SMI-STR-L" }
    ],
    rating: 4.8, reviewCount: 22, soldCount: 160, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-16T00:00:00Z"
  },
  {
    id: "prod-ao-9",
    name: "Áo Thun Cổ Tim V-Neck Mềm Mại",
    slug: "ao-thun-co-tim-v-neck-mem-mai",
    categoryId: "cat-1",
    brand: "Nguyên Studio",
    price: 260000,
    salePrice: 219000,
    description: "Cổ tim xẻ nông vừa phải tôn xương quai xanh và tạo cảm giác cơ thể thanh thoát hơn, chất vải mềm nhẹ như mây.",
    details: ["Cotton compact chống xù lông", "Cổ tim may mí tỉ mỉ", "Màu sắc trung tính nhã nhặn"],
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao9-1", productId: "prod-ao-9", size: "M", color: "Đen", colorCode: "#000000", stock: 26, sku: "VNK-BLK-M" },
      { id: "v-ao9-2", productId: "prod-ao-9", size: "L", color: "Xám", colorCode: "#6b7280", stock: 18, sku: "VNK-GRY-L" }
    ],
    rating: 4.8, reviewCount: 31, soldCount: 210, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-09T00:00:00Z"
  },
  {
    id: "prod-ao-10",
    name: "Áo Thun Tay Dài Cotton Thu Đông",
    slug: "ao-thun-tay-dai-cotton-thu-dong",
    categoryId: "cat-1",
    brand: "Nguyên Studio",
    price: 320000,
    description: "Áo thun tay dài giữ nhiệt nhẹ, chất cotton co giãn êm ái, thích hợp mặc thời tiết se lạnh hoặc phòng máy lạnh.",
    details: ["Cotton 100% 2 chiều", "Bo cổ tay ôm vừa vặn", "Dễ phối lớp áo khoác bên ngoài"],
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-ao10-1", productId: "prod-ao-10", size: "M", color: "Xanh Navy", colorCode: "#1e3a8a", stock: 30, sku: "LNG-NVY-M" },
      { id: "v-ao10-2", productId: "prod-ao-10", size: "L", color: "Trắng", colorCode: "#ffffff", stock: 24, sku: "LNG-WHT-L" }
    ],
    rating: 4.9, reviewCount: 40, soldCount: 275, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-18T00:00:00Z"
  },

  // CAT 2: Quần Thời Trang (10 items)
  {
    id: "prod-quan-1",
    name: "Quần Jean Nam Regular Fit Xanh Indigo",
    slug: "quan-jean-nam-regular-fit-xanh-indigo",
    categoryId: "cat-2",
    brand: "Nguyên Denim",
    price: 590000,
    salePrice: 499000,
    description: "Quần jean ống đứng kinh điển wash màu indigo sâu thẳm, chất denim 13oz bền chắc pha 2% elastane chuyển động êm ái.",
    details: ["Denim 13oz nhập khẩu", "Khóa kéo đồng YKK cao cấp", "Form Regular Fit thẳng đứng tôn dáng"],
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q1-1", productId: "prod-quan-1", size: "29", color: "Xanh Indigo", colorCode: "#1e3a8a", stock: 20, sku: "JN-IND-29" },
      { id: "v-q1-2", productId: "prod-quan-1", size: "30", color: "Xanh Indigo", colorCode: "#1e3a8a", stock: 25, sku: "JN-IND-30" },
      { id: "v-q1-3", productId: "prod-quan-1", size: "31", color: "Xanh Indigo", colorCode: "#1e3a8a", stock: 18, sku: "JN-IND-31" }
    ],
    rating: 4.9, reviewCount: 45, soldCount: 310, isFeatured: true, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-07T00:00:00Z"
  },
  {
    id: "prod-quan-2",
    name: "Quần Tây Âu Dáng Ôm Smart Trousers",
    slug: "quan-tay-au-dang-om-smart-trousers",
    categoryId: "cat-2",
    brand: "Nguyên Sartorial",
    price: 520000,
    salePrice: 450000,
    description: "Quần âu may đo phẳng phiu, vải tuyết mưa đứng form không nhăn, lưng cài đai cúc ẩn sang trọng chuẩn phong cách công sở.",
    details: ["Vải tuyết mưa cao cấp", "Xếp ly ủi chết tinh xảo", "Cạp quần êm ái chống tuột sơ mi"],
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q2-1", productId: "prod-quan-2", size: "30", color: "Đen", colorCode: "#000000", stock: 28, sku: "TRS-BLK-30" },
      { id: "v-q2-2", productId: "prod-quan-2", size: "31", color: "Xám Than", colorCode: "#374151", stock: 22, sku: "TRS-CGRY-31" }
    ],
    rating: 4.8, reviewCount: 36, soldCount: 240, isFeatured: true, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-11T00:00:00Z"
  },
  {
    id: "prod-quan-3",
    name: "Quần Kaki Chinos Ống Đứng Co Giãn",
    slug: "quan-kaki-chinos-ong-dung-co-gian",
    categoryId: "cat-2",
    brand: "Nguyên Studio",
    price: 450000,
    description: "Quần chinos màu be kinh điển cho chàng trai yêu thích sự năng động lịch thiệp, dễ dàng kết hợp cùng áo thun hay polo.",
    details: ["Kaki cotton dệt chéo mềm mại", "Co giãn nhẹ vận động linh hoạt", "Túi chéo tiện lợi"],
    images: ["https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q3-1", productId: "prod-quan-3", size: "30", color: "Be Khaki", colorCode: "#d2b48c", stock: 24, sku: "CHIN-BGE-30" },
      { id: "v-q3-2", productId: "prod-quan-3", size: "32", color: "Xanh Rêu", colorCode: "#3f6212", stock: 19, sku: "CHIN-GRN-32" }
    ],
    rating: 4.8, reviewCount: 29, soldCount: 195, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-09T00:00:00Z"
  },
  {
    id: "prod-quan-4",
    name: "Quần Short Kaki Dạo Phố Thoải Mái",
    slug: "quan-short-kaki-dao-pho",
    categoryId: "cat-2",
    brand: "Nguyên Studio",
    price: 290000,
    salePrice: 239000,
    description: "Quần đùi short kaki dài ngang gối năng động, thoáng mát cho ngày hè dạo phố hay những chuyến dã ngoại cuối tuần.",
    details: ["100% Cotton kaki wash mềm", "Túi hậu cài nút bảo vệ ví", "Độ dài ngang gối chuẩn mực"],
    images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q4-1", productId: "prod-quan-4", size: "M", color: "Be", colorCode: "#d2b48c", stock: 30, sku: "SHRT-BGE-M" },
      { id: "v-q4-2", productId: "prod-quan-4", size: "L", color: "Đen", colorCode: "#000000", stock: 25, sku: "SHRT-BLK-L" }
    ],
    rating: 4.7, reviewCount: 44, soldCount: 310, isFeatured: false, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-06T00:00:00Z"
  },
  {
    id: "prod-quan-5",
    name: "Quần Jean Ống Suông Rộng Phong Cách Hàn Quốc",
    slug: "quan-jean-ong-suong-rong-han-quoc",
    categoryId: "cat-2",
    brand: "Nguyên Denim",
    price: 550000,
    description: "Dáng ống suông rộng Wide-leg che khuyết điểm chân hoàn hảo, wash màu xanh khói thời thượng chuẩn phong cách gen Z.",
    details: ["Denim không giãn giữ form đứng", "Độ dài chấm gót hack chân", "Cạp cao ôm eo tôn dáng"],
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q5-1", productId: "prod-quan-5", size: "M", color: "Xanh Khói", colorCode: "#64748b", stock: 18, sku: "WIDE-BLU-M" },
      { id: "v-q5-2", productId: "prod-quan-5", size: "L", color: "Xanh Khói", colorCode: "#64748b", stock: 22, sku: "WIDE-BLU-L" }
    ],
    rating: 4.9, reviewCount: 52, soldCount: 340, isFeatured: true, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-13T00:00:00Z"
  },
  {
    id: "prod-quan-6",
    name: "Quần Short Thun Thể Thao Mặc Nhà & Chạy Bộ",
    slug: "quan-short-thun-the-thao",
    categoryId: "cat-2",
    brand: "Nguyên Active",
    price: 220000,
    salePrice: 179000,
    description: "Quần short thun da cá co giãn có túi khóa kéo an toàn để điện thoại, siêu nhẹ và êm ái cho sinh hoạt hằng ngày.",
    details: ["Nỉ da cá nhẹ mịn", "Túi 2 bên có khóa zip tiện lợi", "Dây rút luồn cạp quần chắc chắn"],
    images: ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q6-1", productId: "prod-quan-6", size: "M", color: "Xám Ghi", colorCode: "#6b7280", stock: 35, sku: "RUN-GRY-M" },
      { id: "v-q6-2", productId: "prod-quan-6", size: "L", color: "Đen", colorCode: "#000000", stock: 40, sku: "RUN-BLK-L" }
    ],
    rating: 4.8, reviewCount: 60, soldCount: 420, isFeatured: false, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-04T00:00:00Z"
  },
  {
    id: "prod-quan-7",
    name: "Quần Jogger Bo Gấu Nỉ Da Cá Streetwear",
    slug: "quan-jogger-bo-gau-ni-da-ca",
    categoryId: "cat-2",
    brand: "Nguyên Active",
    price: 390000,
    description: "Quần jogger bo gấu ôm cổ chân gọn gàng, phối giày sneaker thể thao cực chất cho những ngày se lạnh.",
    details: ["Nỉ cotton da cá 320gsm", "Bo gấu gân dệt co giãn tốt", "Form relaxed thoải mái vận động"],
    images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q7-1", productId: "prod-quan-7", size: "M", color: "Đen", colorCode: "#000000", stock: 24, sku: "JOG-BLK-M" },
      { id: "v-q7-2", productId: "prod-quan-7", size: "L", color: "Xám Tiêu", colorCode: "#9ca3af", stock: 20, sku: "JOG-GRY-L" }
    ],
    rating: 4.8, reviewCount: 31, soldCount: 215, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-08T00:00:00Z"
  },
  {
    id: "prod-quan-8",
    name: "Quần Tây Lưng Thun Đi Làm Thoải Mái",
    slug: "quan-tay-lung-thun-di-lam",
    categoryId: "cat-2",
    brand: "Nguyên Sartorial",
    price: 480000,
    description: "Thiết kế quần tây thông minh với nửa lưng chun phía sau ẩn tinh tế, ngồi văn phòng cả ngày không bị thít bụng.",
    details: ["Lưng chun co giãn linh hoạt", "Vải sọc chìm chống bám bụi", "Ly quần ủi thẳng tắp"],
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q8-1", productId: "prod-quan-8", size: "30", color: "Xanh Đen", colorCode: "#0f172a", stock: 25, sku: "ELAS-NVY-30" }
    ],
    rating: 4.9, reviewCount: 38, soldCount: 260, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-14T00:00:00Z"
  },
  {
    id: "prod-quan-9",
    name: "Quần Kaki Túi Hộp Cargo Pants Năng Động",
    slug: "quan-kaki-tui-hop-cargo-pants",
    categoryId: "cat-2",
    brand: "Nguyên Studio",
    price: 490000,
    salePrice: 420000,
    description: "Phong cách quân đội cá tính với túi hộp 2 bên đùi tiện lợi, chất vải kaki dầy dặn chống trầy xước.",
    details: ["Kaki dệt chéo 100% cotton", "4 túi hộp tiện dụng nắp gài nút", "Dây rút điều chỉnh gấu quần"],
    images: ["https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q9-1", productId: "prod-quan-9", size: "M", color: "Xanh Rêu", colorCode: "#3f6212", stock: 16, sku: "CARGO-GRN-M" }
    ],
    rating: 4.7, reviewCount: 25, soldCount: 175, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-12T00:00:00Z"
  },
  {
    id: "prod-quan-10",
    name: "Quần Jean Đen Basic Co Giãn Tôn Dáng",
    slug: "quan-jean-den-basic-co-gian",
    categoryId: "cat-2",
    brand: "Nguyên Denim",
    price: 520000,
    description: "Màu đen tuyền không phai màu công nghệ StayBlack, chất denim co giãn êm ái, item không thể thiếu trong tủ đồ.",
    details: ["Công nghệ nhuộm StayBlack bền màu", "Co giãn 4 chiều êm ái", "Form slim fit tôn chiều cao"],
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-q10-1", productId: "prod-quan-10", size: "30", color: "Đen Tuyền", colorCode: "#000000", stock: 35, sku: "JN-BLK-30" },
      { id: "v-q10-2", productId: "prod-quan-10", size: "31", color: "Đen Tuyền", colorCode: "#000000", stock: 30, sku: "JN-BLK-31" }
    ],
    rating: 4.9, reviewCount: 47, soldCount: 390, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-16T00:00:00Z"
  },

  // CAT 3: Váy & Đầm Nữ (10 items)
  {
    id: "prod-vay-1",
    name: "Đầm Thun Suông Chữ A Basic Dạo Phố",
    slug: "dam-thun-suong-chu-a-basic",
    categoryId: "cat-3",
    brand: "Nguyên Femme",
    price: 350000,
    salePrice: 289000,
    description: "Đầm thun suông dáng chữ A che khuyết điểm vòng 2 cực tốt, chất cotton co giãn mát mịn mặc đi làm hay dạo phố đều tiện.",
    details: ["Cotton Compact mềm mát", "Dáng chữ A suông nhẹ nhàng", "Có 2 túi sườn tiện dụng"],
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v1-1", productId: "prod-vay-1", size: "S", color: "Đen", colorCode: "#000000", stock: 22, sku: "DRS-BLK-S" },
      { id: "v-v1-2", productId: "prod-vay-1", size: "M", color: "Be", colorCode: "#d2b48c", stock: 28, sku: "DRS-BGE-M" }
    ],
    rating: 4.9, reviewCount: 39, soldCount: 280, isFeatured: true, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-08T00:00:00Z"
  },
  {
    id: "prod-vay-2",
    name: "Chân Váy Midi Xếp Ly Dáng Xòe Thanh Lịch",
    slug: "chan-vay-midi-xep-ly-dang-xoe",
    categoryId: "cat-3",
    brand: "Nguyên Femme",
    price: 420000,
    description: "Chân váy dập ly nhỏ tinh tế, cạp thun co giãn thoải mái, dễ phối cùng áo thun basic hay sơ mi nữ tính.",
    details: ["Chất voan lụa 2 lớp kín đáo", "Dập ly nhiệt vĩnh viễn không mất nếp", "Lưng thun êm ái"],
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v2-1", productId: "prod-vay-2", size: "FreeSize", color: "Trắng Kem", colorCode: "#fef08a", stock: 30, sku: "SKRT-CRM-FS" }
    ],
    rating: 4.8, reviewCount: 42, soldCount: 310, isFeatured: true, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-12T00:00:00Z"
  },
  {
    id: "prod-vay-3",
    name: "Đầm Sơ Mi Thắt Nơ Eo Công Sở",
    slug: "dam-so-mi-that-no-eo-cong-so",
    categoryId: "cat-3",
    brand: "Nguyên Femme",
    price: 490000,
    salePrice: 420000,
    description: "Thiết kế đầm cổ sơ mi thanh lịch kết hợp đai thắt eo tạo hiệu ứng vòng eo thon gọn, phù hợp môi trường văn phòng chuyên nghiệp.",
    details: ["Chất Kate lụa ít nhăn", "Hàng cúc cài ngực kín đáo", "Kèm đai thắt eo vải cùng màu"],
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v3-1", productId: "prod-vay-3", size: "M", color: "Xanh Pastel", colorCode: "#bae6fd", stock: 18, sku: "SHRT-DRS-M" }
    ],
    rating: 4.9, reviewCount: 31, soldCount: 195, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-10T00:00:00Z"
  },
  {
    id: "prod-vay-4",
    name: "Chân Váy Chữ A Kaki Ngắn Năng Động",
    slug: "chan-vay-chu-a-kaki-ngan",
    categoryId: "cat-3",
    brand: "Nguyên Femme",
    price: 290000,
    salePrice: 249000,
    description: "Chân váy chữ A ngắn có quần bảo hộ bên trong, chất kaki mềm cá tính diện cùng giày sneaker trẻ trung.",
    details: ["Kaki co giãn có lót quần trong", "Khóa kéo sườn kim loại trơn tru", "Form chữ A tôn chân dài"],
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v4-1", productId: "prod-vay-4", size: "S", color: "Đen", colorCode: "#000000", stock: 25, sku: "MINI-BLK-S" },
      { id: "v-v4-2", productId: "prod-vay-4", size: "M", color: "Nâu Nhạt", colorCode: "#78350f", stock: 20, sku: "MINI-BRN-M" }
    ],
    rating: 4.8, reviewCount: 27, soldCount: 180, isFeatured: false, isNewArrival: true, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-14T00:00:00Z"
  },
  {
    id: "prod-vay-5",
    name: "Chân Váy Jean Xẻ Tà Cạp Cao Cá Tính",
    slug: "chan-vay-jean-xe-ta-cap-cao",
    categoryId: "cat-3",
    brand: "Nguyên Denim",
    price: 390000,
    description: "Chân váy jean dài qua gối xẻ tà trước bước đi thoải mái, phối cùng áo croptop hay áo phông đều cực phong cách.",
    details: ["Denim cotton 100% dày dặn", "Xẻ tà trước tinh tế không hớ hênh", "Cạp cao ôm gọn hông"],
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v5-1", productId: "prod-vay-5", size: "M", color: "Xanh Nhạt", colorCode: "#7dd3fc", stock: 22, sku: "DNM-SKT-M" }
    ],
    rating: 4.8, reviewCount: 35, soldCount: 220, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-07T00:00:00Z"
  },
  {
    id: "prod-vay-6",
    name: "Đầm Hoa Nhí Vintage Cổ Vuông Tay Bồng",
    slug: "dam-hoa-nhi-vintage-co-vuong",
    categoryId: "cat-3",
    brand: "Nguyên Femme",
    price: 450000,
    salePrice: 380000,
    description: "Họa tiết hoa nhí vintage ngọt ngào, cổ vuông khoe xương quai xanh quyến rũ, chất voan tơ bay bổng dịu dàng.",
    details: ["Vải voan tơ mềm mát có lót lụa", "Tay bồng chun co giãn nhẹ", "Dây buộc nơ lưng điệu đà"],
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v6-1", productId: "prod-vay-6", size: "S", color: "Hoa Vàng", colorCode: "#fef08a", stock: 15, sku: "FLW-YLW-S" },
      { id: "v-v6-2", productId: "prod-vay-6", size: "M", color: "Hoa Xanh", colorCode: "#bfdbfe", stock: 18, sku: "FLW-BLU-M" }
    ],
    rating: 4.9, reviewCount: 28, soldCount: 190, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-13T00:00:00Z"
  },
  {
    id: "prod-vay-7",
    name: "Chân Váy Xếp Ly Tennis Thể Thao Trẻ Trung",
    slug: "chan-vay-xep-ly-tennis-the-thao",
    categoryId: "cat-3",
    brand: "Nguyên Active",
    price: 250000,
    description: "Chân váy tennis xếp ly đều tăm tắp, phong cách học đường năng động, sẵn quần bảo hộ tiện lợi.",
    details: ["Vải tuyết mưa đứng form ly", "Khóa kéo sườn giọt lệ ẩn", "Lót trong thun cotton 4 chiều"],
    images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v7-1", productId: "prod-vay-7", size: "S", color: "Trắng", colorCode: "#ffffff", stock: 30, sku: "TNS-WHT-S" },
      { id: "v-v7-2", productId: "prod-vay-7", size: "M", color: "Đen", colorCode: "#000000", stock: 25, sku: "TNS-BLK-M" }
    ],
    rating: 4.7, reviewCount: 40, soldCount: 290, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-16T00:00:00Z"
  },
  {
    id: "prod-vay-8",
    name: "Đầm Hai Dây Lụa Satin Dáng Dài Dự Tiệc",
    slug: "dam-hai-day-lua-satin-dang-dai",
    categoryId: "cat-3",
    brand: "Nguyên Femme",
    price: 580000,
    description: "Lụa satin óng ả mềm rủ theo đường cong cơ thể, thiết kế hai dây mảnh thanh mảnh sang trọng cho buổi tối lãng mạn.",
    details: ["Lụa Satin dệt chéo cao cấp", "Dây áo tùy chỉnh độ dài", "Cắt xéo tà tạo độ rủ mềm mại"],
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v8-1", productId: "prod-vay-8", size: "M", color: "Đỏ Rượu", colorCode: "#881337", stock: 12, sku: "STN-RED-M" }
    ],
    rating: 4.9, reviewCount: 34, soldCount: 165, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-05T00:00:00Z"
  },
  {
    id: "prod-vay-9",
    name: "Chân Váy Bút Chì Công Sở Co Giãn Tôn Dáng",
    slug: "chan-vay-but-chi-cong-so",
    categoryId: "cat-3",
    brand: "Nguyên Sartorial",
    price: 360000,
    salePrice: 299000,
    description: "Chân váy bút chì dài qua gối xẻ sau bước đi tự tin, chất co giãn giúp ôm trọn đường cong cơ thể tinh tế.",
    details: ["Vải Umi co giãn 4 chiều dày dặn", "Xẻ sau vừa vặn dễ di chuyển", "Cạp cao giấu bụng hiệu quả"],
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v9-1", productId: "prod-vay-9", size: "M", color: "Đen", colorCode: "#000000", stock: 24, sku: "PNCL-BLK-M" }
    ],
    rating: 4.8, reviewCount: 22, soldCount: 170, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-11T00:00:00Z"
  },
  {
    id: "prod-vay-10",
    name: "Đầm Suông Linen Cổ Yếm Thoáng Mát",
    slug: "dam-suong-linen-co-yem",
    categoryId: "cat-3",
    brand: "Nguyên Femme",
    price: 490000,
    description: "Chất liệu linen tự nhiên 100% mộc mạc và sang trọng, phom suông bay bổng cho những chuyến du lịch biển hay nghỉ dưỡng.",
    details: ["100% Linen dệt tay tự nhiên", "Cổ yếm cột nơ sau gáy duyên dáng", "Thấm hút mồ hôi cực nhanh"],
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-v10-1", productId: "prod-vay-10", size: "FreeSize", color: "Trắng Sữa", colorCode: "#fefce8", stock: 16, sku: "LIN-DRS-FS" }
    ],
    rating: 4.8, reviewCount: 18, soldCount: 120, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-17T00:00:00Z"
  },

  // CAT 4: Áo Khoác & Blazer (10 items)
  {
    id: "prod-khoac-1",
    name: "Áo Khoác Gió Chống Nước Cản Gió 2 Lớp",
    slug: "ao-khoac-gio-chong-nuoc-can-gio",
    categoryId: "cat-4",
    brand: "Nguyên Active",
    price: 450000,
    salePrice: 380000,
    description: "Áo gió 2 lớp công nghệ trượt nước Nano cản gió và mưa nhỏ, tiện lợi khi đi xe máy hằng ngày hoặc chạy bộ tập thể thao.",
    details: ["Vải dù tráng lớp chống thấm Nano", "Lót lưới thoáng khí không bí mồ hôi", "Mũ trùm đầu có dây rút điều chỉnh"],
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k1-1", productId: "prod-khoac-1", size: "M", color: "Xanh Đen", colorCode: "#0f172a", stock: 30, sku: "WND-NVY-M" },
      { id: "v-k1-2", productId: "prod-khoac-1", size: "L", color: "Đen", colorCode: "#000000", stock: 35, sku: "WND-BLK-L" }
    ],
    rating: 4.9, reviewCount: 58, soldCount: 460, isFeatured: true, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-06T00:00:00Z"
  },
  {
    id: "prod-khoac-2",
    name: "Áo Khoác Chống Nắng Thông Hơi UV Block",
    slug: "ao-khoac-chong-nang-uv-block",
    categoryId: "cat-4",
    brand: "Nguyên Active",
    price: 320000,
    salePrice: 269000,
    description: "Chỉ số chống tia tử ngoại UPF 50+ ngăn chặn 98% tia UV gây hại, vải dệt lỗ thông hơi thoáng khí làm mát tức thì.",
    details: ["Chống tia UV đạt chuẩn UPF 50+", "Vải sợi lạnh dệt lỗ kim thoát nhiệt", "Tay áo xỏ ngón che chắn mu bàn tay"],
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k2-1", productId: "prod-khoac-2", size: "M", color: "Xám Bạc", colorCode: "#cbd5e1", stock: 40, sku: "UV-SLV-M" },
      { id: "v-k2-2", productId: "prod-khoac-2", size: "L", color: "Xanh Nhạt", colorCode: "#93c5fd", stock: 35, sku: "UV-BLU-L" }
    ],
    rating: 4.8, reviewCount: 72, soldCount: 580, isFeatured: true, isNewArrival: true, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-14T00:00:00Z"
  },
  {
    id: "prod-khoac-3",
    name: "Áo Khoác Denim Jean Wash Cổ Bẻ Cổ Điển",
    slug: "ao-khoac-denim-jean-wash",
    categoryId: "cat-4",
    brand: "Nguyên Denim",
    price: 650000,
    description: "Áo khoác bò denim 14oz wash màu vintage bụi bặm, form trucker jacket nam tính dễ phối đồ cho mọi lứa tuổi.",
    details: ["Chất denim 100% cotton dày dặn", "Cúc kim loại tán chắc chắn", "2 túi ngực kèm 2 túi hông sâu"],
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k3-1", productId: "prod-khoac-3", size: "M", color: "Xanh Vintage", colorCode: "#3b82f6", stock: 18, sku: "JCK-DNM-M" },
      { id: "v-k3-2", productId: "prod-khoac-3", size: "L", color: "Xanh Vintage", colorCode: "#3b82f6", stock: 20, sku: "JCK-DNM-L" }
    ],
    rating: 4.9, reviewCount: 44, soldCount: 290, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-09T00:00:00Z"
  },
  {
    id: "prod-khoac-4",
    name: "Áo Blazer Nam Nữ Dáng Rộng Hàn Quốc",
    slug: "ao-blazer-dang-rong-han-quoc",
    categoryId: "cat-4",
    brand: "Nguyên Sartorial",
    price: 790000,
    salePrice: 690000,
    description: "Blazer dáng suông thời thượng phong cách Seoul, đệm vai nhẹ tạo form đứng đắn, phù hợp cho đi làm và đi tiệc.",
    details: ["Vải dệt thoi pha Wool cao cấp", "Lót lụa habutai êm ái toàn thân", "Đệm vai mỏng tạo form chuẩn chỉnh"],
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k4-1", productId: "prod-khoac-4", size: "M", color: "Đen", colorCode: "#000000", stock: 15, sku: "BLZ-BLK-M" },
      { id: "v-k4-2", productId: "prod-khoac-4", size: "L", color: "Nâu Tây", colorCode: "#92400e", stock: 12, sku: "BLZ-BRN-L" }
    ],
    rating: 4.9, reviewCount: 36, soldCount: 220, isFeatured: true, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-15T00:00:00Z"
  },
  {
    id: "prod-khoac-5",
    name: "Áo Khoác Cardigan Len Mỏng Cài Cúc",
    slug: "ao-khoac-cardigan-len-mong",
    categoryId: "cat-4",
    brand: "Nguyên Studio",
    price: 390000,
    description: "Cardigan len dệt mỏng nhẹ nhàng khoác hờ mùa thu hoặc ngồi phòng điều hòa văn phòng, mềm mại không ngứa rát.",
    details: ["Sợi Acrylic dệt kim mịn", "Hàng cúc to bản phong cách retro", "Cổ tim thanh thoát"],
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k5-1", productId: "prod-khoac-5", size: "FreeSize", color: "Kem Be", colorCode: "#fef3c7", stock: 25, sku: "CARD-CRM-FS" }
    ],
    rating: 4.8, reviewCount: 29, soldCount: 185, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-08T00:00:00Z"
  },
  {
    id: "prod-khoac-6",
    name: "Áo Khoác Bomber Dù Trần Bông Trẻ Trung",
    slug: "ao-khoac-bomber-du-tran-bong",
    categoryId: "cat-4",
    brand: "Nguyên Active",
    price: 590000,
    salePrice: 499000,
    description: "Bomber jacket cổ bo gân khỏe khoắn, lớp trần bông mỏng giữ ấm cơ thể trong những buổi tối lộng gió hay đi phượt.",
    details: ["Vải dù chống gió bóng nhẹ", "Bo cổ và gấu dệt gân co giãn", "Khóa kéo kim loại trơn mượt"],
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k6-1", productId: "prod-khoac-6", size: "L", color: "Xanh Rêu", colorCode: "#3f6212", stock: 19, sku: "BOMB-GRN-L" }
    ],
    rating: 4.8, reviewCount: 31, soldCount: 205, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-11T00:00:00Z"
  },
  {
    id: "prod-khoac-7",
    name: "Áo Khoác Gió Thể Thao Nhẹ Gấp Gọn",
    slug: "ao-khoac-gio-the-thao-gap-gon",
    categoryId: "cat-4",
    brand: "Nguyên Active",
    price: 290000,
    description: "Siêu nhẹ chỉ 150g có thể cuộn tròn nhét vừa cốp xe máy, chống nắng cản gió cực tốt cho dân văn phòng và sinh viên.",
    details: ["Trọng lượng siêu nhẹ 150g", "Tặng kèm túi rút đựng áo", "Phản quang ban đêm an toàn"],
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k7-1", productId: "prod-khoac-7", size: "M", color: "Xám Nhạt", colorCode: "#e2e8f0", stock: 30, sku: "PCK-GRY-M" }
    ],
    rating: 4.7, reviewCount: 45, soldCount: 330, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-16T00:00:00Z"
  },
  {
    id: "prod-khoac-8",
    name: "Áo Blazer 2 Hàng Cúc Thanh Lịch Đi Làm",
    slug: "ao-blazer-2-hang-cuc-thanh-lich",
    categoryId: "cat-4",
    brand: "Nguyên Sartorial",
    price: 850000,
    description: "Blazer 6 cúc đôi chuẩn quý ông và quý cô hiện đại, ve áo xếch quyền lực và sang trọng cho các sự kiện quan trọng.",
    details: ["Kiểu may Double-Breasted 6 cúc", "Vải đứng form không bám bụi", "Đường cắt eo tôn dáng"],
    images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k8-1", productId: "prod-khoac-8", size: "L", color: "Xanh Navy", colorCode: "#1e3a8a", stock: 14, sku: "DB-NVY-L" }
    ],
    rating: 5.0, reviewCount: 26, soldCount: 140, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-04T00:00:00Z"
  },
  {
    id: "prod-khoac-9",
    name: "Áo Khoác Nỉ Kéo Khóa Có Mũ Dạo Phố",
    slug: "ao-khoac-ni-keo-khoa-co-mu",
    categoryId: "cat-4",
    brand: "Nguyên Active",
    price: 420000,
    salePrice: 350000,
    description: "Áo khoác nỉ hoodie zip kéo khóa tiện dụng, chất nỉ bông ấm áp êm ái, thích hợp khoác ngoài những buổi sáng se lạnh.",
    details: ["Nỉ chân cua dày dặn 350gsm", "Khóa kéo kim loại chắc chắn", "2 túi kangaroo rộng rãi"],
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k9-1", productId: "prod-khoac-9", size: "M", color: "Xám Tiêu", colorCode: "#9ca3af", stock: 25, sku: "ZIP-GRY-M" },
      { id: "v-k9-2", productId: "prod-khoac-9", size: "L", color: "Đen", colorCode: "#000000", stock: 22, sku: "ZIP-BLK-L" }
    ],
    rating: 4.8, reviewCount: 39, soldCount: 265, isFeatured: false, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-10T00:00:00Z"
  },
  {
    id: "prod-khoac-10",
    name: "Áo Khoác Phao Siêu Nhẹ Giữ Ấm Mùa Lạnh",
    slug: "ao-khoac-phao-sieu-nhe-mua-lanh",
    categoryId: "cat-4",
    brand: "Nguyên Active",
    price: 690000,
    description: "Áo phao trần trám lông vũ nhân tạo cách nhiệt giữ ấm cơ thể tuyệt vời mà không hề nặng nề hay cồng kềnh.",
    details: ["Bông lông vũ sinh học siêu nhẹ", "Lớp ngoài cản gió chống nước", "Bo cổ tay chun giữ nhiệt"],
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-k10-1", productId: "prod-khoac-10", size: "L", color: "Đen", colorCode: "#000000", stock: 18, sku: "PUFF-BLK-L" }
    ],
    rating: 4.9, reviewCount: 41, soldCount: 210, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-17T00:00:00Z"
  },

  // CAT 5: Hoodie & Sweater (10 items)
  {
    id: "prod-hd-1",
    name: "Áo Hoodie Trơn Form Rộng Unisex Nỉ Bông",
    slug: "ao-hoodie-tron-form-rong-unisex",
    categoryId: "cat-5",
    brand: "Nguyên Studio",
    price: 390000,
    salePrice: 329000,
    description: "Áo hoodie nỉ lót bông mềm mại giữ ấm hoàn hảo, form thụng unisex nam nữ đều mặc đẹp, mũ 2 lớp đứng form không rũ.",
    details: ["Nỉ bông dày dặn định lượng 380gsm", "Mũ 2 lớp dày dặn có dây rút", "Túi kangaroo bụng tiện để tay"],
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h1-1", productId: "prod-hd-1", size: "M", color: "Xám Nhạt", colorCode: "#e2e8f0", stock: 30, sku: "HD-GRY-M" },
      { id: "v-h1-2", productId: "prod-hd-1", size: "L", color: "Đen", colorCode: "#000000", stock: 35, sku: "HD-BLK-L" }
    ],
    rating: 4.9, reviewCount: 65, soldCount: 450, isFeatured: true, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-07T00:00:00Z"
  },
  {
    id: "prod-hd-2",
    name: "Áo Sweater Nỉ Cổ Tròn Minimalist",
    slug: "ao-sweater-ni-co-tron-minimalist",
    categoryId: "cat-5",
    brand: "Nguyên Studio",
    price: 350000,
    salePrice: 299000,
    description: "Sweater nỉ trơn cổ tròn phong cách tối giản thanh lịch, dễ dàng phối cùng sơ mi trắng bên trong để đi làm hay đi học.",
    details: ["Nỉ chân cua 100% cotton", "Bo cổ và tay dệt gân bền chắc", "Không xù lông sau khi giặt"],
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h2-1", productId: "prod-hd-2", size: "M", color: "Xanh Rêu", colorCode: "#3f6212", stock: 22, sku: "SWT-GRN-M" },
      { id: "v-h2-2", productId: "prod-hd-2", size: "L", color: "Be Kem", colorCode: "#fef3c7", stock: 26, sku: "SWT-BGE-L" }
    ],
    rating: 4.8, reviewCount: 48, soldCount: 320, isFeatured: true, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-11T00:00:00Z"
  },
  {
    id: "prod-hd-3",
    name: "Áo Hoodie Zip Kéo Khóa Tiện Lợi Đi Đường",
    slug: "ao-hoodie-zip-keo-khoa",
    categoryId: "cat-5",
    brand: "Nguyên Active",
    price: 430000,
    description: "Hoodie zip mở khóa tiện lợi cởi mặc nhanh khi ra đường, mũ trùm sâu che chắn gió bụi hiệu quả.",
    details: ["Khóa kéo YKK 2 chiều mượt mà", "Nỉ da cá co giãn 4 chiều", "Form rộng thoải mái"],
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h3-1", productId: "prod-hd-3", size: "L", color: "Đen", colorCode: "#000000", stock: 25, sku: "ZIP-BLK-L" }
    ],
    rating: 4.8, reviewCount: 30, soldCount: 210, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-09T00:00:00Z"
  },
  {
    id: "prod-hd-4",
    name: "Áo Sweater Len Dệt Thừng Cổ Tròn Cổ Điển",
    slug: "ao-sweater-len-det-thung",
    categoryId: "cat-5",
    brand: "Nguyên Studio",
    price: 490000,
    description: "Họa tiết dệt vặn thừng Cable-knit cổ điển phong cách quý tộc Anh Quốc, giữ ấm tốt và cực kỳ sang trọng.",
    details: ["Len sợi tự nhiên mềm mịn", "Mũi dệt thừng nổi tinh xảo", "Ấm áp không ngứa"],
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h4-1", productId: "prod-hd-4", size: "M", color: "Trắng Kem", colorCode: "#fef9c3", stock: 18, sku: "LEN-CRM-M" }
    ],
    rating: 4.9, reviewCount: 37, soldCount: 195, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-13T00:00:00Z"
  },
  {
    id: "prod-hd-5",
    name: "Áo Hoodie Thêu Chữ Nổi Phong Cách Đường Phố",
    slug: "ao-hoodie-theu-chu-noi",
    categoryId: "cat-5",
    brand: "Nguyên Studio",
    price: 420000,
    salePrice: 360000,
    description: "Điểm nhấn thêu chữ 3D xốp nổi trước ngực tinh tế, thể hiện gu thời trang cá tính và hiện đại.",
    details: ["Kỹ thuật thêu nổi cao cấp", "Vải nỉ bông xốp mềm", "Form boxy thời thượng"],
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h5-1", productId: "prod-hd-5", size: "M", color: "Nâu Cà Phê", colorCode: "#78350f", stock: 20, sku: "HD-COF-M" }
    ],
    rating: 4.8, reviewCount: 25, soldCount: 170, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-15T00:00:00Z"
  },
  {
    id: "prod-hd-6",
    name: "Áo Sweater Len Cổ Lọ Ấm Áp Thu Đông",
    slug: "ao-sweater-len-co-lo-thu-dong",
    categoryId: "cat-5",
    brand: "Nguyên Studio",
    price: 460000,
    description: "Cổ lọ cao ôm trọn vùng cổ giữ ấm tuyệt đối trong những đợt rét, chất len dệt mịn không cọ xát da.",
    details: ["Cổ lọ cao 7cm co giãn", "Sợi len pha cotton thoáng khí", "Form ôm nhẹ thanh lịch"],
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h6-1", productId: "prod-hd-6", size: "M", color: "Đen", colorCode: "#000000", stock: 22, sku: "NECK-BLK-M" }
    ],
    rating: 4.8, reviewCount: 33, soldCount: 220, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-08T00:00:00Z"
  },
  {
    id: "prod-hd-7",
    name: "Áo Hoodie Dáng Lửng Cropped Năng Động",
    slug: "ao-hoodie-dang-lung-cropped",
    categoryId: "cat-5",
    brand: "Nguyên Femme",
    price: 360000,
    salePrice: 299000,
    description: "Dáng lửng ngang rốn khoe eo thon, phối cùng quần jean cạp cao hay quần túi hộp cực kỳ cuốn hút.",
    details: ["Dáng cropped cá tính", "Nỉ cotton mỏng nhẹ 280gsm", "Gấu áo cắt mép tự nhiên"],
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h7-1", productId: "prod-hd-7", size: "S", color: "Hồng Pastel", colorCode: "#fbcfe8", stock: 18, sku: "CRP-PNK-S" }
    ],
    rating: 4.7, reviewCount: 28, soldCount: 190, isFeatured: false, isNewArrival: true, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-16T00:00:00Z"
  },
  {
    id: "prod-hd-8",
    name: "Áo Sweater Cardigan Cúc Gỗ Vintage",
    slug: "ao-sweater-cardigan-cuc-go",
    categoryId: "cat-5",
    brand: "Nguyên Studio",
    price: 440000,
    description: "Hàng cúc gỗ tự nhiên mộc mạc, chất len đan tay mềm mại mang đậm phong cách Mori girl ấm cúng.",
    details: ["Cúc gỗ tự nhiên gia công tỉ mỉ", "Sợi len dệt xốp nhẹ", "Túi ốp tiện lợi 2 bên"],
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h8-1", productId: "prod-hd-8", size: "FreeSize", color: "Nâu Be", colorCode: "#d2b48c", stock: 20, sku: "SW-CARD-FS" }
    ],
    rating: 4.9, reviewCount: 40, soldCount: 245, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-05T00:00:00Z"
  },
  {
    id: "prod-hd-9",
    name: "Áo Hoodie Nỉ Da Cá Phối Nón Thể Thao",
    slug: "ao-hoodie-ni-da-ca-the-thao",
    categoryId: "cat-5",
    brand: "Nguyên Active",
    price: 380000,
    description: "Nón 2 lớp phối màu tương phản khỏe khoắn, chất nỉ da cá co giãn thích hợp cho cả tập gym và đi chơi.",
    details: ["Nỉ da cá chống bai giãn", "Nón phối màu cá tính", "Logo in lụa dẻo bền bỉ"],
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h9-1", productId: "prod-hd-9", size: "L", color: "Xanh Navy", colorCode: "#1e3a8a", stock: 24, sku: "ACT-HD-L" }
    ],
    rating: 4.8, reviewCount: 31, soldCount: 185, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-10T00:00:00Z"
  },
  {
    id: "prod-hd-10",
    name: "Áo Sweater Tay Raglan Phối Màu Trẻ Trung",
    slug: "ao-sweater-tay-raglan-phoi-mau",
    categoryId: "cat-5",
    brand: "Nguyên Studio",
    price: 370000,
    salePrice: 319000,
    description: "Thiết kế tay áo raglan không đường may vai thoải mái cử động, phối 2 tone màu thể thao vintage bắt mắt.",
    details: ["Kiểu may vai Raglan linh hoạt", "Chất nỉ cotton mềm", "Màu sắc phối hài hòa"],
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-h10-1", productId: "prod-hd-10", size: "M", color: "Trắng Phối Đen", colorCode: "#ffffff", stock: 22, sku: "RAG-WHT-M" }
    ],
    rating: 4.8, reviewCount: 22, soldCount: 160, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-17T00:00:00Z"
  },

  // CAT 6: Phụ Kiện Cao Cấp & Hằng Ngày (10 items)
  {
    id: "prod-pk-1",
    name: "Balo Chống Nước Đựng Laptop 15.6 Inch",
    slug: "balo-chong-nuoc-dung-laptop",
    categoryId: "cat-6",
    brand: "Nguyên Carry",
    price: 490000,
    salePrice: 420000,
    description: "Balo đi học đi làm hằng ngày tích hợp ngăn chống sốc laptop 15.6 inch, vải Oxford chống nước bảo vệ tài liệu tối đa.",
    details: ["Vải Oxford 900D chống thấm nước", "Ngăn đệm mút tổ ong bảo vệ laptop", "Quai đeo chữ S trợ lực giảm mỏi vai"],
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p1-1", productId: "prod-pk-1", size: "Tiêu Chuẩn", color: "Đen", colorCode: "#000000", stock: 35, sku: "BP-BLK-STD" },
      { id: "v-p1-2", productId: "prod-pk-1", size: "Tiêu Chuẩn", color: "Xám Than", colorCode: "#374151", stock: 25, sku: "BP-GRY-STD" }
    ],
    rating: 4.9, reviewCount: 55, soldCount: 390, isFeatured: true, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-06T00:00:00Z"
  },
  {
    id: "prod-pk-2",
    name: "Túi Tote Vải Canvas Dạo Phố & Đi Học",
    slug: "tui-tote-vai-canvas",
    categoryId: "cat-6",
    brand: "Nguyên Studio",
    price: 180000,
    salePrice: 149000,
    description: "Túi tote vải bố canvas dày dặn có khóa kéo miệng và ngăn nhỏ đựng điện thoại, dung tích chứa sách vở và máy tính bảng thoải mái.",
    details: ["Vải Canvas 12oz bền chắc", "Có khóa kéo miệng an toàn", "Dây quai may chéo x2 chịu lực"],
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p2-1", productId: "prod-pk-2", size: "FreeSize", color: "Trắng Ngà", colorCode: "#fef08a", stock: 45, sku: "TOTE-WHT-FS" },
      { id: "v-p2-2", productId: "prod-pk-2", size: "FreeSize", color: "Đen", colorCode: "#000000", stock: 40, sku: "TOTE-BLK-FS" }
    ],
    rating: 4.8, reviewCount: 80, soldCount: 650, isFeatured: true, isNewArrival: true, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-14T00:00:00Z"
  },
  {
    id: "prod-pk-3",
    name: "Nón Lưỡi Trai Cotton Basic Thêu Chữ",
    slug: "non-luoi-trai-cotton-basic",
    categoryId: "cat-6",
    brand: "Nguyên Studio",
    price: 160000,
    salePrice: 129000,
    description: "Mũ kết lưỡi trai che nắng hằng ngày, chất cotton thấm hút tốt, khóa kim loại phía sau dễ dàng tăng giảm độ ôm.",
    details: ["100% Cotton chải", "Vành lưỡi trai uốn cong chắn nắng", "Khóa kim loại dập chìm chống gỉ"],
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p3-1", productId: "prod-pk-3", size: "FreeSize", color: "Đen", colorCode: "#000000", stock: 50, sku: "CAP-BLK-FS" },
      { id: "v-p3-2", productId: "prod-pk-3", size: "FreeSize", color: "Be", colorCode: "#d2b48c", stock: 40, sku: "CAP-BGE-FS" }
    ],
    rating: 4.8, reviewCount: 62, soldCount: 520, isFeatured: false, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-08T00:00:00Z"
  },
  {
    id: "prod-pk-4",
    name: "Nón Bucket Vành Tròn Thời Trang Unisex",
    slug: "non-bucket-vanh-tron-thoi-trang",
    categoryId: "cat-6",
    brand: "Nguyên Studio",
    price: 190000,
    description: "Nón bucket vành tròn che nắng trọn vẹn, phong cách streetwear thời thượng cho những chuyến du lịch biển hay leo núi.",
    details: ["Vải Kaki 2 lớp mát nhẹ", "Lỗ thông hơi thêu tay", "Dễ gấp gọn bỏ balo"],
    images: ["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p4-1", productId: "prod-pk-4", size: "FreeSize", color: "Đen", colorCode: "#000000", stock: 30, sku: "BCK-BLK-FS" }
    ],
    rating: 4.7, reviewCount: 33, soldCount: 230, isFeatured: false, isNewArrival: true, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-12T00:00:00Z"
  },
  {
    id: "prod-pk-5",
    name: "Thắt Lưng Da Bò Khóa Tự Động Sang Trọng",
    slug: "that-lung-da-bo-khoa-tu-dong",
    categoryId: "cat-6",
    brand: "Nguyên Leather",
    price: 390000,
    salePrice: 320000,
    description: "Thắt lưng da bò nguyên tấm mặt khóa trượt tự động mạ Crom sáng bóng, chuẩn phụ kiện quý ông lịch lãm diện cùng quần âu.",
    details: ["100% Da bò thật dập vân tinh tế", "Đầu khóa hợp kim không gỉ", "Hệ thống răng trượt khóa tiện lợi"],
    images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p5-1", productId: "prod-pk-5", size: "120cm", color: "Đen", colorCode: "#000000", stock: 28, sku: "BLT-BLK-120" }
    ],
    rating: 4.9, reviewCount: 46, soldCount: 310, isFeatured: true, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-05T00:00:00Z"
  },
  {
    id: "prod-pk-6",
    name: "Ví Da Nam Mini Cầm Tay Nhiều Ngăn Thẻ",
    slug: "vi-da-nam-mini-cam-tay",
    categoryId: "cat-6",
    brand: "Nguyên Leather",
    price: 320000,
    description: "Ví da phom đứng nhỏ gọn bỏ vừa túi quần không bị cộm, thiết kế 8 ngăn chứa thẻ ATM và ngăn kẹp tiền thông minh.",
    details: ["Da tổng hợp Microfiber chống trầy xước", "Thiết kế nhỏ gọn 11x8.5cm", "Đường chỉ may thủ công đều đặn"],
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p6-1", productId: "prod-pk-6", size: "Tiêu Chuẩn", color: "Nâu Đậm", colorCode: "#451a03", stock: 22, sku: "WLT-BRN-STD" }
    ],
    rating: 4.8, reviewCount: 35, soldCount: 240, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-09T00:00:00Z"
  },
  {
    id: "prod-pk-7",
    name: "Kính Mát Chống Tia UV400 Tròng Phân Cực",
    slug: "kinh-mat-chong-tia-uv400",
    categoryId: "cat-6",
    brand: "Nguyên Eyewear",
    price: 280000,
    salePrice: 229000,
    description: "Kính mát phân cực Polarized chống lóa mắt khi lái xe dưới trời nắng gắt, bảo vệ mắt 100% trước tia UV gây hại.",
    details: ["Tròng phân cực Polarized chống chói lóa", "Chuẩn chống UV400", "Gọng kim loại siêu nhẹ bọc đệm êm tai"],
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p7-1", productId: "prod-pk-7", size: "FreeSize", color: "Gọng Đen", colorCode: "#000000", stock: 30, sku: "GLS-BLK-FS" }
    ],
    rating: 4.8, reviewCount: 41, soldCount: 295, isFeatured: false, isNewArrival: true, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-15T00:00:00Z"
  },
  {
    id: "prod-pk-8",
    name: "Khăn Choàng Cổ Len Mềm Giữ Ấm Mùa Đông",
    slug: "khan-choang-co-len-mem",
    categoryId: "cat-6",
    brand: "Nguyên Studio",
    price: 240000,
    description: "Khăn quàng cổ len dệt mềm mịn như cashmere, bản dài quấn ấm cúng tạo điểm nhấn thời trang cho trang phục thu đông.",
    details: ["Sợi Acrylic giả cashmere êm ái", "Kích thước 200 x 60 cm", "Tua rua thủ công đuôi khăn"],
    images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p8-1", productId: "prod-pk-8", size: "FreeSize", color: "Xám Tiêu", colorCode: "#9ca3af", stock: 25, sku: "SCRF-GRY-FS" }
    ],
    rating: 4.8, reviewCount: 28, soldCount: 180, isFeatured: false, isNewArrival: false, isFlashSale: false, status: "ACTIVE", createdAt: "2025-01-04T00:00:00Z"
  },
  {
    id: "prod-pk-9",
    name: "Set 5 Đôi Vớ Cổ Cao Cotton Kháng Khuẩn",
    slug: "set-5-doi-vo-co-cao-cotton",
    categoryId: "cat-6",
    brand: "Nguyên Studio",
    price: 150000,
    salePrice: 119000,
    description: "Hộp 5 đôi tất cổ cao dệt sợi cotton ion bạc kháng khuẩn khử mùi hôi chân, độ dày êm chân mang cả ngày đi giày sneaker.",
    details: ["90% Cotton kháng khuẩn công nghệ Ion Bạc", "Cổ dệt gân ôm sát không tụt vớ", "Gia cố dày dặn ở gót và mũi chân"],
    images: ["https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p9-1", productId: "prod-pk-9", size: "38-44", color: "Mix 3 Màu (Đen/Trắng/Xám)", colorCode: "#64748b", stock: 60, sku: "SCK-MIX-5P" }
    ],
    rating: 4.9, reviewCount: 95, soldCount: 820, isFeatured: false, isNewArrival: false, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-10T00:00:00Z"
  },
  {
    id: "prod-pk-10",
    name: "Dép Quai Ngang EVA Đúc Liền Êm Chân",
    slug: "dep-quai-ngang-eva-duc-lien",
    categoryId: "cat-6",
    brand: "Nguyên Active",
    price: 190000,
    salePrice: 159000,
    description: "Dép đúc nguyên khối chất liệu bọt khí EVA siêu êm nhẹ như bước trên mây, chống trơn trượt tối đa khi đi mưa hoặc trong nhà tắm.",
    details: ["Nhựa bọt khí EVA đúc nguyên khối", "Đế bánh mì dày 4cm êm ái", "Đế rãnh chống trượt an toàn"],
    images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80"],
    variants: [
      { id: "v-p10-1", productId: "prod-pk-10", size: "40-41", color: "Đen", colorCode: "#000000", stock: 40, sku: "SLP-BLK-40" },
      { id: "v-p10-2", productId: "prod-pk-10", size: "42-43", color: "Trắng Sữa", colorCode: "#ffffff", stock: 35, sku: "SLP-WHT-42" }
    ],
    rating: 4.9, reviewCount: 78, soldCount: 610, isFeatured: false, isNewArrival: true, isFlashSale: true, status: "ACTIVE", createdAt: "2025-01-16T00:00:00Z"
  }
];

// Update categories itemCount
const categories = currentStore.categories.map(cat => {
  const count = products.filter(p => p.categoryId === cat.id && p.status === 'ACTIVE').length;
  return {
    ...cat,
    itemCount: count
  };
});

currentStore.products = products;
currentStore.categories = categories;

fs.writeFileSync(storePath, JSON.stringify(currentStore, null, 2), 'utf8');
console.log(`Successfully generated ${products.length} products across ${categories.length} categories!`);
categories.forEach(c => console.log(`- ${c.name}: ${c.itemCount} sản phẩm`));
