const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'data', 'store.json');
const storeData = JSON.parse(fs.readFileSync(storePath, 'utf8'));

// High-resolution Unsplash fashion photos curated by category and color
const colorImageCatalog = {
  // QUẦN (Jeans / Trousers / Kaki / Shorts)
  quan: {
    'Xanh Indigo': 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&auto=format&fit=crop&q=80',
    'Xanh Đậm': 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&auto=format&fit=crop&q=80',
    'Xanh Đen': 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&auto=format&fit=crop&q=80',
    'Xanh Nhạt Vintage': 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
    'Xanh Nhạt': 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
    'Xanh Khói': 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&auto=format&fit=crop&q=80',
    'Xanh Nhạt Hàn Quốc': 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
    'Đen Tuyền': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Đen': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Đen Wash': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Đen Khói': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Be Khaki': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    'Be Sữa': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    'Be Kem': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    'Trắng': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    'Trắng Kem': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    'Xám': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    'Xám Than': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    'Ghi Sáng': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    'Nâu Đất': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
    'Nâu Tây': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
    'Xanh Rêu': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80'
  },

  // ÁO (T-shirt / Polo / Shirt)
  ao: {
    'Trắng': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    'Trắng Kem': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
    'Trắng Gạo': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
    'Trắng Tinh Khôi': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    'Đen': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    'Đen Tuyền': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    'Đen Phối Trắng': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    'Trắng Phối Đỏ': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
    'Xám Tiêu': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    'Xám': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    'Xám Ghi': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    'Xanh Navy': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    'Xanh Đen': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    'Xanh Rêu': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    'Nâu Rêu': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    'Xanh Nhạt': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
    'Sọc Xanh': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
    'Sọc Đen': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    'Sọc Nâu': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
    'Hồng Nhạt': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    'Hồng Phấn': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    'Đỏ Đô': 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&auto=format&fit=crop&q=80',
    'Xanh Cổ Vịt': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
    'Be Sữa': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80'
  },

  // VÁY & ĐẦM
  vay: {
    'Trắng Sữa': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    'Trắng': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    'Trắng Tinh Khôi': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    'Đen': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
    'Đen Quyến Rũ': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
    'Vàng Mustard': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    'Vàng Champagne': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    'Hoa Vàng': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    'Cam Đất': 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&auto=format&fit=crop&q=80',
    'Đỏ Rượu': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    'Hoa Hồng': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    'Hoa Xanh': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop&q=80',
    'Xanh Pastel': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop&q=80',
    'Xanh Emerald': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop&q=80',
    'Be Nude': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    'Hồng Nude': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    'Hồng Phấn': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    'Nâu Tây': 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&auto=format&fit=crop&q=80',
    'Nâu Nhạt': 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&auto=format&fit=crop&q=80'
  },

  // ÁO KHOÁC & BLAZER
  khoac: {
    'Đen': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    'Đen Tuyền': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    'Be Nude': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Be Khaki': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Kem Be': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Be Kem': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Nâu Tây': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    'Nâu Cafe': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    'Nâu Sang Trọng': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    'Nâu Cà Phê': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    'Xám': 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
    'Xám Bạc': 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
    'Xám Khói': 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
    'Xám Nhạt': 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
    'Xám Tro': 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
    'Xám Đậm': 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
    'Xanh Navy': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    'Xanh Rêu': 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    'Xanh Mint': 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    'Xanh Vintage': 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    'Xanh Dương': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    'Vàng Đất': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80'
  },

  // HOODIE & SWEATER
  hd: {
    'Đen': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    'Đen Basic': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    'Trắng': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
    'Kem Sữa': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
    'Trắng Phối Đen': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
    'Xám': 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
    'Xám Tiêu': 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
    'Xám Phối Xanh': 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
    'Hồng Pastel': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    'Hồng Phấn': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    'Nâu Be': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Kem Phối Nâu': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    'Xanh Navy': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'
  },

  // PHỤ KIỆN
  pk: {
    'Đen': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'Gọng Đen': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    'Gọng Đồi Mồi': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    'Gọng Bạc': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    'Nâu Bò': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    'Nâu Đậm': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    'Nâu Sáng': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    'Trắng': 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop&q=80',
    'Trắng Ngà': 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop&q=80',
    'Be': 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop&q=80',
    'Mix 3 Màu (Đen/Trắng/Xám)': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'Set Full Đen': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'Set Full Trắng': 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop&q=80'
  }
};

function getCategoryGroup(productId) {
  if (productId.startsWith('prod-quan')) return 'quan';
  if (productId.startsWith('prod-ao')) return 'ao';
  if (productId.startsWith('prod-vay')) return 'vay';
  if (productId.startsWith('prod-khoac')) return 'khoac';
  if (productId.startsWith('prod-hd')) return 'hd';
  if (productId.startsWith('prod-pk')) return 'pk';
  return 'ao';
}

let updatedCount = 0;

storeData.products.forEach(product => {
  const groupKey = getCategoryGroup(product.id);
  const catalog = colorImageCatalog[groupKey] || colorImageCatalog.ao;
  
  const colorImagesMap = {};
  const newProductImageList = [];
  
  product.variants.forEach((v, index) => {
    const color = v.color || 'Màu Tiêu Chuẩn';
    
    // Check if we have a catalog image for this color
    let img = catalog[color];
    if (!img) {
      // Fuzzy match or fallback to color-based heuristics
      const lower = color.toLowerCase();
      if (lower.includes('đen')) img = catalog['Đen'] || catalog['Đen Tuyền'];
      else if (lower.includes('trắng')) img = catalog['Trắng'] || catalog['Trắng Kem'];
      else if (lower.includes('xanh nhạt') || lower.includes('vintage')) img = catalog['Xanh Nhạt Vintage'] || catalog['Xanh Nhạt'];
      else if (lower.includes('xanh')) img = catalog['Xanh Indigo'] || catalog['Xanh Navy'];
      else if (lower.includes('xám') || lower.includes('ghi')) img = catalog['Xám'] || catalog['Xám Tiêu'];
      else if (lower.includes('be') || lower.includes('khaki') || lower.includes('kem')) img = catalog['Be Khaki'] || catalog['Be Sữa'];
      else if (lower.includes('nâu')) img = catalog['Nâu Đất'] || catalog['Nâu Tây'];
      else if (lower.includes('vàng')) img = catalog['Vàng Mustard'] || catalog['Vàng Champagne'];
      else if (lower.includes('cam')) img = catalog['Cam Đất'];
      else if (lower.includes('hồng')) img = catalog['Hồng Pastel'] || catalog['Hồng Nhạt'];
      else if (lower.includes('đỏ')) img = catalog['Đỏ Đô'] || catalog['Đỏ Rượu'];
    }

    if (!img) {
      img = (product.images && product.images[index % product.images.length]) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
    }

    v.image = img;
    
    if (!colorImagesMap[color]) {
      colorImagesMap[color] = [img];
    } else if (!colorImagesMap[color].includes(img)) {
      colorImagesMap[color].push(img);
    }
    
    if (!newProductImageList.includes(img)) {
      newProductImageList.push(img);
    }
  });

  product.colorImages = colorImagesMap;
  
  // Keep original product images as secondary or ensure color images come first
  const existingExtra = (product.images || []).filter(img => !newProductImageList.includes(img));
  product.images = [...newProductImageList, ...existingExtra];
  
  updatedCount++;
});

fs.writeFileSync(storePath, JSON.stringify(storeData, null, 2), 'utf8');
console.log(`Successfully mapped color-specific images for ${updatedCount} products!`);
