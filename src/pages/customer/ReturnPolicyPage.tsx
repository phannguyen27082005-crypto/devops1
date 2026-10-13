import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, CheckCircle2, Clock, Truck, PhoneCall, ArrowRight, HelpCircle } from 'lucide-react';

export const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
          <RotateCcw className="w-3.5 h-3.5" /> An Tâm Tuyệt Đối Khi Mua Sắm
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-zinc-950">
          Chính Sách Đổi Trả & Bảo Hành
        </h1>
        <p className="text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
          Nguyên Fashion cam kết mang lại trải nghiệm mua sắm hoàn hảo nhất với chính sách đổi trả hàng tận nơi nhanh chóng trong vòng 15 ngày.
        </p>
      </div>

      {/* 3 Cam kết nổi bật */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-950 font-extrabold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-zinc-950">15 Ngày Đổi Trả</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Hỗ trợ đổi size, đổi màu hoặc đổi mẫu khác trong vòng 15 ngày kể từ khi nhận kiện hàng.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-950 font-extrabold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-zinc-950">Đổi Tận Nhà Tiện Lợi</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Shipper mang hàng mới đến đổi và nhận lại hàng cũ ngay tại nhà bạn, không cần ra bưu cục.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-950 font-extrabold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-zinc-950">100% Miễn Phí Đổi Size</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Khách hàng được hỗ trợ đổi size lần đầu hoàn toàn miễn phí cước vận chuyển 2 chiều.
          </p>
        </div>
      </div>

      {/* Điều kiện đổi trả */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 1. Điều Kiện Áp Dụng Đổi Trả
        </h2>
        <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 mt-2 shrink-0"></span>
            <span>Sản phẩm còn nguyên tem, mác giá, hóa đơn mua hàng và bao bì đóng gói ban đầu.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 mt-2 shrink-0"></span>
            <span>Sản phẩm chưa qua giặt ủi, không có mùi lạ (nước hoa, mỹ phẩm, cơ thể), không bị dính bẩn hay hư hại.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 mt-2 shrink-0"></span>
            <span>Đơn hàng được yêu cầu đổi trả trong vòng <strong>15 ngày</strong> tính từ ngày hệ thống xác nhận giao hàng thành công.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 mt-2 shrink-0"></span>
            <span>Trường hợp sản phẩm có lỗi từ nhà sản xuất (rách chỉ, phai màu, sai lệch kích thước...), Nguyên Fashion chịu 100% chi phí đổi mới.</span>
          </li>
        </ul>

        <div className="border-t border-zinc-100 pt-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 2. Quy Trình 3 Bước Đổi Trả Nhanh Chóng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <span className="font-extrabold text-xs text-rose-600">BƯỚC 1</span>
              <h4 className="font-bold text-zinc-900">Liên hệ yêu cầu đổi</h4>
              <p className="text-zinc-600 text-xs">
                Gọi Hotline <strong>0825 764 371</strong> hoặc vào mục <strong>Lịch Sử Đơn Hàng</strong> để gửi yêu cầu hỗ trợ.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <span className="font-extrabold text-xs text-rose-600">BƯỚC 2</span>
              <h4 className="font-bold text-zinc-900">Xác nhận & Giao hàng mới</h4>
              <p className="text-zinc-600 text-xs">
                Chuyên viên CSKH xác nhận size/mẫu mới và điều phối shipper mang hàng đổi đến tận nhà bạn trong 1 - 3 ngày.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <span className="font-extrabold text-xs text-rose-600">BƯỚC 3</span>
              <h4 className="font-bold text-zinc-900">Đổi hàng tận tay</h4>
              <p className="text-zinc-600 text-xs">
                Bạn nhận sản phẩm mới và giao lại sản phẩm cần đổi cho shipper là xong, cực kỳ nhanh chóng và an tâm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin hỗ trợ */}
      <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-serif-title text-xl sm:text-2xl font-bold">Cần hỗ trợ đổi hàng ngay bây giờ?</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Liên hệ hotline hỗ trợ đổi hàng tận nơi: <strong>0825 764 371</strong> hoặc mang trực tiếp đến showroom tại <strong>134 Nguyễn Đăng Đạo, Cẩm Lệ, TP. Đà Nẵng</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <a
            href="tel:0825764371"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg"
          >
            <PhoneCall className="w-4 h-4" /> Gọi 0825 764 371
          </a>
          <Link
            to="/orders"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-zinc-700"
          >
            Kiểm tra đơn hàng <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
