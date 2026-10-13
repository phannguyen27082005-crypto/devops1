import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle, PhoneCall, ArrowRight } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Tiêu Chuẩn Bảo Mật Quốc Tế SSL 256-Bit
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-zinc-950">
          Chính Sách Bảo Mật Thông Tin Khách Hàng
        </h1>
        <p className="text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
          Nguyên Fashion Studio hiểu rằng việc bảo vệ thông tin cá nhân của bạn là ưu tiên hàng đầu. Chúng tôi cam kết tuyệt đối bảo mật và minh bạch trong mọi hoạt động xử lý dữ liệu.
        </p>
      </div>

      {/* 4 Trụ Cột Bảo Mật */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-2.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900">Mã Hóa Dữ Liệu Toàn Diện</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Mọi thông tin giao dịch, số điện thoại, địa chỉ và dữ liệu thẻ thanh toán đều được mã hóa theo giao thức chuẩn SSL 256-bit an toàn cao cấp nhất.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-2.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold">
            <EyeOff className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900">Không Chia Sẻ Cho Bên Thứ Ba</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Tuyệt đối không bao giờ chia sẻ, bán hay tiết lộ danh sách thông tin khách hàng cho bất kỳ tổ chức thương mại hay bên thứ ba nào vì mục đích quảng cáo.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-2.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900">Minh Bạch Mục Đích Thu Thập</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Dữ liệu cá nhân chỉ được sử dụng cho mục đích duy nhất: xử lý đơn hàng, giao nhận bưu kiện và hỗ trợ chăm sóc khách hàng sau bán hàng.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-2.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900">Quyền Kiểm Soát Của Khách Hàng</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Bạn có toàn quyền truy cập, chỉnh sửa hoặc yêu cầu xóa bỏ hoàn toàn thông tin tài khoản của mình khỏi hệ thống bất cứ lúc nào.
          </p>
        </div>
      </div>

      {/* Chi tiết điều khoản */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-sm text-xs sm:text-sm text-zinc-600 leading-relaxed">
        <div className="space-y-2">
          <h3 className="font-bold text-base text-zinc-950">1. Thông tin thu thập bao gồm</h3>
          <p>
            Khi bạn đặt hàng hoặc tạo tài khoản tại website Nguyên Fashion, hệ thống chỉ thu thập các thông tin tối thiểu cần thiết: Họ và tên, Số điện thoại nhận hàng, Địa chỉ giao hàng, Email (tùy chọn) và ghi chú giao hàng.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-base text-zinc-950">2. Phạm vi sử dụng thông tin</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Giao hàng tận tay khách hàng thông qua đơn vị vận chuyển đối tác uy tín.</li>
            <li>Gửi thông báo cập nhật hành trình và trạng thái giao hàng của đơn.</li>
            <li>Liên hệ giải quyết các yêu cầu đổi size, bảo hành hoặc khiếu nại phát sinh.</li>
            <li>Gửi mã ưu đãi độc quyền (chỉ áp dụng khi bạn chủ động đăng ký nhận bản tin).</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-base text-zinc-950">3. Đơn vị chịu trách nhiệm quản lý thông tin</h3>
          <p>
            <strong>Thương hiệu:</strong> NGUYÊN FASHION STUDIO VIETNAM<br />
            <strong>Địa chỉ:</strong> 134 Nguyễn Đăng Đạo, Cẩm Lệ, TP. Đà Nẵng<br />
            <strong>Hotline hỗ trợ:</strong> 0825 764 371 (08:30 - 22:00)<br />
            <strong>Email:</strong> phannguyen27082005@gmail.com
          </p>
        </div>
      </div>

      {/* Footer Support */}
      <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-serif-title text-xl sm:text-2xl font-bold">Bạn có thắc mắc về quyền riêng tư?</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Nếu bạn có bất kỳ câu hỏi hoặc muốn xóa dữ liệu tài khoản, hãy liên hệ ngay với chúng tôi để được xử lý ngay lập tức.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <a
            href="tel:0825764371"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg"
          >
            <PhoneCall className="w-4 h-4" /> 0825 764 371
          </a>
          <Link
            to="/contact"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-zinc-700"
          >
            Gửi phản hồi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
