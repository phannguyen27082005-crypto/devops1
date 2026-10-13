import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  AlertTriangle,
  RotateCcw,
  ShoppingBag,
  X,
  ChevronRight,
  Filter,
  Check,
  Star,
  MessageSquare,
  Sparkles,
  Shirt,
  CreditCard,
  PhoneCall,
  HelpCircle,
  Search,
} from 'lucide-react';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useCart } from '../../context/CartContext';

const CANCEL_REASONS = [
  'Muốn thay đổi địa chỉ nhận hàng hoặc số điện thoại',
  'Muốn thay đổi sản phẩm trong đơn (kích cỡ, màu sắc, số lượng)',
  'Tìm thấy giá tốt hơn ở nơi khác / Đổi ý không muốn mua nữa',
  'Muốn áp dụng mã giảm giá hoặc thay đổi phương thức thanh toán',
  'Thời gian giao hàng dự kiến không phù hợp',
  'Đặt nhầm / Trùng lặp đơn hàng',
  'Lý do khác (Nhập chi tiết)',
];

const RETURN_SIZE_REASONS = [
  'Mang không vừa size: Quá chật / Bó sát người khó chịu',
  'Mang không vừa size: Quá rộng / Form rộng thùng thình',
  'Form dáng không vừa vặn như mong muốn (Cần đổi size khác)',
  'Đặt nhầm kích cỡ khi đặt mua sản phẩm',
  'Sản phẩm bị lỗi đường may, bung chỉ hoặc giao nhầm màu/size',
  'Lý do khác (Nhập chi tiết bên dưới)',
];

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const POPULAR_BANKS = [
  'Vietcombank',
  'MB Bank (Quân Đội)',
  'Techcombank',
  'ACB (Á Châu)',
  'VPBank',
  'TPBank',
  'BIDV',
  'VietinBank',
  'Agribank',
  'HDBank',
  'Sacombank',
];

