import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  PhoneCall,
  LogOut,
  Package,
  TrendingUp,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { AIChatWidget } from '../components/AIChatWidget';
import { api } from '../services/api';
import { Product } from '../types';

export const CustomerLayout: React.FC = () => {
  const { totalQuantity } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { success } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.products.getAll({ search: searchQuery.trim(), limit: 5 });
        if (res.success && res.data?.products) {
          setSearchResults(res.data.products);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const trendingKeywords = [
    'Áo Polo Nam',
    'Blazer Hàn Quốc',
    'Váy Hoa Nhí',
    'Sơ Mi Oxford',
    'Quần Tây Âu',
    'Áo Khoác Gió',
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      success('🎉 Đăng ký thành công! Tặng bạn mã voucher: WELCOME50 (giảm 50.000đ cho đơn hàng)');
      setNewsletterEmail('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  const handleTrendingClick = (keyword: string) => {
    setSearchQuery(keyword);
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
    setSearchFocused(false);
  };

  const desktopNavLinks = [
    { label: 'Trang Chủ', path: '/' },
    { label: 'Sản Phẩm', path: '/products', hasDropdown: true },
    { label: 'Khuyến Mãi HOT', path: '/products?sale=true', highlight: true },
    { label: 'Về Chúng Tôi', path: '/about' },
    { label: 'Đổi Trả 7 Ngày', path: '/return-policy' },
    { label: 'Bảng Size', path: '/size-guide' },
  ];

  const categoryDropdownItems = [
    { label: 'Tất Cả Sản Phẩm', path: '/products' },
    { label: 'Áo Nam & Nữ', path: '/category/ao' },
    { label: 'Quần Thời Trang', path: '/category/quan' },
    { label: 'Váy & Đầm Nữ', path: '/category/vay' },
    { label: 'Áo Khoác & Blazer', path: '/category/ao-khoac' },
  ];

  const navLinks = [
    { label: 'Trang Chủ', path: '/' },
    { label: 'Tất Cả Sản Phẩm', path: '/products' },
    { label: 'Áo Nam & Nữ', path: '/category/ao' },
    { label: 'Quần Thời Trang', path: '/category/quan' },
    { label: 'Váy & Đầm', path: '/category/vay' },
    { label: 'Áo Khoác & Blazer', path: '/category/ao-khoac' },
    { label: 'Khuyến Mãi HOT', path: '/products?sale=true', highlight: true },
    { label: 'Về Chúng Tôi', path: '/about' },
    { label: 'Chính Sách Đổi Trả', path: '/return-policy' },
    { label: 'Bảng Size Chuẩn', path: '/size-guide' },
    { label: 'Liên Hệ', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-zinc-300 text-xs py-2 px-4 border-b border-zinc-800 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-zinc-400 text-[11px] lg:text-xs">
            <Link to="/orders" className="hover:text-amber-300 text-zinc-300 transition-colors flex items-center gap-1.5 font-medium">
              <Package className="w-3.5 h-3.5 text-amber-400" /> Tra Cứu Đơn Hàng
            </Link>
            <span>•</span>
            <a href="tel:0825764371" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <PhoneCall className="w-3.5 h-3.5" /> Hotline: 0825 764 371
            </a>
            <span>•</span>
            <Link to="/admin" className="hover:text-amber-300 text-zinc-300 transition-colors flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Cổng Quản Trị
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all w-full shadow-xs">
        {/* Tier 1: Brand Logo + Centered Search Bar + Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Button + Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 -ml-1 text-zinc-700 hover:text-black lg:hidden focus:outline-none cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950 flex items-center justify-center shadow-md border border-zinc-800 text-white font-serif-title font-black text-xl tracking-tighter group-hover:scale-105 transition-all shadow-zinc-900/15 shrink-0">
                <span className="bg-gradient-to-tr from-amber-200 via-white to-amber-100 bg-clip-text text-transparent">N</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif-title text-xl sm:text-2xl tracking-[0.22em] font-extrabold text-zinc-950 uppercase group-hover:tracking-[0.25em] transition-all leading-tight">
                  NGUYÊN
                </span>
                <span className="text-[9px] tracking-[0.32em] font-bold text-zinc-400 uppercase leading-none">
                  THỜI TRANG CAO CẤP
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Prominent, Balanced Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <div className="absolute left-4 text-zinc-400 pointer-events-none flex items-center">
                <Search className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (!searchFocused) setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                placeholder="Tìm kiếm áo sơ mi, blazer, váy đầm, quần âu..."
                className="w-full pl-11 pr-24 py-2.5 bg-zinc-100/90 hover:bg-zinc-100 focus:bg-white border border-transparent hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 rounded-full text-xs xl:text-sm font-medium placeholder:text-zinc-400 text-zinc-900 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                  title="Xoá tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span>Tìm</span>
              </button>
            </form>

            {/* Live Search Instant Dropdown Popup */}
            {searchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* When typing with results */}
                {searchQuery.trim().length >= 2 ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-100 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      <span>Gợi ý sản phẩm cho "{searchQuery.trim()}"</span>
                      {searchLoading && <span className="text-zinc-400 animate-pulse font-normal lowercase">đang tìm...</span>}
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-zinc-100 mt-1 max-h-80 overflow-y-auto">
                        {searchResults.map(prod => (
                          <Link
                            key={prod.id}
                            to={`/products/${prod.slug || prod.id}`}
                            onClick={() => {
                              setSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-xl transition-colors group cursor-pointer"
                          >
                            <img
                              src={prod.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-zinc-100 border border-zinc-200 shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-zinc-900 group-hover:text-black truncate">{prod.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-extrabold text-zinc-950">
                                  {Number(prod.salePrice || prod.price).toLocaleString('vi-VN')}đ
                                </span>
                                {prod.salePrice && prod.salePrice < prod.price && (
                                  <span className="text-[10px] text-zinc-400 line-through">
                                    {Number(prod.price).toLocaleString('vi-VN')}đ
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-zinc-300 group-hover:text-zinc-600 text-xs transition-colors shrink-0">→</span>
                          </Link>
                        ))}
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full mt-2 py-2.5 text-center text-xs font-bold text-zinc-950 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Xem tất cả kết quả cho <strong>"{searchQuery.trim()}"</strong></span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      !searchLoading && (
                        <div className="py-6 text-center text-zinc-500">
                          <p className="text-xs">Không tìm thấy sản phẩm nào khớp với "{searchQuery.trim()}"</p>
                          <button
                            type="button"
                            onClick={handleSearchSubmit}
                            className="mt-2 text-xs font-bold text-zinc-950 hover:underline"
                          >
                            Xem trên trang sản phẩm →
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  /* Popular Trending Keywords */
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Xu hướng tìm kiếm hot</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingKeywords.map(kw => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => handleTrendingClick(kw)}
                          className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-950 hover:text-white rounded-full text-xs font-medium text-zinc-700 transition-all cursor-pointer"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <Link
                        to="/products?sale=true"
                        onClick={() => setSearchFocused(false)}
                        className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                      >
                        🔥 Xem các sản phẩm đang giảm giá sốc
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSearchFocused(false)}
                        className="text-zinc-400 hover:text-zinc-700 font-medium"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Lịch Sử Đơn Hàng Quick Access Button */}
            <Link
              to="/orders"
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 border text-xs font-bold shadow-2xs cursor-pointer ${
                location.pathname === '/orders'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200/90 hover:border-zinc-300'
              }`}
              title="Xem lịch sử và tra cứu đơn hàng của bạn"
            >
              <Package className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Lịch Sử Đơn</span>
            </Link>

            {/* User Account / Profile Dropdown */}
            <div className="relative shrink-0">
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1 text-xs font-semibold text-zinc-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 rounded-full transition-all shadow-2xs cursor-pointer max-w-[140px] sm:max-w-[160px]"
                  >
                    <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-[11px] uppercase shadow-inner shrink-0">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                    <span className="truncate text-zinc-900 font-bold max-w-[65px] sm:max-w-[90px]">
                      {user.name.split(' ').slice(-1)[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-zinc-100">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Tài khoản</p>
                        <p className="text-xs font-bold text-zinc-900 truncate mt-0.5">{user.name}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-zinc-400" /> Tài khoản của tôi
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-zinc-400" /> Đơn hàng đã mua
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-600 font-bold hover:bg-amber-50 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Cổng Quản Trị Hệ Thống
                        </Link>
                      )}
                      <div className="border-t border-zinc-100 my-1"></div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-bold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-zinc-800 hover:text-black hover:bg-zinc-100 border border-zinc-200/90 rounded-full transition-all flex items-center gap-1.5 shadow-2xs text-xs font-bold shrink-0"
                  title="Đăng nhập tài khoản"
                >
                  <UserIcon className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 sm:p-2.5 text-zinc-900 hover:bg-zinc-100 rounded-full transition-all flex items-center border border-zinc-200/60 shadow-2xs shrink-0"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-800" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-950 text-white text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Tier 2: Desktop Sub-Navigation Bar - Centered & Balanced */}
        <div className="hidden lg:block border-t border-zinc-100 bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-center">
            <nav className="flex items-center gap-1 xl:gap-2">
              {desktopNavLinks.map(item => {
                const isSaleActive = location.pathname === '/products' && location.search.includes('sale=true');
                const isActive =
                  item.highlight
                    ? isSaleActive
                    : item.path === '/'
                    ? location.pathname === '/'
                    : item.path === '/products'
                    ? location.pathname === '/products' && !isSaleActive
                    : location.pathname.startsWith(item.path);

                if (item.hasDropdown) {
                  return (
                    <div key={item.label} className="relative group">
                      <Link
                        to={item.path}
                        className={`whitespace-nowrap px-3.5 py-1 rounded-full text-xs xl:text-[13px] transition-all flex items-center gap-1 cursor-pointer ${
                          isActive
                            ? 'bg-zinc-950 text-white font-bold shadow-xs'
                            : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-semibold'
                        }`}
                      >
                        {item.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                      </Link>
                      {/* Hover Mega Dropdown */}
                      <div className="absolute left-0 top-full pt-1.5 w-52 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-2 space-y-0.5">
                          {categoryDropdownItems.map(subItem => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className="block px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`whitespace-nowrap px-3.5 py-1 rounded-full text-xs xl:text-[13px] transition-all flex items-center gap-1.5 cursor-pointer ${
                      item.highlight
                        ? isSaleActive
                          ? 'bg-rose-50 text-rose-600 font-extrabold ring-1 ring-rose-200 shadow-2xs'
                          : 'text-rose-600 hover:bg-rose-50 font-bold'
                        : isActive
                        ? 'bg-zinc-950 text-white font-bold shadow-xs'
                        : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 font-semibold'
                    }`}
                  >
                    {item.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Search Bar - Visible on small screens */}
        <div className="md:hidden px-4 py-2.5 bg-white border-t border-zinc-100">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm, áo, đầm, quần..."
              className="w-full pl-10 pr-16 py-2 bg-zinc-100/90 rounded-full text-xs font-medium focus:bg-white focus:ring-2 focus:ring-zinc-950 focus:outline-none transition-all placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-zinc-950 text-white text-[11px] font-bold rounded-full cursor-pointer"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            {/* Quick Access: Lịch Sử Đơn Hàng */}
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-zinc-900 font-bold text-sm mb-3 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-amber-600" />
                <span>Lịch Sử Đơn Hàng Của Bạn</span>
              </div>
              <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">Xem ngay →</span>
            </Link>
            {navLinks.map(item => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  item.highlight
                    ? 'text-rose-600 font-bold bg-rose-50'
                    : location.pathname === item.path
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'text-zinc-700 hover:bg-zinc-50 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-sm font-semibold border border-zinc-300 rounded-lg text-zinc-800 hover:bg-zinc-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-sm font-semibold bg-zinc-950 text-white rounded-lg hover:bg-zinc-800"
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-zinc-700 font-medium"
                  >
                    Thông tin tài khoản ({user?.name})
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-zinc-700 font-medium"
                  >
                    Lịch sử đơn hàng
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-rose-600 font-semibold"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Customer Trust Badges */}
      <section className="bg-white border-t border-b border-zinc-200 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">Giao Hàng Toàn Quốc</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Miễn phí cho đơn hàng từ 500k</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">15 Ngày Đổi Trả</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Thủ tục nhanh gọn, tận nơi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">Chất Lượng Cam Kết</h4>
                <p className="text-xs text-zinc-500 mt-0.5">100% sợi dệt tự nhiên chuẩn cao cấp</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-900">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">Tư Vấn Chuyên Nghiệp</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Hỗ trợ chọn size chuẩn xác 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Footer (NO ADMIN LINKS!) */}
      <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-serif-title font-bold text-lg shadow-sm">
                  <span className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">N</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif-title text-xl tracking-[0.2em] font-bold text-white uppercase">
                    NGUYÊN
                  </span>
                  <span className="text-[9px] tracking-[0.3em] font-medium text-zinc-500 uppercase -mt-1">
                    STUDIO VIETNAM
                  </span>
                </div>
              </Link>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                Thương hiệu thời trang cao cấp hướng đến sự tối giản, tinh tế và bền vững trong từng đường kim mũi chỉ.
              </p>
              <div className="pt-2 text-xs space-y-1.5 text-zinc-400">
                <p><strong className="text-zinc-200">Địa chỉ:</strong> 134 Nguyễn Đăng Đạo, Cẩm Lệ, TP. Đà Nẵng</p>
                <p><strong className="text-zinc-200">Hotline:</strong> <a href="tel:0825764371" className="hover:text-white transition-colors">0825 764 371</a> (08:30 - 22:00)</p>
                <p><strong className="text-zinc-200">Email:</strong> <a href="mailto:phannguyen27082005@gmail.com" className="hover:text-white transition-colors">phannguyen27082005@gmail.com</a></p>
              </div>
            </div>

            {/* Links - Categories */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Danh Mục Sản Phẩm</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/category/ao" className="hover:text-white transition-colors">Áo Nam & Nữ</Link></li>
                <li><Link to="/category/quan" className="hover:text-white transition-colors">Quần Thời Trang</Link></li>
                <li><Link to="/category/vay" className="hover:text-white transition-colors">Váy & Đầm Nữ</Link></li>
                <li><Link to="/category/ao-khoac" className="hover:text-white transition-colors">Áo Khoác & Blazer</Link></li>
                <li><Link to="/category/hoodie" className="hover:text-white transition-colors">Hoodie & Sweater</Link></li>
                <li><Link to="/category/phu-kien" className="hover:text-white transition-colors">Phụ Kiện Da Cao Cấp</Link></li>
              </ul>
            </div>

            {/* Links - Customer Care */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Hỗ Trợ Khách Hàng</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">Giới Thiệu Thương Hiệu</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Liên Hệ & Góp Ý</Link></li>
                <li><Link to="/orders" className="hover:text-white transition-colors">Tra Cứu Đơn Hàng</Link></li>
                <li><Link to="/size-guide" className="hover:text-white transition-colors">Hướng Dẫn Chọn Size</Link></li>
                <li><Link to="/return-policy" className="hover:text-white transition-colors">Chính Sách Đổi Trả</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Bảo Mật Thông Tin</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Nhận Bản Tin Phong Cách</h4>
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                Đăng ký để nhận voucher 50k và cập nhật các bộ sưu tập mới sớm nhất.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                >
                  Đăng Ký <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Copyright & Payment methods */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2025 NGUYÊN Fashion Studio Vietnam. Bảo lưu mọi quyền.</p>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>COD Tiền Mặt</span>
              <span>•</span>
              <span>Chuyển Khoản Ngân Hàng</span>
              <span>•</span>
              <span>Thẻ ATM / Visa / Master</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Customer Support Widget 24/7 */}
      <AIChatWidget />
    </div>
  );
};
