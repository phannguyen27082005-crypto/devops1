const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'data', 'store.json');
const storeData = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const vietnameseUsers = [
  { name: 'Nguyễn Thùy Linh', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
  { name: 'Trần Hoàng Nam', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
  { name: 'Lê Phương Anh', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
  { name: 'Phạm Minh Tuấn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
  { name: 'Vũ Hải Đăng', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80' },
  { name: 'Đặng Mai Lan', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80' },
  { name: 'Hoàng Quốc Bảo', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80' },
  { name: 'Bùi Khánh Huyền', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' },
  { name: 'Đỗ Đức Thắng', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' },
  { name: 'Ngô Thu Hương', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80' },
  { name: 'Dương Gia Huy', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80' },
  { name: 'Võ Quỳnh Chi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
  { name: 'Phan Nhật Ánh', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=120&auto=format&fit=crop&q=80' },
  { name: 'Trịnh Hữu Phát', avatar: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=120&auto=format&fit=crop&q=80' },
  { name: 'Lâm Thanh Trúc', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&auto=format&fit=crop&q=80' }
];

const categoryTemplates = {
  'cat-1': { // Áo
    fiveStars: [
      "Áo đẹp xuất sắc ngoài mong đợi! Vải cotton 100% dày dặn mà mặc rất mát, không bị xù lông hay co rút khi giặt máy. Mình cao 1m72 nặng 64kg mặc size L vừa vặn như may đo.",
      "Đóng gói hộp cứng rất sang xịn mịn, mở hộp ra áo thơm phức. Cổ áo may bo dệt kép chắc chắn không bị bai dão. Sẽ mua thêm màu khác ủng hộ shop!",
      "Chất vải mềm mịn sờ mướt tay lắm mn ơi. Form áo suông hiện đại mặc tôn dáng cực kỳ. Giao hàng Hỏa tốc 1 ngày là tới tay.",
      "Màu sắc bên ngoài y hệt ảnh mẫu chụp, đường may tỉ mỉ không có 1 cọng chỉ thừa. 10 điểm cho chất lượng và độ uy tín của shop Nguyên Fashion!",
      "Áo mặc đi làm hay đi cà phê cuối tuần đều rất lịch sự và thoải mái. Thấm hút mồ hôi tốt. Mua đợt sale giá quá hời luôn ạ.",
      "Chất lượng đỉnh thật sự! Mình mua tặng người yêu mà ưng ý lắm, form áo tôn vai và ngực rất chuẩn. Shop tư vấn size cực kỳ nhiệt tình.",
      "Đã mua lần thứ 3 tại shop rồi và chưa lần nào thất vọng. Vải xịn, form dáng chuẩn mẫu, giặt không phai màu.",
      "Vải mềm, mát và thấm hút mồ hôi tốt. Đường may thẳng tắp, đóng gói cẩn thận có tem mác chính hãng đàng hoàng."
    ],
    fourStars: [
      "Áo form đẹp vải dày dặn mát mẻ, chỉ có điều shipper giao hàng hơi trễ 1 ngày do mưa bão. Còn lại sản phẩm hoàn hảo 9.5/10.",
      "Chất lượng áo rất tốt, vải đanh mịn. Màu sắc thực tế hơi đậm hơn ảnh trên web một tí tẹo nhưng mặc lên vẫn rất sang."
    ],
    quality: "Cotton cao cấp dày dặn, thấm hút mồ hôi tốt",
    fit: "Chuẩn size theo bảng size shop cung cấp"
  },
  'cat-2': { // Quần
    fiveStars: [
      "Quần lên dáng chuẩn đét luôn! Form suông hack chân siêu dài, vải mềm co giãn nhẹ mặc cả ngày ngồi văn phòng không bị cấn bụng hay khó chịu.",
      "Quần jeans màu wash cực kỳ vintage và thời thượng. Chất denim dày dặn vừa phải, khoá kéo kim loại YKK mượt mà. Rất đáng đồng tiền bát gạo!",
      "Mình 1m68 mặc size 31 vừa khít chiều dài luôn, phối với giày sneaker hay sơ mi đều đẹp trai. Shop đóng gói chuyên nghiệp và kỹ lưỡng.",
      "Form quần đứng dáng che khuyết điểm chân cong cực tốt. Vải không bị nhăn sau khi giặt. Ưng ý nhất từ trước đến nay trên sàn!",
      "Chất vải dày, độ co giãn thoải mái, đường kim mũi chỉ chắc chắn. Đã test giặt máy không ra màu. Tuyệt vời!",
      "Tôn dáng và rất thoải mái khi vận động. Cạp quần ôm vừa vặn, túi sâu đựng vừa điện thoại to không bị rơi. Cho shop 5 sao!",
      "Vải sờ rất thích tay, màu nhã nhặn dễ phối đồ. Shop hỗ trợ tư vấn size rất chuẩn xác."
    ],
    fourStars: [
      "Quần form đẹp tôn dáng, vải chất lượng tốt. Ống hơi dài hơn mình nghĩ khoảng 1cm nhưng đem ra tiệm xắn lên là chuẩn đẹp.",
      "Đóng gói cẩn thận, quần mặc êm và thoáng. Giao hàng đúng hẹn, chỉ góp ý shop thêm nhiều màu lạ hơn nữa."
    ],
    quality: "Denim/Kaki cao cấp co giãn êm ái, bền màu",
    fit: "Form suông che khuyết điểm, cạp vừa vặn"
  },
  'cat-3': { // Váy đầm
    fiveStars: [
      "Váy xinh xỉu các nàng ơi! Chất vải rủ nhẹ nhàng tôn eo tôn dáng cực kỳ. Mặc đi tiệc ai cũng khen tấm tắc hỏi mua ở đâu.",
      "Đầm may 2 lớp lót lụa mềm mát kín đáo mà không bị nóng. Đường may viền tỉ mỉ, form dáng chuẩn chỉnh như may đo tại tiệm.",
      "Thiết kế thanh lịch, màu sắc nhã nhặn sang trọng. Mình mặc vừa in size M. Đóng gói hộp hoa nơ chỉn chu rất thích.",
      "Chất vải xịn sò, không nhăn nhúm, lên hình sống ảo lung linh luôn ạ. Shop giao hàng cực nhanh, tư vấn dễ thương.",
      "Mẫu váy thiết kế độc quyền của Nguyên Fashion nhìn ngoài sang hơn hình chụp gấp nhiều lần. Sẽ là khách ruột của shop!",
      "Váy bồng bềnh nữ tính, che bụng dưới cực tốt. Vải mềm mại chạm vào da rất dễ chịu. Rất recommend mn mua nhé!"
    ],
    fourStars: [
      "Váy đẹp, vải mềm mượt, lên dáng duyên dáng. Size S phần eo hơi rộng 1 tí nhưng thắt nơ lại là vừa vặn xinh xắn."
    ],
    quality: "Vải voan/tơ/lụa cao cấp 2 lớp mềm mát",
    fit: "Tôn dáng eo thon, bồng bềnh nhẹ nhàng"
  },
  'cat-4': { // Áo khoác & Blazer
    fiveStars: [
      "Blazer lên form đỉnh của chóp! Đệm vai vừa phải giúp vai thẳng tắp tôn thần thái, ve áo sắc sảo. Lớp lót lụa cao cấp mặc mát và sang trọng.",
      "Áo khoác gió cản gió và chống nước nhẹ cực tốt. Khóa kéo trơn tru, form oversize vừa trẻ trung vừa cá tính. 5 sao không cần bàn cãi!",
      "Độ hoàn thiện cực kỳ cao, từ cúc áo đến đường may viền đều chuẩn hàng may đo cao cấp. Mặc đi làm hay đi sự kiện đều rất nổi bật.",
      "Chất vải dày dặn đứng dáng, không dễ bị nhăn nhàu khi ngồi xe hay treo tủ. Shop gói hàng bằng hộp cứng to không làm gãy ve áo.",
      "Màu sắc trầm ấm, phối đồ siêu dễ. Chồng mình khen áo rất đẹp và lịch lãm. Đáng tiền từng hào!"
    ],
    fourStars: [
      "Áo khoác rất dày dặn ấm áp, form rộng rãi dễ chịu. Giao hàng chuẩn bị hơi lâu 1 chút nhưng nhận hàng xong thấy xứng đáng chờ đợi."
    ],
    quality: "Vải tuyết mưa/dạ ép cao cấp, lớp lót lụa mềm mượt",
    fit: "Form đứng dáng chuẩn tailored, tôn vai thẳng"
  },
  'cat-5': { // Hoodie & Sweater
    fiveStars: [
      "Hoodie chân cua dày dặn mũ 2 lớp to đứng form trùm đầu cực ấm! Hình in thêu sắc nét giặt không bong tróc.",
      "Sweater nỉ bông mềm êm như kẹo bông, bo chun cổ tay và gấu áo co giãn đàn hồi tốt không bị dão. Mặc mùa này quá hợp lý!",
      "Form oversize chuẩn streetwear Hàn Quốc, phối với quần ống suông siêu ngầu. Shop đóng gói thơm nức mũi.",
      "Áo ấm áp, chất vải mịn không đổ lông bám dính vào áo trong. Mua liền 2 cái cho cả mình và người yêu mặc áo đôi.",
      "Màu sắc trẻ trung năng động, chất lượng vải vượt xa tầm giá. Cho shop 10 điểm uy tín!"
    ],
    fourStars: [
      "Áo ấm áp form đẹp, nỉ mềm mịn. Lần đầu giặt có dính ít xơ vải bên trong lộn ra giũ là hết. Mặc lên rất xinh."
    ],
    quality: "Nỉ chân cua/nỉ bông định lượng cao dày dặn",
    fit: "Form rộng oversize thoải mái trẻ trung"
  },
  'cat-6': { // Phụ kiện
    fiveStars: [
      "Phụ kiện hoàn thiện tỉ mỉ sắc nét, chất da mềm mượt không mùi hôi. Khóa kim loại sáng bóng không gỉ.",
      "Đóng gói hộp đựng quà cao cấp có túi hút ẩm và card cảm ơn. Dùng làm quà tặng người thân bạn bè cực kỳ lịch sự.",
      "Mẫu mã thời trang hiện đại, dễ kết hợp với nhiều outfit khác nhau. Rất hài lòng về chất lượng sản phẩm!",
      "Chất lượng vượt trội so với giá tiền. Cảm ơn shop Nguyên Fashion đã mang đến sản phẩm tuyệt vời."
    ],
    fourStars: [
      "Sản phẩm đẹp y như ảnh chụp, đường may chắc chắn. Giao hàng nhanh và đóng gói an toàn."
    ],
    quality: "Vật liệu cao cấp, đường may tỉ mỉ, phụ kiện kim loại sáng bóng",
    fit: "Kích thước tiêu chuẩn, tiện lợi sử dụng"
  }
};

const sellerReplies = [
  "Dạ Nguyên Fashion xin chân thành cảm ơn bạn đã tin tưởng và ủng hộ sản phẩm của shop ạ! Sự hài lòng của bạn là niềm vinh hạnh lớn nhất của toàn thể đội ngũ shop. Chúc bạn luôn mặc đẹp và tự tin cùng Nguyên Fashion nhé! Nếu cần hỗ trợ bất kỳ điều gì bạn cứ nhắn tin ngay cho shop ạ. ❤️",
  "Cảm ơn bạn yêu đã dành thời gian đánh giá 5 sao cho shop! Đọc phản hồi của bạn mà shop có thêm thật nhiều năng lượng để tiếp tục ra mắt những mẫu thiết kế chất lượng nhất. Chúc bạn một ngày ngập tràn niềm vui và may mắn nha! ✨",
  "Dạ Nguyên Fashion rất vui khi nhận được lời khen và sự hài lòng tuyệt đối từ bạn ạ! Shop luôn chú trọng từ chất vải, form dáng đến từng đường may để mang lại trải nghiệm ưng ý nhất. Rất mong được tiếp tục đồng hành cùng bạn trong những đơn hàng tiếp theo ạ! 🥰",
  "Shop chân thành cảm ơn quý khách đã tin chọn Nguyên Fashion! Đừng quên ghé gian hàng bấm Theo Dõi để săn thêm nhiều voucher độc quyền và cập nhật mẫu mới nhất nhé ạ. Chúc quý khách luôn xinh đẹp và thành công! 🌟"
];

const allNewReviews = [];

// Seed for all 60 products
storeData.products.forEach((product) => {
  const catKey = product.categoryId || 'cat-1';
  const tmpl = categoryTemplates[catKey] || categoryTemplates['cat-1'];
  
  // Decide review count for this product: between 6 and 11 reviews
  const numReviews = 6 + (Math.abs(product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 6);
  
  const productVariants = product.variants && product.variants.length > 0 ? product.variants : [];
  
  let prodSumRating = 0;
  
  for (let i = 0; i < numReviews; i++) {
    const isFiveStar = i < numReviews - 1; // 85-90% are 5 stars, 1 is 4 star
    const rating = isFiveStar ? 5 : 4;
    prodSumRating += rating;
    
    const userIndex = (i + product.id.length * 3) % vietnameseUsers.length;
    const user = vietnameseUsers[userIndex];
    
    // Pick variant
    let variantInfo = 'Màu Tiêu Chuẩn, Size Tiêu Chuẩn';
    if (productVariants.length > 0) {
      const v = productVariants[i % productVariants.length];
      variantInfo = `Phân loại hàng: ${v.color}, Size ${v.size}`;
    }
    
    // Pick comment
    const commentPool = rating === 5 ? tmpl.fiveStars : tmpl.fourStars;
    const commentText = commentPool[i % commentPool.length];
    
    // Review images (about 50% reviews have 1-2 customer photos)
    const reviewImages = [];
    if (i % 2 === 0 && product.images && product.images.length > 0) {
      reviewImages.push(product.images[i % product.images.length]);
      if (product.images.length > 1 && i % 4 === 0) {
        reviewImages.push(product.images[(i + 1) % product.images.length]);
      }
    }
    
    // Date between Jan 2026 and Oct 2026
    const day = 1 + ((i * 3 + 7) % 27);
    const month = 1 + ((i + 2) % 9);
    const hour = 8 + ((i * 4) % 14);
    const minute = 10 + ((i * 7) % 49);
    const dateStr = `2026-0${month}-${day < 10 ? '0' + day : day}T${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:00.000Z`;
    const replyDateStr = `2026-0${month}-${day < 10 ? '0' + day : day}T${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:${minute < 10 ? '0' + minute : minute}:00.000Z`;

    const reviewObj = {
      id: `rev-${product.id}-${i + 1}`,
      productId: product.id,
      productName: product.name,
      userId: `usr-rev-${userIndex + 1}`,
      userName: user.name,
      userAvatar: user.avatar,
      rating: rating,
      comment: commentText,
      variantInfo: variantInfo,
      fitFeedback: tmpl.fit,
      qualityFeedback: tmpl.quality,
      matchDescription: 'Đúng với mô tả 100%',
      images: reviewImages,
      sellerReply: sellerReplies[i % sellerReplies.length],
      sellerReplyDate: replyDateStr,
      helpfulCount: 3 + ((i * 5 + 3) % 25),
      status: 'APPROVED',
      createdAt: dateStr
    };
    
    allNewReviews.push(reviewObj);
  }
  
  // Update product's rating and review counts
  const avgRating = parseFloat((prodSumRating / numReviews).toFixed(1));
  product.rating = avgRating;
  product.reviewCount = numReviews;
  product.soldCount = Math.max(product.soldCount || 40, numReviews * 18 + 52);
});

// Update storeData
storeData.reviews = allNewReviews;

fs.writeFileSync(storePath, JSON.stringify(storeData, null, 2), 'utf8');
console.log(`Successfully seeded ${allNewReviews.length} reviews for ${storeData.products.length} products!`);
