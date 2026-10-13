import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag,
  Star,
  Check,
  X,
  Calendar,
  Sparkles,
  Tag,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';
import { api } from '../../services/api';
import { Product, Category, CartItem } from '../../types';
import { useCart } from '../../context/CartContext';

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || searchParams.get('category') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  );
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [isSaleOnly, setIsSaleOnly] = useState(searchParams.get('sale') === 'true');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { addToCart } = useCart();

  // Synchronize state when URL query parameters change (e.g. clicking 'Khuyến Mãi HOT')
  useEffect(() => {
    const saleParam = searchParams.get('sale') === 'true';
    setIsSaleOnly(saleParam);
    if (searchParams.get('search') !== null) {
      setSearch(searchParams.get('search') || '');
    }
    if (searchParams.get('category') !== null) {
      setSelectedCategory(searchParams.get('category') || '');
    }
  }, [searchParams]);

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, [categorySlug]);

  const updateSaleOnly = (val: boolean) => {
    setIsSaleOnly(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('sale', 'true');
    } else {
      newParams.delete('sale');
    }
    setSearchParams(newParams);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.products.getAll({
          categorySlug: selectedCategory || undefined,
          search: search || undefined,
          sort: selectedSort,
          minPrice,
          maxPrice,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          sale: isSaleOnly ? 'true' : undefined,
          limit: 36,
        }),
        api.categories.getAll(),
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data.products);
        setTotal(prodRes.data.total);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSort, minPrice, maxPrice, selectedSize, selectedColor, isSaleOnly, search]);

  const handleQuickAdd = (p: Product) => {
    if (p.variants.length > 0) {
      const variant = p.variants.find(v => v.stock > 0) || p.variants[0];
      addToCart(p, variant, 1);
    }
  };

  const handleQuickBuy = (p: Product, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (p.variants.length > 0) {
      const variant = p.variants.find(v => v.stock > 0) || p.variants[0];
      const buyItem: CartItem = {
        id: `${p.id}_${variant.id}`,
        productId: p.id,
        variantId: variant.id,
        productName: p.name,
        slug: p.slug,
        size: variant.size,
        color: variant.color,
        colorCode: variant.colorCode,
        price: variant.price || p.salePrice || p.price,
        originalPrice: p.price,
        quantity: 1,
        image: p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        maxStock: variant.stock,
        sku: variant.sku,
      };
      addToCart(p, variant, 1);
      navigate('/checkout', { state: { selectedItems: [buyItem] } });
    }
  };

  const currentCategoryObj = categories.find(c => c.slug === selectedCategory || c.id === selectedCategory);

  const availableSizes = ['S', 'M', 'L', 'XL', '2XL', 'FreeSize'];
  const availableColors = [
    { name: 'Đen', hex: '#000000' },
    { name: 'Trắng', hex: '#FFFFFF' },
    { name: 'Xám', hex: '#6B7280' },
    { name: 'Xanh Navy', hex: '#1E3A8A' },
    { name: 'Be', hex: '#D2B48C' },
    { name: 'Nâu', hex: '#78350F' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Promotion Event Banner if Sale Mode is Active */}
      {isSaleOnly && (
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-rose-950 via-zinc-950 to-zinc-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-rose-900/50">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              SỰ KIỆN ƯU ĐÃI ĐẶC BIỆT
            </div>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
              Khuyến Mãi HOT - Giảm Đến 40%
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
              Cơ hội sở hữu những thiết kế thời trang may đo và streetwear cao cấp với mức giá ưu đãi nhất mùa này.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 w-fit">
              <div className="flex items-center gap-2 text-rose-300 font-semibold">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>Thời gian giảm giá: <strong>10/10/2026</strong> đến hết <strong>31/10/2026</strong></span>
              </div>
              <div className="hidden sm:block text-zinc-600">•</div>
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Nhập mã <strong>MAISON10</strong> giảm thêm 10% đơn từ 600K</span>
              </div>
            </div>

            {/* Quick Category Switch for Discounted Items */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium">Khám phá giảm giá sản phẩm khác:</span>
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  !selectedCategory
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-white/10 text-zinc-200 hover:bg-white/20'
                }`}
              >
                Tất cả ({total})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-rose-600 text-white shadow'
                      : 'bg-white/10 text-zinc-200 hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Title & Description */}
      <div className="mb-8">
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-zinc-950 flex items-center gap-3">
          {isSaleOnly ? (
            <>
              <span>Sản Phẩm Khuyến Mãi HOT</span>
              <span className="text-xs font-sans font-bold px-3 py-1 rounded-full bg-rose-600 text-white">
                ƯU ĐÃI THÁNG 10
              </span>
            </>
          ) : currentCategoryObj ? (
            currentCategoryObj.name
          ) : (
            'Tất Cả Sản Phẩm'
          )}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
          {isSaleOnly
            ? `Áp dụng giảm giá từ ngày 10/10/2026 đến ngày 31/10/2026 • Hiện có ${total} sản phẩm đang giảm giá`
            : currentCategoryObj
            ? currentCategoryObj.description
            : `Khám phá hơn ${total} thiết kế thời trang hiện đại, thanh lịch và cao cấp`}
        </p>
      </div>

      {/* Top Bar: Search, Mobile Toggle & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-800 flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" /> Bộ lọc ({total})
          </button>
          <span className="text-xs text-zinc-500 font-medium">
            Hiển thị <strong className="text-zinc-900">{products.length}</strong> sản phẩm
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">Sắp xếp:</span>
          <select
            value={selectedSort}
            onChange={e => setSelectedSort(e.target.value)}
            className="px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 shadow-sm"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="popular">Bán chạy nhất</option>
          </select>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <h3 className="font-bold text-sm text-zinc-950 uppercase tracking-wider">
                  Bộ Lọc Sản Phẩm
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-zinc-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sale Toggle Mobile */}
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  <input
                    type="checkbox"
                    checked={isSaleOnly}
                    onChange={e => updateSaleOnly(e.target.checked)}
                    className="rounded border-rose-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Chỉ sản phẩm giảm giá 🔥</span>
                </label>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-2">
                  Danh Mục
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      !selectedCategory ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-700'
                    }`}
                  >
                    Tất cả danh mục
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === c.slug
                          ? 'bg-zinc-950 text-white font-bold'
                          : 'text-zinc-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
            >
              Áp Dụng Bộ Lọc ({total})
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8">
          {/* Categories */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-3">
              Danh Mục Sản Phẩm
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-zinc-950 text-white font-bold'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                }`}
              >
                Tất cả sản phẩm
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-zinc-950 text-white font-bold'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[11px] opacity-70">({cat.itemCount || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sale Toggle */}
          <div className="pt-4 border-t border-zinc-200">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-rose-600">
              <input
                type="checkbox"
                checked={isSaleOnly}
                onChange={e => updateSaleOnly(e.target.checked)}
                className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <span>Chỉ hiển thị sản phẩm giảm giá 🔥</span>
            </label>
          </div>

          {/* Size Filter */}
          <div className="pt-6 border-t border-zinc-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-3">
              Kích Cỡ (Size)
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedSize('')}
                className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  !selectedSize
                    ? 'bg-zinc-950 text-white border-zinc-950'
                    : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                }`}
              >
                Tất cả
              </button>
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedSize === size
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-6 border-t border-zinc-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-3">
              Khoảng Giá (VNĐ)
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Tất cả mức giá', min: undefined, max: undefined },
                { label: 'Dưới 300.000đ', min: 0, max: 300000 },
                { label: '300.000đ - 600.000đ', min: 300000, max: 600000 },
                { label: '600.000đ - 1.000.000đ', min: 600000, max: 1000000 },
                { label: 'Trên 1.000.000đ', min: 1000000, max: undefined },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    minPrice === p.min && maxPrice === p.max
                      ? 'text-zinc-950 font-bold bg-zinc-100'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-zinc-200/60 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-base font-semibold text-zinc-700 mb-2">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc
              </p>
              <p className="text-xs text-zinc-500 mb-6">
                Vui lòng thử điều chỉnh lại mức giá hoặc chọn danh mục khác
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setMinPrice(undefined);
                  setMaxPrice(undefined);
                  setSelectedSize('');
                  setSelectedColor('');
                  setIsSaleOnly(false);
                }}
                className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold shadow-md hover:bg-zinc-800 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">
              {products.map(prod => {
                const discount =
                  prod.salePrice && prod.salePrice < prod.price
                    ? Math.round(((prod.price - prod.salePrice) / prod.price) * 100)
                    : null;

                return (
                  <div
                    key={prod.id}
                    className="group flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
                      <Link to={`/products/${prod.slug}`}>
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      {discount && (
                        <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                          {prod.brand}
                        </span>
                        <Link to={`/products/${prod.slug}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-black transition-colors line-clamp-1 mt-0.5">
                            {prod.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-zinc-800 text-xs">{prod.rating || 5.0}</span>
                          <span className="text-zinc-400 text-[10px]">({prod.reviewCount || 1} đánh giá)</span>
                          <span className="text-zinc-300">•</span>
                          <span className="text-zinc-400 text-[10px]">{prod.soldCount} đã bán</span>
                        </div>
                        <div className="mt-1.5">
                          {(() => {
                            const totalStock = prod.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;
                            return (
                              <span
                                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  totalStock > 0
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                              >
                                {totalStock > 0 ? `Còn ${totalStock} sản phẩm` : 'Hết hàng'}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="pt-3 mt-2 border-t border-zinc-100 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <p className="font-mono font-bold text-xs sm:text-sm text-zinc-950">
                              {(prod.salePrice || prod.price).toLocaleString('vi-VN')}đ
                            </p>
                            {prod.salePrice && (
                              <p className="font-mono text-[10px] text-zinc-400 line-through">
                                {prod.price.toLocaleString('vi-VN')}đ
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickAdd(prod); }}
                            className="py-2 px-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
                            title="Thêm vào giỏ hàng"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-zinc-700" />
                            <span className="truncate">Thêm Giỏ</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleQuickBuy(prod, e)}
                            className="py-2 px-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
                            title="Mua ngay lập tức"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
                            <span className="truncate">Mua Ngay</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
