import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Truck,
  Ticket,
  Check,
  ChevronLeft,
  CheckSquare,
  Square,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items = [],
    updateQuantity,
    removeFromCart,
    clearCart,
    couponCode = '',
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [applying, setApplying] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { success, error } = useNotification();

  // Helper to get unique key for an item
  const getItemKey = (item: any) =>
    item.id || item.variantId || `${item.productId}_${item.size}_${item.color}`;

  // Initialize and synchronize selected keys when items change
  useEffect(() => {
    if (items.length > 0) {
      const validItemKeys = items.map(getItemKey);
      setSelectedKeys(prev => {
        // Keep existing selections that still exist in cart, or select all by default
        const filtered = prev.filter(k => validItemKeys.includes(k));
        return filtered.length > 0 ? filtered : validItemKeys;
      });
    } else {
      setSelectedKeys([]);
    }
  }, [items]);

  const isAllSelected = items.length > 0 && selectedKeys.length === items.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(items.map(getItemKey));
    }
  };

  const handleToggleItem = (itemKey: string) => {
    setSelectedKeys(prev =>
      prev.includes(itemKey) ? prev.filter(k => k !== itemKey) : [...prev, itemKey]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedKeys.length === 0) return;
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedKeys.length} sản phẩm đã chọn khỏi giỏ hàng?`)) {
      selectedKeys.forEach(k => removeFromCart(k));
      setSelectedKeys([]);
    }
  };

  const handleClearAllCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
      clearCart();
      setSelectedKeys([]);
      success('Đã làm trống giỏ hàng');
    }
  };

  const formatVND = (num: any): string => {
    const val = Number(num);
    return isNaN(val) ? '0' : val.toLocaleString('vi-VN');
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setApplying(true);
    try {
      const ok = await applyCoupon(inputCoupon.trim());
      if (ok) {
        setInputCoupon('');
      }
    } catch (err: any) {
      error(err.message || 'Không thể áp dụng mã');
    } finally {
      setApplying(false);
    }
  };

  // Selected items calculations
  const selectedItems = useMemo(() => {
    return items.filter(item => selectedKeys.includes(getItemKey(item)));
  }, [items, selectedKeys]);

  const selectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const selectedSubtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  }, [selectedItems]);

  const freeShippingThreshold = 500000;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - selectedSubtotal);
  const freeShipPercent = Math.min(100, Math.round((selectedSubtotal / freeShippingThreshold) * 100));

  const shippingFee = useMemo(() => {
    if (selectedItems.length === 0) return 0;
    return selectedSubtotal >= freeShippingThreshold ? 0 : 30000;
  }, [selectedSubtotal, selectedItems.length]);

  const discountAmount = useMemo(() => {
    // If voucher applied, coupon discount applies to selected items subtotal
    if (!couponCode || selectedItems.length === 0) return 0;
    if (couponCode === 'MAISON10') {
      return Math.round(selectedSubtotal * 0.1);
    }
    if (couponCode === 'WELCOME50' && selectedSubtotal >= 399000) {
      return 50000;
    }
    if (couponCode === 'VIP100' && selectedSubtotal >= 1000000) {
      return 100000;
    }
    return 0;
  }, [couponCode, selectedSubtotal, selectedItems.length]);

  const total = Math.max(0, selectedSubtotal + shippingFee - discountAmount);

  const handleProceedToCheckout = () => {
    let toCheckout = selectedItems;
    if (toCheckout.length === 0 && items.length > 0) {
      toCheckout = items;
      setSelectedKeys(items.map(getItemKey));
    }
    if (toCheckout.length === 0) {
      error('Giỏ hàng của bạn đang trống');
      return;
    }
    navigate('/checkout', {
      state: { selectedItems: toCheckout },
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="font-serif-title text-2xl font-bold text-zinc-900">
            Giỏ Hàng Của Bạn Đang Trống
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Hãy khám phá các thiết kế thời trang mặc hàng ngày mới nhất để bổ sung vào tủ đồ của bạn
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-md"
        >
          Khám Phá Sản Phẩm Ngay <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-zinc-950">
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Tổng cộng <strong>{items.length}</strong> loại sản phẩm ({items.reduce((s, i) => s + i.quantity, 0)} chiếc)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link
            to="/orders"
            className="text-xs font-bold text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-xl border border-zinc-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-amber-600" /> Xem Lịch Sử Đơn Mua
          </Link>
          <button
            type="button"
            onClick={handleClearAllCart}
            className="text-xs font-semibold text-zinc-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả giỏ hàng
          </button>
        </div>
      </div>

      {/* Free shipping banner */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 mb-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          {selectedSubtotal === 0 ? (
            <span>Tích chọn sản phẩm để tính điều kiện <strong>Freeship</strong> (Đơn từ 500k)</span>
          ) : remainingForFreeShip === 0 ? (
            <span className="text-emerald-600 font-bold">
              Chúc mừng! Các sản phẩm đã chọn đủ điều kiện Miễn phí vận chuyển toàn quốc.
            </span>
          ) : (
            <span>
              Chọn thêm <strong className="text-rose-600">{formatVND(remainingForFreeShip)}đ</strong> để được <strong>Freeship toàn quốc</strong>
            </span>
          )}
        </div>
        <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${selectedSubtotal > 0 ? freeShipPercent : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Cart layout: Table + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Controls: Select All & Delete Selected */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2.5 font-bold text-zinc-900 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-900 cursor-pointer"
              />
              <span>
                Chọn tất cả ({selectedKeys.length}/{items.length} sản phẩm)
              </span>
            </label>

            <div className="flex items-center gap-4">
              {selectedKeys.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa {selectedKeys.length} mục đã chọn
                </button>
              )}
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm divide-y divide-zinc-100">
            {items.map(item => {
              const displayName = item.productName || (item as any).name || 'Sản phẩm';
              const itemKey = getItemKey(item);
              const itemPrice = item.price || 0;
              const isSelected = selectedKeys.includes(itemKey);
              const maxStock = item.maxStock || 99;

              return (
                <div
                  key={itemKey}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-colors ${
                    isSelected ? 'bg-white' : 'bg-zinc-50/50 opacity-80'
                  }`}
                >
                  {/* Left: Checkbox + Image + Name */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleItem(itemKey)}
                      className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-900 cursor-pointer shrink-0"
                    />

                    <Link to={`/products/${item.slug}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={displayName}
                        className="w-20 h-24 object-cover rounded-xl border border-zinc-200 shrink-0 hover:opacity-90 transition-opacity"
                      />
                    </Link>

                    <div className="space-y-1 min-w-0">
                      <Link
                        to={`/products/${item.slug}`}
                        className="font-bold text-sm text-zinc-950 hover:underline line-clamp-1"
                      >
                        {displayName}
                      </Link>
                      <p className="text-zinc-500">
                        Phân loại: <strong className="text-zinc-800">{item.size}</strong> •{' '}
                        <strong className="text-zinc-800">{item.color}</strong>
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-bold text-xs text-zinc-950">
                          {formatVND(itemPrice)}đ
                        </span>
                        {item.originalPrice && item.originalPrice > itemPrice && (
                          <span className="font-mono text-[10px] text-zinc-400 line-through">
                            {formatVND(item.originalPrice)}đ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper + Subtotal + Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-7 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                    {/* Quantity Stepper with Direct Input */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center border border-zinc-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-bold active:scale-95 transition-all text-sm"
                          title="Giảm số lượng"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={maxStock}
                          value={item.quantity}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 1) {
                              updateQuantity(itemKey, Math.min(val, maxStock));
                            }
                          }}
                          className="w-12 h-8 text-center font-mono font-bold text-zinc-900 border-x border-zinc-200 focus:outline-none focus:bg-zinc-50 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                          disabled={item.quantity >= maxStock}
                          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-bold active:scale-95 transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>
                      {item.quantity >= maxStock && (
                        <span className="text-[10px] text-amber-600 font-medium mt-1">
                          Tối đa tồn kho
                        </span>
                      )}
                    </div>

                    {/* Subtotal */}
                    <div className="text-right sm:w-28">
                      <p className="font-mono font-bold text-sm text-zinc-950">
                        {formatVND(itemPrice * item.quantity)}đ
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(itemKey)}
                      className="p-2 text-zinc-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-xs font-bold text-zinc-900 hover:text-zinc-600 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Tiếp tục chọn sản phẩm khác
            </Link>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          {/* Voucher input */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-zinc-500" /> Mã Khuyến Mãi (Voucher)
            </h3>

            {couponCode ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div>
                  <span className="font-bold font-mono text-emerald-800">{couponCode}</span>
                  <p className="text-emerald-700 text-[11px]">
                    Giảm -{formatVND(discountAmount)}đ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-emerald-900 hover:text-rose-600 text-xs font-bold"
                >
                  Gỡ bỏ
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={e => setInputCoupon(e.target.value.toUpperCase())}
                  placeholder="Nhập mã (MAISON10...)"
                  className="flex-1 px-3 py-2 border border-zinc-300 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <button
                  type="submit"
                  disabled={applying || !inputCoupon}
                  className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {applying ? '...' : 'Áp Dụng'}
                </button>
              </form>
            )}
          </div>

          {/* Breakdown Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-950 border-b border-zinc-100 pb-3 flex items-center justify-between">
              <span>Tóm Tắt Đơn Hàng</span>
              <span className="text-xs font-normal text-zinc-500">
                Đã chọn <strong>{selectedCount}</strong> sản phẩm
              </span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Tiền hàng ({selectedItems.length} loại sản phẩm):</span>
                <span className="font-mono text-zinc-900 font-bold">
                  {formatVND(selectedSubtotal)}đ
                </span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Phí vận chuyển:</span>
                <span className="font-mono text-zinc-900">
                  {selectedItems.length === 0 ? (
                    '0đ'
                  ) : shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  ) : (
                    `${formatVND(shippingFee)}đ`
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm giá voucher:</span>
                  <span className="font-mono font-bold">
                    -{formatVND(discountAmount)}đ
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                <span className="font-bold text-sm text-zinc-950">Tổng thanh toán:</span>
                <span className="font-mono font-extrabold text-2xl text-rose-600">
                  {formatVND(total)}đ
                </span>
              </div>
            </div>

            {selectedItems.length === 0 && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Vui lòng tích chọn sản phẩm bạn muốn mua để thanh toán</span>
              </div>
            )}

            <button
              type="button"
              disabled={items.length === 0}
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              Tiến Hành Mua Hàng {selectedCount > 0 ? `(${selectedCount})` : `(Tất cả ${items.reduce((s, i) => s + i.quantity, 0)})`} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
