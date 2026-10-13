import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, QrCode, ArrowRight, Package, Home, Copy, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const OrderSuccessPage: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [loading, setLoading] = useState(!order);
  const [copied, setCopied] = useState(false);
  const [qrType, setQrType] = useState<'uploaded' | 'dynamic'>('uploaded');

  const { success } = useNotification();

  useEffect(() => {
    if (!order && orderCode) {
      const fetchOrder = async () => {
        try {
          const res = await api.orders.getByCode(orderCode);
          if (res.success && res.data) {
            setOrder(res.data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderCode, order]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    success('Đã sao chép vào bộ nhớ tạm');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-zinc-500 text-xs">
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-zinc-700 font-semibold">Không tìm thấy thông tin đơn hàng #{orderCode}</p>
        <Link to="/" className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold inline-block">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  const dynamicQrUrl = `https://api.vietqr.io/image/970422-6000270805-compact.jpg?accountName=PHAN%20NHAT%20NGUYEN&amount=${order.totalAmount}&addInfo=NF%20${order.orderCode}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-zinc-950">
          Đặt Hàng Thành Công!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
          Cảm ơn bạn đã tin tưởng lựa chọn Nguyên Fashion. Mã đơn hàng của bạn là{' '}
          <strong className="text-zinc-950 font-mono">#{order.orderCode}</strong>
        </p>
      </div>

      {/* Online Card / Wallet Payment Success Banner */}
      {order.paymentMethod === 'VNPAY' && (
        <div className="bg-gradient-to-r from-blue-950 via-zinc-950 to-neutral-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl space-y-4 border border-blue-900/40">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/40 text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Đã Xác Nhận Thanh Toán Trực Tuyến Qua Thẻ / Ví Điện Tử
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold">
                  Thành Công
                </span>
              </h3>
              <span className="text-[11px] text-zinc-400">Giao dịch được xử lý an toàn qua tiêu chuẩn bảo mật PCI-DSS 256-bit</span>
            </div>
          </div>
          <div className="text-xs text-zinc-300 space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-zinc-400">Phương thức:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Thẻ Quốc Tế / ATM Nội Địa / Ví Điện Tử
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-zinc-400">Số tiền đã ghi nhận:</span>
              <span className="font-mono font-bold text-base text-emerald-400">
                {order.totalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer Instructions if Selected */}
      {order.paymentMethod === 'BANK_TRANSFER' && order.paymentStatus !== 'PAID' && (
        <div className="bg-zinc-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl space-y-5 border border-zinc-800">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  Quét Mã VietQR MB Bank (24/7)
                </h3>
                <span className="text-[11px] text-zinc-400">Chuyển khoản liên ngân hàng 24/7 nhận tức thì</span>
              </div>
            </div>

            {/* Toggle QR mode */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setQrType('uploaded')}
                className={`px-3 py-1 rounded-lg font-medium transition-all text-[11px] ${
                  qrType === 'uploaded'
                    ? 'bg-zinc-800 text-white shadow-xs font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Mã QR MBBank gốc
              </button>
              <button
                type="button"
                onClick={() => setQrType('dynamic')}
                className={`px-3 py-1 rounded-lg font-medium transition-all text-[11px] ${
                  qrType === 'dynamic'
                    ? 'bg-zinc-800 text-white shadow-xs font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Mã QR sẵn số tiền
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* QR Image */}
            <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-zinc-200">
              <div className="relative group flex items-center justify-center">
                <img
                  src={qrType === 'uploaded' ? '/vietqr.png' : dynamicQrUrl}
                  alt="VietQR MB Bank Payment"
                  className="w-52 max-h-72 object-contain rounded-xl"
                  onError={e => {
                    // Fallback to static qr if dynamic fails
                    if (qrType === 'dynamic') {
                      (e.target as HTMLImageElement).src = '/vietqr.png';
                    }
                  }}
                />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-zinc-800 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>MB Bank • PHAN NHAT NGUYEN</span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-0.5">
                {qrType === 'uploaded'
                  ? 'Quét bằng ứng dụng MB Bank hoặc mọi App Ngân Hàng'
                  : 'Mã đã tích hợp sẵn số tiền và mã đơn'}
              </span>
            </div>

            {/* Manual details */}
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <span className="text-zinc-400 block text-[11px] mb-0.5">Ngân hàng:</span>
                <strong className="text-white text-xs flex items-center gap-1.5">
                  <span className="text-rose-500">★</span> MB Bank (Ngân hàng TMCP Quân Đội)
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block text-[11px] mb-0.5">Số tài khoản (STK):</span>
                  <strong className="font-mono text-base text-emerald-400 font-bold tracking-wider">
                    6000270805
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('6000270805')}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white flex items-center gap-1.5 text-[11px] font-medium transition-colors"
                  title="Sao chép STK"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <span className="text-zinc-400 block text-[11px] mb-0.5">Chủ tài khoản:</span>
                <strong className="text-white uppercase font-bold tracking-wider">
                  PHAN NHAT NGUYEN
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block text-[11px] mb-0.5">Số tiền thanh toán:</span>
                  <strong className="font-mono text-base text-white font-bold">
                    {order.totalAmount.toLocaleString('vi-VN')}đ
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(String(order.totalAmount))}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                >
                  Sao chép tiền
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block text-[11px] mb-0.5">Nội dung chuyển khoản (bắt buộc):</span>
                  <strong className="font-mono text-xs bg-zinc-950 px-2.5 py-1 rounded-md text-amber-300 border border-zinc-700 inline-block font-bold">
                    NF {order.orderCode}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`NF ${order.orderCode}`)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                >
                  Sao chép
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 italic pt-2 border-t border-zinc-800 flex items-center gap-1.5">
            <span>⚡</span> Sau khi chuyển khoản, hệ thống sẽ tự động đối soát và xác nhận đơn hàng trong vòng 2-5 phút.
          </p>
        </div>
      )}

      {/* Order Details Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-zinc-950 border-b border-zinc-100 pb-3">
          Thông Tin Chi Tiết Đơn Hàng
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-zinc-400 block">Người nhận hàng:</span>
            <p className="font-bold text-zinc-900">{order.customerName}</p>
            <p className="text-zinc-600">{order.customerPhone}</p>
            <p className="text-zinc-600">{order.customerEmail}</p>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-400 block">Địa chỉ giao hàng:</span>
            <p className="text-zinc-900 font-medium">{order.shippingAddress}</p>
            <p className="text-zinc-600">
              {[order.ward, order.district, order.province].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>

        {/* Ordered items */}
        <div className="pt-4 border-t border-zinc-100 space-y-3">
          <span className="text-xs font-bold text-zinc-900 block">Sản phẩm đã đặt:</span>
          <div className="divide-y divide-zinc-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-10 h-12 rounded-lg object-cover border border-zinc-200"
                    />
                  )}
                  <div>
                    <p className="font-bold text-zinc-900">{item.productName}</p>
                    <p className="text-[11px] text-zinc-500">
                      Size: {item.size} • Màu: {item.color} • SL: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-zinc-900">
                  {item.total.toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total price */}
        <div className="pt-4 border-t border-zinc-200 flex justify-between items-baseline text-xs">
          <span className="font-bold text-sm text-zinc-950">Tổng thanh toán:</span>
          <span className="font-mono font-extrabold text-xl text-rose-600">
            {order.totalAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/profile/orders"
          className="w-full sm:w-auto px-6 py-3 bg-white border border-zinc-300 hover:border-zinc-900 text-zinc-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Package className="w-4 h-4" /> Xem Lịch Sử Đơn Hàng
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-8 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
        >
          Tiếp Tục Mua Sắm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