export const CustomerOrdersPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');

  // Cancel order modal state
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>(CANCEL_REASONS[0]);
  const [customReasonText, setCustomReasonText] = useState<string>('');
  const [submittingCancel, setSubmittingCancel] = useState<boolean>(false);

  // Return & Exchange Size Modal State
  const [returnOrderModal, setReturnOrderModal] = useState<Order | null>(null);
  const [returnType, setReturnType] = useState<'EXCHANGE_SIZE' | 'REFUND'>('EXCHANGE_SIZE');
  const [returnReason, setReturnReason] = useState<string>(RETURN_SIZE_REASONS[0]);
  const [customReturnReason, setCustomReturnReason] = useState<string>('');
  const [targetSize, setTargetSize] = useState<string>('L');
  const [bankName, setBankName] = useState<string>(POPULAR_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [returnNote, setReturnNote] = useState<string>('');
  const [submittingReturn, setSubmittingReturn] = useState<boolean>(false);

  // Review & Rating modal state
  const [reviewModalItem, setReviewModalItem] = useState<{ orderId: string; item: any } | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewedMap, setReviewedMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('nguyen_reviewed_items');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleOpenReviewModal = (orderId: string, item: any) => {
    setReviewModalItem({ orderId, item });
    setReviewRating(5);
    setReviewComment('');
  };

  const handleCloseReviewModal = () => {
    setReviewModalItem(null);
    setSubmittingReview(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalItem) return;
    if (!reviewComment.trim()) {
      error('Vui lòng nhập ghi chú / nhận xét của bạn về sản phẩm');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.reviews.create({
        productId: reviewModalItem.item.productId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (res.success) {
        success('🎉 Cảm ơn bạn! Đánh giá và số sao của bạn đã được xuất bản để mọi người cùng xem.');
        const newMap = {
          ...reviewedMap,
          [`${reviewModalItem.orderId}_${reviewModalItem.item.productId}`]: reviewRating,
        };
        setReviewedMap(newMap);
        localStorage.setItem('nguyen_reviewed_items', JSON.stringify(newMap));
        handleCloseReviewModal();
      } else {
        error(res.message || 'Lỗi gửi đánh giá');
      }
    } catch (err: any) {
      error(err.message || 'Lỗi gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.orders.getMyOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err: any) {
      error(err.message || 'Lỗi tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchOrders();
  }, [isAuthenticated]);

  const handleOpenCancelModal = (order: Order) => {
    setCancellingOrder(order);
    setSelectedReason(CANCEL_REASONS[0]);
    setCustomReasonText('');
  };

  const handleCloseCancelModal = () => {
    setCancellingOrder(null);
    setSubmittingCancel(false);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;

    let finalReason = selectedReason;
    if (selectedReason === 'Lý do khác (Nhập chi tiết)') {
      if (!customReasonText.trim()) {
        error('Vui lòng nhập chi tiết lý do hủy đơn hàng');
        return;
      }
      finalReason = customReasonText.trim();
    }

    setSubmittingCancel(true);
    try {
      const res = await api.orders.cancelOrder(cancellingOrder.id, finalReason);
      if (res.success) {
        success(`Đã hủy đơn hàng #${cancellingOrder.orderCode} thành công`);
        // Update local state
        setOrders(prev =>
          prev.map(o =>
            o.id === cancellingOrder.id
              ? { ...o, orderStatus: 'CANCELLED', cancelReason: finalReason }
              : o
          )
        );
        handleCloseCancelModal();
      } else {
        error(res.message || 'Không thể hủy đơn hàng');
      }
    } catch (err: any) {
      error(err.message || 'Lỗi xử lý hủy đơn hàng');
    } finally {
      setSubmittingCancel(false);
    }
  };

  const handleReorder = (order: Order) => {
    let count = 0;
    order.items.forEach(item => {
      addToCart(
        {
          id: item.productId,
          name: item.productName,
          slug: 'product',
          brand: 'Nguyên Studio',
          price: item.price,
          description: '',
          details: [],
          images: [item.imageUrl || ''],
          categoryId: 'cat-1',
          variants: [],
          rating: 5,
          reviewCount: 1,
          soldCount: 1,
          isFeatured: false,
          isNewArrival: false,
          isFlashSale: false,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        } as any,
        {
          id: item.variantId || 'v-default',
          productId: item.productId,
          size: item.size,
          color: item.color,
          colorCode: '#000000',
          stock: 999,
          sku: 'SKU',
        } as any,
        item.quantity
      );
      count++;
    });
    success(`Đã thêm ${count} sản phẩm của đơn #${order.orderCode} vào giỏ hàng`);
    navigate('/cart');
  };

  const handleOpenReturnModal = (order: Order) => {
    setReturnOrderModal(order);
    if (order.returnRequest) {
      setReturnType(order.returnRequest.type);
      setReturnReason(order.returnRequest.reason);
      setTargetSize(order.returnRequest.targetSize || 'L');
      if (order.returnRequest.bankInfo) {
        setBankName(order.returnRequest.bankInfo.bankName || POPULAR_BANKS[0]);
        setAccountNumber(order.returnRequest.bankInfo.accountNumber || '');
        setAccountHolder(order.returnRequest.bankInfo.accountHolder || '');
      }
      setReturnNote(order.returnRequest.note || '');
    } else {
      setReturnType('EXCHANGE_SIZE');
      setReturnReason(RETURN_SIZE_REASONS[0]);
      setCustomReturnReason('');
      const currentSize = order.items[0]?.size?.toUpperCase() || 'M';
      const defaultNextSize = currentSize === 'M' ? 'L' : currentSize === 'L' ? 'XL' : 'M';
      setTargetSize(defaultNextSize);
      setBankName(POPULAR_BANKS[0]);
      setAccountNumber('');
      setAccountHolder(order.customerName || user?.name || '');
      setReturnNote('');
    }
  };

  const handleCloseReturnModal = () => {
    setReturnOrderModal(null);
    setSubmittingReturn(false);
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderModal) return;

    let finalReason = returnReason;
    if (returnReason === 'Lý do khác (Nhập chi tiết bên dưới)') {
      if (!customReturnReason.trim()) {
        error('Vui lòng nhập chi tiết lý do bạn muốn đổi size hoặc hoàn tiền');
        return;
      }
      finalReason = customReturnReason.trim();
    }

    if (returnType === 'REFUND') {
      if (!accountNumber.trim()) {
        error('Vui lòng nhập số tài khoản ngân hàng để nhận tiền hoàn');
        return;
      }
      if (!accountHolder.trim()) {
        error('Vui lòng nhập tên chủ tài khoản nhận tiền hoàn');
        return;
      }
    }

    setSubmittingReturn(true);
    try {
      const payload = {
        type: returnType,
        reason: finalReason,
        targetSize: returnType === 'EXCHANGE_SIZE' ? targetSize : undefined,
        bankInfo: returnType === 'REFUND' ? {
          bankName,
          accountNumber: accountNumber.trim(),
          accountHolder: accountHolder.trim().toUpperCase(),
        } : undefined,
        note: returnNote.trim() || undefined,
      };

      const res = await api.orders.requestReturn(returnOrderModal.id, payload);
      if (res.success) {
        success(res.message || '🎉 Đã gửi yêu cầu thành công!');
        setOrders(prev =>
          prev.map(o =>
            o.id === returnOrderModal.id
              ? {
                  ...o,
                  orderStatus: 'RETURN_REQUESTED',
                  returnRequest: {
                    ...payload,
                    status: 'PENDING',
                    createdAt: new Date().toISOString(),
                  },
                }
              : o
          )
        );
        handleCloseReturnModal();
      } else {
        error(res.message || 'Không thể gửi yêu cầu');
      }
    } catch (err: any) {
      error(err.message || 'Lỗi gửi yêu cầu trả hàng / đổi size');
    } finally {
      setSubmittingReturn(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().replace(/^#/, '').trim().toLowerCase();
    return orders.filter(order => {
      const matchesStatus = activeTab === 'ALL' || (activeTab === 'RETURN_REQUESTED'
        ? order.orderStatus === 'RETURN_REQUESTED' || !!order.returnRequest
        : order.orderStatus === activeTab);
      return matchesStatus && (!query || order.orderCode.toLowerCase().includes(query));
    });
  }, [orders, activeTab, orderSearch]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-title text-2xl font-bold text-zinc-900">
          Vui Lòng Đăng Nhập
        </h2>
        <p className="text-xs text-zinc-500">
          Đăng nhập vào tài khoản để theo dõi lộ trình và lịch sử đơn hàng của bạn
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-md"
        >
          Đăng Nhập Ngay
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Chờ xác nhận
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
            <Check className="w-3 h-3" /> Đã xác nhận
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
            <Package className="w-3 h-3" /> Đang chuẩn bị hàng
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Truck className="w-3 h-3" /> Đang vận chuyển
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Giao thành công
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Đã hủy
          </span>
        );
      case 'RETURN_REQUESTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 shadow-2xs">
            <RotateCcw className="w-3 h-3 text-purple-600 animate-spin" /> Đổi Size / Trả Hàng
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-600">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-zinc-950">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Theo dõi tiến độ giao hàng, quản lý và hủy đơn hàng tiện lợi
          </p>
        </div>
        <Link
          to="/products"
          className="self-start sm:self-auto px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Tiếp Tục Mua Sắm
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="space-y-2">
        <label htmlFor="order-code-search" className="block text-sm font-semibold text-zinc-900">Tìm kiếm mã đơn hàng</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input id="order-code-search" type="search" value={orderSearch}
            onChange={event => setOrderSearch(event.target.value)}
            placeholder="Nhập mã đơn hàng, ví dụ MS-517292"
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
          {orderSearch && <button type="button" onClick={() => setOrderSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500 hover:text-zinc-950">Xóa</button>}
        </div>
        {orderSearch.trim() && !loading && <p role="status" className="text-xs text-zinc-500">Tìm thấy {filteredOrders.length} đơn hàng trong mục đang chọn.</p>}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-100 text-xs no-scrollbar">
        {[
          { label: 'Tất cả', value: 'ALL', count: orders.length },
          { label: 'Chờ xác nhận', value: 'PENDING', count: orders.filter(o => o.orderStatus === 'PENDING').length },
          { label: 'Đã xác nhận', value: 'CONFIRMED', count: orders.filter(o => o.orderStatus === 'CONFIRMED').length },
          { label: 'Đang vận chuyển', value: 'SHIPPING', count: orders.filter(o => o.orderStatus === 'SHIPPING').length },
          { label: 'Đã giao', value: 'DELIVERED', count: orders.filter(o => o.orderStatus === 'DELIVERED').length },
          { label: 'Đổi Size / Trả Hàng', value: 'RETURN_REQUESTED', count: orders.filter(o => o.orderStatus === 'RETURN_REQUESTED' || !!o.returnRequest).length },
          { label: 'Đã hủy', value: 'CANCELLED', count: orders.filter(o => o.orderStatus === 'CANCELLED').length },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.value
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-500">Đang tải lịch sử đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="font-bold text-base text-zinc-800">
            {orderSearch.trim() ? 'Không tìm thấy đơn hàng phù hợp' : activeTab === 'ALL'
              ? 'Bạn chưa có đơn hàng nào'
              : 'Không có đơn hàng nào trong mục này'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {orderSearch.trim() ? 'Kiểm tra lại mã đơn hàng hoặc chọn mục Tất cả để tìm trong mọi trạng thái.' : 'Khám phá bộ sưu tập thời trang cao cấp và đặt đơn hàng đầu tiên của bạn ngay hôm nay.'}
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold shadow-md hover:bg-zinc-800"
          >
            Mua Sắm Ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-zinc-950">
                      #{order.orderCode}
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {order.paymentMethod === 'COD'
                        ? 'Thanh toán COD'
                        : order.paymentMethod === 'BANK_TRANSFER'
                        ? 'Chuyển khoản VietQR'
                        : 'Thẻ / Cổng thanh toán trực tuyến'}
                    </span>
                  </div>

                  <div>{getStatusBadge(order.orderStatus)}</div>
                </div>

                {/* Items list */}
                <div className="divide-y divide-zinc-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-12 h-14 object-cover rounded-lg border border-zinc-100 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-zinc-900 line-clamp-1">{item.productName}</p>
                          <span className="text-[11px] text-zinc-500">
                            Size: {item.size} • Màu: {item.color} • x{item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0">
                        <span className="font-mono font-bold text-zinc-900">
                          {item.total.toLocaleString('vi-VN')}đ
                        </span>

                        {order.orderStatus !== 'CANCELLED' && (
                          reviewedMap[`${order.id}_${item.productId}`] ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              Đã đánh giá ({reviewedMap[`${order.id}_${item.productId}`]}★)
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenReviewModal(order.id, item)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                              title="Viết đánh giá & ghi chú cho sản phẩm này"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              Đánh Giá & Ghi Chú
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cancel notice if order is cancelled */}
                {order.orderStatus === 'CANCELLED' && (
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/60 text-xs text-rose-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Đơn hàng này đã được hủy</span>
                      {order.cancelReason && (
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          Lý do hủy: <strong>{order.cancelReason}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Return / Size exchange notice if requested */}
                {(order.returnRequest || order.orderStatus === 'RETURN_REQUESTED') && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/90 via-indigo-50/60 to-pink-50/50 border border-purple-200 text-xs text-purple-950 space-y-2.5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100/80 pb-2">
                      <div className="flex items-center gap-2 font-bold text-purple-900">
                        <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Shirt className="w-3.5 h-3.5" />
                        </div>
                        <span>
                          {order.returnRequest?.type === 'EXCHANGE_SIZE'
                            ? 'Yêu Cầu Đổi Size Mới Tận Nơi (Miễn Phí)'
                            : 'Yêu Cầu Trả Hàng & Hoàn Tiền 100%'}
                        </span>
                      </div>
                      <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        Đang Xử Lý • CSKH Đang Chuẩn Bị
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-purple-900/90">
                      {order.returnRequest?.type === 'EXCHANGE_SIZE' ? (
                        <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100/90">
                          <span className="text-purple-600 font-semibold block text-[10px]">Kích cỡ mới cần đổi:</span>
                          <span className="font-bold text-sm text-purple-950">Size {order.returnRequest?.targetSize || 'Mới'}</span>
                          <span className="block text-[10px] text-zinc-500 mt-0.5">Shipper giao tận nhà đổi trực tiếp 1-1</span>
                        </div>
                      ) : (
                        <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100/90">
                          <span className="text-purple-600 font-semibold block text-[10px]">Thông tin hoàn tiền:</span>
                          <span className="font-bold text-purple-950">
                            {order.returnRequest?.bankInfo?.bankName || 'Ngân hàng'}: {order.returnRequest?.bankInfo?.accountNumber}
                          </span>
                          <span className="block text-[10px] text-zinc-600">
                            Chủ TK: {order.returnRequest?.bankInfo?.accountHolder}
                          </span>
                        </div>
                      )}

                      <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100/90">
                        <span className="text-purple-600 font-semibold block text-[10px]">Lý do:</span>
                        <span className="font-medium text-zinc-800">{order.returnRequest?.reason}</span>
                        {order.returnRequest?.note && (
                          <span className="block text-[10px] text-zinc-500 mt-0.5 italic">
                            Ghi chú: "{order.returnRequest.note}"
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-purple-700 pt-1">
                      <span>⚡ Cam kết đổi hàng miễn phí 15 ngày • Đổi tận nơi không tốn công gửi hàng</span>
                      <a href="tel:0825764371" className="font-bold flex items-center gap-1 hover:underline text-purple-900">
                        <PhoneCall className="w-3 h-3" /> Hỗ trợ ưu tiên: 0825764371
                      </a>
                    </div>
                  </div>
                )}

                {/* Total & Action Footer */}
                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-zinc-500">Tổng thanh toán:</span>{' '}
                    <strong className="font-mono font-bold text-base text-rose-600">
                      {order.totalAmount.toLocaleString('vi-VN')}đ
                    </strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Return / Size Exchange Button */}
                    {order.orderStatus !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => handleOpenReturnModal(order)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
                          order.returnRequest || order.orderStatus === 'RETURN_REQUESTED'
                            ? 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        }`}
                        title="Đổi size nếu mang không vừa hoặc hoàn tiền 100%"
                      >
                        <Shirt className="w-3.5 h-3.5" />
                        {order.returnRequest || order.orderStatus === 'RETURN_REQUESTED'
                          ? 'Xem Chi Tiết Đổi/Trả'
                          : 'Trả Hàng / Đổi Size'}
                      </button>
                    )}

                    {/* Cancel Button if eligible */}
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleOpenCancelModal(order)}
                        className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                        title="Hủy đơn hàng này"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Hủy Đơn Hàng
                      </button>
                    )}

                    {/* Reorder Button if cancelled */}
                    {order.orderStatus === 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        title="Thêm lại sản phẩm vào giỏ hàng"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-zinc-700" /> Mua Lại Đơn Này
                      </button>
                    )}

                    {/* View Details Button */}
                    <Link
                      to={`/order-success/${order.orderCode}`}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem Chi Tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* POPUP MODAL HỦY ĐƠN HÀNG (GIỐNG SHOPEE / LAZADA / TIKI) */}
      {/* ============================================================ */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-950">
                    Xác Nhận Hủy Đơn Hàng
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Mã đơn: #{cancellingOrder.orderCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseCancelModal}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note alert */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              Vui lòng chọn lý do bạn muốn hủy đơn hàng. Thông tin này giúp Nguyên Fashion ghi nhận và hoàn thiện dịch vụ mua sắm tốt hơn.
            </div>

            {/* Reason Radio Options */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <label className="block text-xs font-bold text-zinc-800 mb-2">
                Chọn lý do hủy đơn: <span className="text-rose-500">*</span>
              </label>

              {CANCEL_REASONS.map(reason => (
                <label
                  key={reason}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all text-xs font-medium ${
                    selectedReason === reason
                      ? 'border-zinc-950 bg-zinc-50 font-bold text-zinc-950 shadow-2xs'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {/* If "Lý do khác" is selected */}
              {selectedReason === 'Lý do khác (Nhập chi tiết)' && (
                <div className="pt-2">
                  <textarea
                    rows={3}
                    required
                    value={customReasonText}
                    onChange={e => setCustomReasonText(e.target.value)}
                    placeholder="Vui lòng nhập chi tiết lý do bạn muốn hủy đơn hàng..."
                    className="w-full p-3 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseCancelModal}
                disabled={submittingCancel}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition-all cursor-pointer"
              >
                Không Hủy / Giữ Lại Đơn
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={submittingCancel}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submittingCancel ? (
                  <>Đang Hủy Đơn Hàng...</>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" /> Xác Nhận Hủy Đơn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* POPUP MODAL ĐÁNH GIÁ SẢN PHẨM & GHI CHÚ ĐƠN HÀNG */}
      {/* ============================================================ */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-950">
                    Đánh Giá Sản Phẩm & Ghi Chú
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Chia sẻ trải nghiệm thực tế để giúp người mua khác an tâm lựa chọn
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseReviewModal}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center gap-3">
              {reviewModalItem.item.imageUrl && (
                <img
                  src={reviewModalItem.item.imageUrl}
                  alt={reviewModalItem.item.productName}
                  className="w-12 h-14 object-cover rounded-xl border border-zinc-200 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-zinc-900 truncate">
                  {reviewModalItem.item.productName}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Phân loại: Size {reviewModalItem.item.size} • Màu {reviewModalItem.item.color}
                </p>
              </div>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-2">
                  Chất lượng sản phẩm & mức độ hài lòng:
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1.5 hover:scale-125 transition-transform cursor-pointer"
                        title={`${star} sao`}
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'text-zinc-200 hover:text-zinc-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {reviewRating === 5 && '⭐⭐⭐⭐⭐ Rất Hài Lòng • Chuẩn Đẹp'}
                    {reviewRating === 4 && '⭐⭐⭐⭐ Hài Lòng • Tốt'}
                    {reviewRating === 3 && '⭐⭐⭐ Bình Thường'}
                    {reviewRating === 2 && '⭐⭐ Chưa Hài Lòng'}
                    {reviewRating === 1 && '⭐ Rất Tệ'}
                  </span>
                </div>
              </div>

              {/* Review Comment / Note */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  Ghi chú & Nhận xét chi tiết của bạn: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Hãy chia sẻ cảm nhận thực tế về chất vải, độ dày dặn, form dáng, đường may và cảm giác mặc thực tế để người dùng khác tham khảo nhé..."
                  className="w-full p-3.5 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all font-medium leading-relaxed"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Đánh giá của bạn sẽ được hiển thị công khai kèm nhãn <strong>"✓ Đã mua hàng tại NGUYÊN Fashion"</strong>.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  disabled={submittingReview}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? (
                    <>Đang Gửi Đánh Giá...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" /> Xuất Bản Đánh Giá Ngay
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* POPUP MODAL ĐỔI SIZE TẬN NƠI / TRẢ HÀNG HOÀN TIỀN */}
      {/* ============================================================ */}
      {returnOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-950 flex items-center gap-2">
                    Đổi Size Tận Nơi / Trả Hàng Hoàn Tiền
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                      Miễn Phí 15 Ngày
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Đơn hàng #{returnOrderModal.orderCode} • Tổng tiền: {returnOrderModal.totalAmount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseReturnModal}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Policy Banner */}
            <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 rounded-2xl border border-purple-200/80 text-xs text-purple-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Chính sách hỗ trợ khi mặc không vừa size tại Nguyên Fashion:
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                Quý khách nhận hàng mặc không vừa (bị chật hoặc rộng)? Hãy chọn <strong>"Đổi size tận nơi"</strong> để shipper mang size vừa vặn đến tận nhà đổi trực tiếp cho bạn hoàn toàn <strong>miễn phí 100%</strong> mà không cần trả hàng phức tạp.
              </p>
            </div>

            {/* Items Summary in this Order */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Sản phẩm trong đơn:
              </span>
              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl p-2 bg-zinc-50/50 max-h-36 overflow-y-auto">
                {returnOrderModal.items.map((item, idx) => (
                  <div key={idx} className="py-1.5 px-1 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-9 h-10 object-cover rounded-lg border border-zinc-200 shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-bold text-zinc-900 line-clamp-1 text-[11px]">{item.productName}</p>
                        <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                          Size hiện tại: {item.size} • Màu: {item.color}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-600 font-semibold">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReturn} className="space-y-4">
              {/* Solution Type Selection (2 Cards) */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-2">
                  Chọn phương thức giải quyết mong muốn: <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setReturnType('EXCHANGE_SIZE')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      returnType === 'EXCHANGE_SIZE'
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-1 ring-purple-600'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          returnType === 'EXCHANGE_SIZE' ? 'bg-purple-600 text-white' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          <Shirt className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs text-zinc-950">Đổi Size Mới Tận Nơi</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Khuyên Dùng
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                      Shipper mang size mới tới tận nhà đổi trực tiếp 1-1, bạn thử vừa mới nhận. Miễn phí 100%.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReturnType('REFUND')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      returnType === 'REFUND'
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-1 ring-purple-600'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          returnType === 'REFUND' ? 'bg-purple-600 text-white' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs text-zinc-950">Trả Hàng & Hoàn Tiền</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        100% Tiền
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                      Thu hồi sản phẩm và hoàn tiền trực tiếp qua số tài khoản ngân hàng của bạn.
                    </p>
                  </button>
                </div>
              </div>

              {/* If Exchange Size: Select Target Size */}
              {returnType === 'EXCHANGE_SIZE' && (
                <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-200/70 space-y-2">
                  <label className="block text-xs font-bold text-purple-950">
                    Chọn kích cỡ mới bạn muốn đổi sang: <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {AVAILABLE_SIZES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTargetSize(s)}
                        className={`w-11 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          targetSize === s
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-600'
                            : 'bg-white text-zinc-700 border border-zinc-200 hover:border-purple-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-purple-700">
                    👉 Đang chọn đổi sang: <strong>Size {targetSize}</strong> (Shipper mang size này tận nhà đổi cho bạn).
                  </p>
                </div>
              )}

              {/* If Refund: Bank info input */}
              {returnType === 'REFUND' && (
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                  <label className="block text-xs font-bold text-zinc-900">
                    Thông tin tài khoản nhận hoàn tiền: <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <span className="text-[11px] text-zinc-500 font-medium block mb-1">Ngân hàng:</span>
                      <select
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                      >
                        {POPULAR_BANKS.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] text-zinc-500 font-medium block mb-1">Số tài khoản:</span>
                      <input
                        type="text"
                        required
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                        placeholder="Ví dụ: 1029384756..."
                        className="w-full p-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-500 font-medium block mb-1">Tên chủ tài khoản:</span>
                    <input
                      type="text"
                      required
                      value={accountHolder}
                      onChange={e => setAccountHolder(e.target.value)}
                      placeholder="Ví dụ: NGUYEN VAN A..."
                      className="w-full p-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold uppercase focus:ring-1 focus:ring-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Return Reason Radio Options */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-800">
                  Lý do yêu cầu: <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {RETURN_SIZE_REASONS.map(reason => (
                    <label
                      key={reason}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all text-xs ${
                        returnReason === reason
                          ? 'border-purple-600 bg-purple-50/60 font-bold text-purple-950'
                          : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="returnReason"
                        checked={returnReason === reason}
                        onChange={() => setReturnReason(reason)}
                        className="text-purple-600 focus:ring-0 cursor-pointer"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                {returnReason === 'Lý do khác (Nhập chi tiết bên dưới)' && (
                  <div className="pt-2">
                    <input
                      type="text"
                      required
                      value={customReturnReason}
                      onChange={e => setCustomReturnReason(e.target.value)}
                      placeholder="Nhập chi tiết lý do bạn muốn đổi/trả..."
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                    />
                  </div>
                )}
              </div>

              {/* Note / Body size advice */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  Ghi chú thêm & Chiều cao/Cân nặng (Để nhân viên chuẩn bị size chuẩn nhất):
                </label>
                <textarea
                  rows={2}
                  value={returnNote}
                  onChange={e => setReturnNote(e.target.value)}
                  placeholder="Ví dụ: Em cao 1m68 nặng 62kg, áo cũ mặc bị chật bắp tay và vai nên đổi sang size L giúp em nha shop. Shipper ghé buổi chiều nhé..."
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseReturnModal}
                  disabled={submittingReturn}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={submittingReturn}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingReturn ? (
                    <>Đang Gửi Yêu Cầu...</>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      {returnType === 'EXCHANGE_SIZE'
                        ? 'Gửi Yêu Cầu Đổi Size Tận Nơi'
                        : 'Gửi Yêu Cầu Hoàn Tiền'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
