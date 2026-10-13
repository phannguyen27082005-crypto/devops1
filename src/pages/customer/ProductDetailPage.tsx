import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Send,
  AlertCircle,
  ArrowRight,
  ThumbsUp,
  Image as ImageIcon,
  X,
  MessageSquare,
  Filter,
} from 'lucide-react';
import { api } from '../../services/api';
import { Product, ProductVariant, Review, CartItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const ProductDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected State
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Review & Shopee filter state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImageInput, setReviewImageInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'ALL' | '5' | '4' | '3' | '2' | '1' | 'IMAGES' | 'COMMENTS'>('ALL');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [hasVotedHelpful, setHasVotedHelpful] = useState<Record<string, boolean>>({});

  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { success, error } = useNotification();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!idOrSlug) return;
      setLoading(true);
      try {
        const res = await api.products.getByIdOrSlug(idOrSlug);
        if (res.success && res.data?.product) {
          const p = res.data.product;
          setProduct(p);
          const firstVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
          setSelectedVariant(firstVariant);
          setSelectedImage(firstVariant?.image || p.images[0] || '');
          setReviews(res.data.reviews || []);
          setRelatedProducts(res.data.related || []);
        } else {
          navigate('/products', { replace: true });
        }
      } catch (err: any) {
        error(err.message || 'Lỗi tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [idOrSlug]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-zinc-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-zinc-200 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
            <div className="h-24 bg-zinc-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Color options & Size options derived from variants
  const uniqueSizes: string[] = Array.from(new Set(product.variants.map(v => v.size)));
  const uniqueColors: { color: string; colorCode?: string }[] = Array.from(
    new Set(product.variants.map(v => JSON.stringify({ color: v.color, colorCode: v.colorCode })))
  ).map((s: string) => JSON.parse(s));

  const handleSizeClick = (size: string) => {
    const currentColor = selectedVariant?.color;
    // Find variant with same color and new size, or first variant with that size
    const match =
      product.variants.find(v => v.size === size && v.color === currentColor) ||
      product.variants.find(v => v.size === size);
    if (match) setSelectedVariant(match);
  };

  const handleColorClick = (color: string) => {
    const currentSize = selectedVariant?.size;
    const match =
      product.variants.find(v => v.color === color && v.size === currentSize) ||
      product.variants.find(v => v.color === color);
    if (match) {
      setSelectedVariant(match);
      const colorImg =
        match.image ||
        (product.colorImages && product.colorImages[color]?.[0]) ||
        product.variants.find(v => v.color === color && v.image)?.image;
      if (colorImg) {
        setSelectedImage(colorImg);
      }
    }
  };

  const handleThumbnailClick = (img: string) => {
    setSelectedImage(img);
    const matchedVar = product.variants.find(v => v.image === img);
    if (matchedVar) {
      const sameSizeMatch = product.variants.find(v => v.color === matchedVar.color && v.size === selectedVariant?.size);
      setSelectedVariant(sameSizeMatch || matchedVar);
    } else if (product.colorImages) {
      const colorEntry = Object.entries(product.colorImages).find(([_, imgs]) => Array.isArray(imgs) && imgs.includes(img));
      if (colorEntry) {
        const [color] = colorEntry;
        const match =
          product.variants.find(v => v.color === color && v.size === selectedVariant?.size) ||
          product.variants.find(v => v.color === color);
        if (match) setSelectedVariant(match);
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || !product) return;
    const buyItem: CartItem = {
      id: `${product.id}_${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      slug: product.slug,
      size: selectedVariant.size,
      color: selectedVariant.color,
      colorCode: selectedVariant.colorCode,
      price: selectedVariant.price || product.salePrice || product.price,
      originalPrice: product.price,
      quantity,
      image: selectedVariant.image || selectedImage || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      maxStock: selectedVariant.stock,
      sku: selectedVariant.sku,
    };
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout', { state: { selectedItems: [buyItem] } });
  };

  const handleVoteHelpful = async (reviewId: string) => {
    if (hasVotedHelpful[reviewId]) return;
    setHasVotedHelpful(prev => ({ ...prev, [reviewId]: true }));
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? (reviews.find(r => r.id === reviewId)?.helpfulCount || 0)) + 1,
    }));
    try {
      await api.reviews.voteHelpful(reviewId);
    } catch {
      // Optimistic update
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      error('Vui lòng đăng nhập để gửi đánh giá sản phẩm');
      return;
    }
    if (!reviewComment.trim()) {
      error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.reviews.create({
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
        images: reviewImageInput.trim() ? [reviewImageInput.trim()] : [],
        variantInfo: selectedVariant
          ? `Phân loại hàng: ${selectedVariant.color}, Size ${selectedVariant.size}`
          : undefined,
      });
      if (res.success && res.data) {
        success('Cảm ơn bạn! Đánh giá đã được gửi thành công.');
        setReviews(prev => [res.data, ...prev]);
        setReviewComment('');
        setReviewImageInput('');
        setShowReviewForm(false);
      }
    } catch (err: any) {
      error(err.message || 'Lỗi gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Shopee Review statistics & filtering
  const totalReviewsCount = reviews.length;
  const count5Star = reviews.filter(r => r.rating === 5).length;
  const count4Star = reviews.filter(r => r.rating === 4).length;
  const count3Star = reviews.filter(r => r.rating === 3).length;
  const count2Star = reviews.filter(r => r.rating === 2).length;
  const count1Star = reviews.filter(r => r.rating === 1).length;
  const countWithImages = reviews.filter(r => r.images && r.images.length > 0).length;
  const countWithComments = reviews.filter(r => r.comment && r.comment.trim().length > 0).length;

  const filteredReviews = reviews.filter(r => {
    if (reviewFilter === '5') return r.rating === 5;
    if (reviewFilter === '4') return r.rating === 4;
    if (reviewFilter === '3') return r.rating === 3;
    if (reviewFilter === '2') return r.rating === 2;
    if (reviewFilter === '1') return r.rating === 1;
    if (reviewFilter === 'IMAGES') return r.images && r.images.length > 0;
    if (reviewFilter === 'COMMENTS') return r.comment && r.comment.trim().length > 0;
    return true;
  });

  const discount =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link to="/" className="hover:text-black">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-black">Sản phẩm</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg">
                TIẾT KIỆM {discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img
                      ? 'border-zinc-950 shadow-md scale-102 ring-2 ring-zinc-950/20'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:scale-102'
                  }`}
                  title="Bấm để xem ảnh này"
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Controls */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400">
              {product.brand}
            </span>
            <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-950 mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating, 5-Star Count & Sold Count (Shopee Style) */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
              <a
                href="#reviews-section"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="font-extrabold text-sm text-amber-600 border-b border-amber-500 pb-0.5">
                    {product.rating ? product.rating.toFixed(1) : '5.0'}
                  </span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(product.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </a>

              <span className="text-zinc-300">|</span>

              <a
                href="#reviews-section"
                className="flex items-center gap-1 hover:text-[#ee4d2d] transition-colors cursor-pointer group"
              >
                <span className="font-bold text-zinc-950 border-b border-zinc-950 group-hover:border-[#ee4d2d]">
                  {totalReviewsCount}
                </span>
                <span className="text-zinc-500">Đánh Giá</span>
              </a>

              <span className="text-zinc-300">|</span>

              {/* Nổi bật số lần đánh giá 5 sao chuẩn Shopee */}
              <a
                href="#reviews-section"
                onClick={() => setReviewFilter('5')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[11px] shadow-xs cursor-pointer transition-colors"
                title="Bấm để xem các đánh giá 5 sao"
              >
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {count5Star} lượt đánh giá 5 sao
              </a>

              <span className="text-zinc-300">|</span>

              <div className="flex items-center gap-1">
                <span className="font-bold text-zinc-950">{product.soldCount}</span>
                <span className="text-zinc-500">Đã Bán</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-baseline gap-3">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-zinc-950">
              {(product.salePrice || product.price).toLocaleString('vi-VN')}đ
            </span>
            {product.salePrice && (
              <span className="font-mono text-sm text-zinc-400 line-through">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                Màu sắc:
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-900 font-bold border border-zinc-200">
                  {selectedVariant?.color || 'Chưa chọn'}
                </span>
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">
                (Ấn màu nào sẽ chuyển sang ảnh màu đó)
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {uniqueColors.map((c, i) => {
                const isSelected = selectedVariant?.color === c.color;
                const colorImg =
                  (product.colorImages && product.colorImages[c.color]?.[0]) ||
                  product.variants.find(v => v.color === c.color && v.image)?.image;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleColorClick(c.color)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-md ring-2 ring-zinc-950/20 scale-102'
                        : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    {colorImg ? (
                      <img
                        src={colorImg}
                        alt={c.color}
                        className="w-4.5 h-4.5 rounded-full object-cover border border-black/20 shrink-0"
                      />
                    ) : (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: c.colorCode || '#000000' }}
                      />
                    )}
                    <span>{c.color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Kích thước (Size): <strong className="text-zinc-600 font-normal">{selectedVariant?.size}</strong>
              </span>
              <Link
                to="/size-guide"
                target="_blank"
                className="text-xs text-zinc-500 hover:text-zinc-950 hover:underline cursor-pointer flex items-center gap-1 font-medium"
                title="Xem bảng quy đổi size chi tiết"
              >
                📏 Bảng quy đổi size
              </Link>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {uniqueSizes.map(size => {
                const isSelected = selectedVariant?.size === size;
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={`w-12 h-11 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-md'
                        : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock status */}
          <div className="text-xs">
            {selectedVariant ? (
              selectedVariant.stock > 0 ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Còn hàng ({selectedVariant.stock} sản phẩm trong kho)
                </span>
              ) : (
                <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Tạm hết hàng kích thước này
                </span>
              )
            ) : null}
          </div>

          {/* Quantity Stepper & Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-zinc-300 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2.5 text-zinc-600 hover:bg-zinc-100 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold font-mono text-zinc-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(prev =>
                      selectedVariant ? Math.min(selectedVariant.stock, prev + 1) : prev + 1
                    )
                  }
                  className="px-3.5 py-2.5 text-zinc-600 hover:bg-zinc-100 text-sm font-bold"
                >
                  +
                </button>
              </div>

              <button
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" /> Thêm Vào Giỏ
              </button>
            </div>

            <button
              disabled={!selectedVariant || selectedVariant.stock <= 0}
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mua Ngay - Thanh Toán Nhanh
            </button>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-zinc-200 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
              Mô Tả Sản Phẩm
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {product.description ||
                'Thiết kế chuẩn may đo phong cách Haute Couture hiện đại. Đường may tinh tế, chất liệu cao cấp mang lại sự thoải mái tối ưu cả ngày dài.'}
            </p>

            {product.details && product.details.length > 0 && (
              <ul className="space-y-1.5 pt-2 text-xs text-zinc-600">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section - Shopee Style */}
      <section id="reviews-section" className="pt-12 border-t border-zinc-200 scroll-mt-20">
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          {/* Section Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950 uppercase tracking-wide flex items-center gap-2">
                <span>ĐÁNH GIÁ SẢN PHẨM</span>
                <span className="text-sm font-normal text-zinc-500">({totalReviewsCount} đánh giá)</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Đánh giá chân thực từ khách hàng đã mua và xác thực đơn hàng tại NGUYÊN Fashion
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer w-fit"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {showReviewForm ? 'Đóng Form Đánh Giá' : 'Viết Đánh Giá Của Bạn'}
            </button>
          </div>

          {/* Shopee Rating Overview & Filter Bar */}
          <div className="p-6 bg-[#fffbf8] border-b border-[#f9ede5] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Overall Rating & 5-Star Highlight */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b lg:border-b-0 lg:border-r border-[#f3e5da] pb-6 lg:pb-0 lg:pr-6">
              <div className="text-center sm:text-left shrink-0">
                <div className="flex items-baseline justify-center sm:justify-start gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-[#ee4d2d] font-serif-title leading-none">
                    {product.rating ? product.rating.toFixed(1) : '5.0'}
                  </span>
                  <span className="text-base sm:text-lg font-medium text-[#ee4d2d]">trên 5</span>
                </div>
                <div className="flex items-center gap-0.5 text-[#ee4d2d] my-2 justify-center sm:justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating || 5)
                          ? 'fill-[#ee4d2d] text-[#ee4d2d]'
                          : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
                {/* Shopee 5-star highlight tag */}
                <div className="mt-1 inline-flex items-center gap-1.5 bg-amber-100/90 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{count5Star} lượt đánh giá 5 sao</span>
                </div>
              </div>

              {/* Star breakdown bar chart */}
              <div className="flex-1 w-full space-y-1.5 text-[11px] text-zinc-600">
                {[5, 4, 3, 2, 1].map(star => {
                  const c = reviews.filter(r => r.rating === star).length;
                  const pct = totalReviewsCount > 0 ? Math.round((c / totalReviewsCount) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-10 font-semibold text-zinc-700">{star} sao</span>
                      <div className="flex-1 h-2 bg-zinc-200/90 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            star === 5 ? 'bg-[#ee4d2d]' : star === 4 ? 'bg-amber-400' : 'bg-zinc-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-[10px] text-zinc-500 font-medium">{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Shopee Filter Buttons */}
            <div className="lg:col-span-8 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setReviewFilter('ALL')}
                className={`px-4 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  reviewFilter === 'ALL'
                    ? 'bg-[#ee4d2d] text-white font-bold border border-[#ee4d2d] shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                Tất Cả ({totalReviewsCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('5')}
                className={`px-4 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  reviewFilter === '5'
                    ? 'bg-[#ee4d2d] text-white font-bold border border-[#ee4d2d] shadow-sm'
                    : 'bg-white text-amber-900 border border-amber-300 hover:border-[#ee4d2d] font-semibold bg-amber-50/50'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${reviewFilter === '5' ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'}`} />
                5 Sao ({count5Star})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('4')}
                className={`px-4 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  reviewFilter === '4'
                    ? 'bg-[#ee4d2d] text-white font-bold border border-[#ee4d2d] shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                4 Sao ({count4Star})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('3')}
                className={`px-4 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  reviewFilter === '3'
                    ? 'bg-[#ee4d2d] text-white font-bold border border-[#ee4d2d] shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                3 Sao ({count3Star})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('2')}
                className={`px-4 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  reviewFilter === '2'
                    ? 'bg-[#ee4d2d] text-white font-bold border border-[#ee4d2d] shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                2 Sao ({count2Star})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('1')}
                className={`px-4 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  reviewFilter === '1'
                    ? 'bg-[#ee4d2d] text-white font-bold border border-[#ee4d2d] shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                1 Sao ({count1Star})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('IMAGES')}
                className={`px-4 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  reviewFilter === 'IMAGES'
                    ? 'bg-[#ee4d2d] text-white font-bold border border-[#ee4d2d] shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Có Hình Ảnh ({countWithImages})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('COMMENTS')}
                className={`px-4 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  reviewFilter === 'COMMENTS'
                    ? 'bg-[#ee4d2d] text-white font-bold border border-[#ee4d2d] shadow-sm'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Có Bình Luận ({countWithComments})
              </button>
            </div>
          </div>

          {/* Add Review Form (Collapsible) */}
          {showReviewForm && (
            <div className="p-6 bg-zinc-50/80 border-b border-zinc-200">
              <h3 className="font-bold text-sm text-zinc-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Chia sẻ đánh giá và trải nghiệm của bạn
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Đánh giá của bạn sẽ giúp cộng đồng người mua tại Nguyên Fashion có cái nhìn trực quan nhất
              </p>

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-xs font-semibold text-zinc-700">Chất lượng sản phẩm:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          title={`${star} sao`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-700">
                      {reviewRating === 5 && '⭐⭐⭐⭐⭐ Tuyệt vời'}
                      {reviewRating === 4 && '⭐⭐⭐⭐ Hài lòng'}
                      {reviewRating === 3 && '⭐⭐⭐ Bình thường'}
                      {reviewRating === 2 && '⭐⭐ Không hài lòng'}
                      {reviewRating === 1 && '⭐ Rất tệ'}
                    </span>
                  </div>

                  {selectedVariant && (
                    <div className="text-xs text-zinc-600 bg-white p-2.5 rounded-lg border border-zinc-200 w-fit">
                      <span className="font-semibold text-zinc-800">Phân loại đang chọn: </span>
                      <span className="text-zinc-700">{selectedVariant.color}, Size {selectedVariant.size}</span>
                    </div>
                  )}

                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Hãy chia sẻ nhận xét chi tiết về chất vải, độ dày dặn, form dáng, dịch vụ giao hàng..."
                    className="w-full p-3.5 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-medium"
                  />

                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      value={reviewImageInput}
                      onChange={e => setReviewImageInput(e.target.value)}
                      placeholder="Link hình ảnh feedback thực tế (không bắt buộc, ví dụ https://...)"
                      className="flex-1 p-2.5 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2 bg-[#ee4d2d] hover:bg-[#d83c1d] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Hoàn Thành & Gửi Đánh Giá
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-600 flex items-center justify-between">
                  <span>Vui lòng đăng nhập để gửi đánh giá và ghi chú cho sản phẩm này.</span>
                  <Link
                    to="/login"
                    className="font-bold text-[#ee4d2d] underline hover:opacity-80"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Review Items List */}
          <div className="divide-y divide-zinc-100">
            {filteredReviews.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                <p className="text-sm font-medium">Chưa có đánh giá nào phù hợp với bộ lọc đã chọn.</p>
                <button
                  type="button"
                  onClick={() => setReviewFilter('ALL')}
                  className="mt-3 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Xem tất cả ({totalReviewsCount}) đánh giá
                </button>
              </div>
            ) : (
              filteredReviews.map(r => (
                <div key={r.id} className="p-6 transition-colors hover:bg-zinc-50/50">
                  <div className="flex items-start gap-3.5">
                    {/* User Avatar */}
                    {r.userAvatar ? (
                      <img
                        src={r.userAvatar}
                        alt={r.userName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-xs">
                        {r.userName ? r.userName[0] : 'U'}
                      </div>
                    )}

                    {/* Review Body */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-xs text-zinc-900">{r.userName}</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              Đã mua hàng tại NGUYÊN Fashion
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Date & Variant tag (Shopee style) */}
                      <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-2">
                        <span>
                          {new Date(r.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {r.variantInfo && (
                          <>
                            <span className="text-zinc-300">|</span>
                            <span className="text-zinc-500 font-medium">{r.variantInfo}</span>
                          </>
                        )}
                      </div>

                      {/* Shopee Feedback Criteria Tags */}
                      {(r.matchDescription || r.qualityFeedback || r.fitFeedback) && (
                        <div className="space-y-1 text-xs pt-1">
                          {r.matchDescription && (
                            <div className="text-zinc-600">
                              <span className="text-zinc-400">Đúng với mô tả: </span>
                              <span className="font-medium text-zinc-800">{r.matchDescription}</span>
                            </div>
                          )}
                          {r.qualityFeedback && (
                            <div className="text-zinc-600">
                              <span className="text-zinc-400">Chất lượng sản phẩm: </span>
                              <span className="font-medium text-zinc-800">{r.qualityFeedback}</span>
                            </div>
                          )}
                          {r.fitFeedback && (
                            <div className="text-zinc-600">
                              <span className="text-zinc-400">Độ vừa vặn: </span>
                              <span className="font-medium text-zinc-800">{r.fitFeedback}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Comment text */}
                      <p className="text-xs text-zinc-800 leading-relaxed font-normal pt-1 whitespace-pre-line">
                        {r.comment}
                      </p>

                      {/* Review Images Gallery (Shopee style thumbnails) */}
                      {r.images && r.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {r.images.map((img, imgIdx) => (
                            <button
                              key={imgIdx}
                              type="button"
                              onClick={() => setLightboxImage(img)}
                              className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-zinc-200 hover:border-zinc-400 transition-all cursor-pointer group shrink-0 relative"
                            >
                              <img
                                src={img}
                                alt={`Feedback ${imgIdx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Shopee Seller Response Box */}
                      {r.sellerReply && (
                        <div className="mt-3 p-3.5 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#ee4d2d]"></span>
                              Phản hồi của Người Bán (Nguyên Fashion)
                            </span>
                            {r.sellerReplyDate && (
                              <span className="text-[10px] text-zinc-400">
                                {new Date(r.sellerReplyDate).toLocaleDateString('vi-VN')}
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-600 leading-relaxed font-normal">
                            {r.sellerReply}
                          </p>
                        </div>
                      )}

                      {/* Helpful Button (Shopee Style) */}
                      <div className="pt-2 flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => handleVoteHelpful(r.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                            hasVotedHelpful[r.id]
                              ? 'border-rose-300 bg-rose-50 text-rose-600 font-bold'
                              : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Hữu ích ({helpfulVotes[r.id] ?? r.helpfulCount ?? 0})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Review Photos */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Feedback phóng to"
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl mx-auto"
            />
            <div className="p-3 text-center text-xs text-zinc-400">
              Ảnh feedback thực tế từ người mua tại NGUYÊN Fashion
            </div>
          </div>
        </div>
      )}

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="font-serif-title text-2xl font-bold text-zinc-950">
              Có Thể Bạn Cũng Thích
            </h2>
            <Link
              to="/products?sale=true"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors w-fit"
            >
              Xem sản phẩm giảm giá khác <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map(p => {
              const discount =
                p.salePrice && p.salePrice < p.price
                  ? Math.round(((p.price - p.salePrice) / p.price) * 100)
                  : null;

              return (
                <div
                  key={p.id}
                  className="group flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                    <Link to={`/products/${p.slug}`}>
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    {discount && (
                      <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md">
                        -{discount}%
                      </span>
                    )}
                  </div>
                <div className="p-3.5">
                  <Link to={`/products/${p.slug}`}>
                    <h3 className="font-bold text-xs text-zinc-900 group-hover:text-black line-clamp-1">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="font-mono font-bold text-xs text-zinc-950 mt-1">
                    {(p.salePrice || p.price).toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            );
          })}
          </div>
        </section>
      )}
    </div>
  );
};
