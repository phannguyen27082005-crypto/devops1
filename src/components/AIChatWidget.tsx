import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Ticket,
  Ruler,
  RotateCcw,
  MapPin,
  Package,
  PhoneCall,
  Minimize2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
}

export const AIChatWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tên hiển thị của khách hàng
  const customerName = isAuthenticated && user?.name ? user.name : '';
  const customerShortName = customerName ? customerName.split(' ').slice(-1)[0] : '';

  // Khởi tạo tin nhắn chào mừng cá nhân hóa
  const getWelcomeGreeting = () => {
    const timeGreeting = new Date().getHours() < 12 ? 'buổi sáng' : new Date().getHours() < 18 ? 'buổi chiều' : 'buổi tối';
    if (customerName) {
      return `Dạ em chào anh/chị ${customerName} ạ! ✨ Chúc anh/chị một ${timeGreeting} vui vẻ và tràn đầy năng lượng!\n\nEm là Trợ lý AI Chăm Sóc Khách Hàng của NGUYÊN Fashion. Em luôn túc trực 24/7 để hỗ trợ anh/chị khi đội ngũ bận rộn. Anh/chị cần em tư vấn chọn size, săn mã giảm giá hay kiểm tra thông tin gì hôm nay ạ?`;
    }
    return `Dạ em chào Quý khách ạ! ✨ Chúc bạn một ${timeGreeting} an lành và nhiều niềm vui!\n\nEm là Trợ lý AI Chăm Sóc Khách Hàng của NGUYÊN Fashion. Em có thể hỗ trợ tư vấn chọn size chuẩn, tìm kiếm mẫu áo/quần/váy phù hợp, hoặc giải đáp chính sách đổi trả & khuyến mãi cho mình ngay ạ!`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Tự động khởi tạo hoặc cập nhật lời chào khi mở chat hoặc khi đăng nhập
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome_1',
      sender: 'ai',
      text: getWelcomeGreeting(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '🏷️ Mã giảm giá hiện có',
        '📏 Tư vấn chọn size chuẩn',
        '📦 Tra cứu đơn hàng của tôi',
        '🔄 Chính sách đổi trả hàng',
        '📍 Địa chỉ cửa hàng & Hotline',
      ],
    };
    setMessages([welcomeMsg]);
  }, [customerName]);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, isTyping]);

  // Trả lời thông minh theo ngữ cảnh
  const generateAIResponse = (query: string): { reply: string; suggestions?: string[] } => {
    const q = query.toLowerCase();
    const prefix = customerShortName ? `Dạ anh/chị ${customerShortName} ơi, ` : 'Dạ quý khách ơi, ';

    // 1. Chào hỏi
    if (q.includes('chào') || q.includes('hello') || q.includes('hi ') || q === 'hi') {
      return {
        reply: `${prefix}em rất vui được hỗ trợ mình ạ! Anh/chị cần em tư vấn mẫu thời trang nào (Áo, Quần, Váy, Áo Khoác) hay cần hướng dẫn chọn size chuẩn người Việt ạ?`,
        suggestions: ['📏 Tư vấn chọn size chuẩn', '🏷️ Mã giảm giá hiện có', '🧥 Xem bộ sưu tập mới'],
      };
    }

    // 2. Mã giảm giá / Khuyến mãi / Voucher
    if (q.includes('mã') || q.includes('voucher') || q.includes('khuyến mãi') || q.includes('sale') || q.includes('giảm giá')) {
      return {
        reply: `${prefix}NGUYÊN Fashion hiện đang áp dụng các mã ưu đãi độc quyền cực HOT sau ạ:\n\n` +
          `🎁 Mã: WELCOME50 - Giảm ngay 50.000đ cho đơn hàng từ 399.000đ.\n` +
          `🔥 Mã: MAISON10 - Giảm 10% trên toàn bộ tổng giá trị đơn hàng.\n` +
          `👑 Mã: VIP100 - Giảm ngay 100.000đ cho đơn hàng từ 1.000.000đ.\n` +
          `🚚 MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC cho mọi đơn hàng từ 500.000đ trở lên ạ!\n\n` +
          `Anh/chị chỉ cần nhập mã tại bước Thanh Toán (Checkout) là được giảm trừ trực tiếp ngay nhé!`,
        suggestions: ['🛒 Hướng dẫn mua hàng', '📦 Phí vận chuyển bao nhiêu?'],
      };
    }

    // 3. Tư vấn chọn size
    if (q.includes('size') || q.includes('chiều cao') || q.includes('cân nặng') || q.includes('nặng') || q.includes('cao') || q.includes('kg')) {
      // Nhận diện số kg hoặc cm nếu có
      const kgMatch = q.match(/(\d{2,3})\s*(kg|kí|cân)/);

      let sizeAdvice = '';
      if (kgMatch) {
        const weight = parseInt(kgMatch[1], 10);
        if (weight < 53) sizeAdvice = `Với cân nặng khoảng ${weight}kg, form người mình mặc chuẩn nhất là **Size S** (dáng ôm vừa) hoặc **Size M** (dáng suông thoải mái) ạ.`;
        else if (weight <= 63) sizeAdvice = `Với cân nặng khoảng ${weight}kg, form người mình vừa vặn nhất là **Size M** ạ.`;
        else if (weight <= 73) sizeAdvice = `Với cân nặng khoảng ${weight}kg, anh/chị chọn **Size L** là cực kỳ chuẩn form và tôn dáng ạ.`;
        else if (weight <= 83) sizeAdvice = `Với cân nặng khoảng ${weight}kg, anh/chị chọn **Size XL** mặc vừa vặn, thoải mái cử động nhé ạ.`;
        else sizeAdvice = `Với cân nặng từ ${weight}kg trở lên, anh/chị chọn **Size XXL** để mặc rộng rãi, thoáng mát nhất ạ.`;
      }

      return {
        reply: `${prefix}${sizeAdvice ? sizeAdvice + '\n\n' : ''}` +
          `Bảng quy đổi size chuẩn tại NGUYÊN Fashion:\n` +
          `• Size S: Dưới 53kg | Cao 1m50 - 1m62\n` +
          `• Size M: 53 - 63kg | Cao 1m60 - 1m70\n` +
          `• Size L: 63 - 73kg | Cao 1m68 - 1m76\n` +
          `• Size XL: 73 - 83kg | Cao 1m74 - 1m82\n` +
          `• Size XXL: Trên 83kg | Cao trên 1m80\n\n` +
          `Chất liệu vải cao cấp đều có độ co giãn nhẹ và thoáng mát. Nếu anh/chị thích mặc form oversize rộng rãi thì có thể tăng thêm 1 size nha!`,
        suggestions: ['🔄 Nếu không vừa có được đổi không?', '🏷️ Mã giảm giá hiện có'],
      };
    }

    // 4. Chính sách đổi trả
    if (q.includes('đổi') || q.includes('trả') || q.includes('bảo hành') || q.includes('hoàn tiền')) {
      return {
        reply: `${prefix}NGUYÊN Fashion áp dụng chính sách chăm sóc khách hàng hàng đầu:\n\n` +
          `✨ **ĐỔI TRẢ MIỄN PHÍ TRONG 15 NGÀY** kể từ khi nhận hàng.\n` +
          `✨ Đổi size hoặc đổi mẫu tận nơi: Shipper sẽ mang sản phẩm mới đến tận nhà đổi cho anh/chị, không cần ra bưu cục.\n` +
          `✨ Điều kiện: Sản phẩm còn nguyên tem mác, chưa qua giặt ủi hoặc sử dụng.\n` +
          `✨ Nếu sản phẩm có lỗi từ nhà sản xuất, bên em sẽ đổi mới 100% hoặc hoàn tiền ngay trong ngày ạ!`,
        suggestions: ['📞 Số hotline hỗ trợ đổi hàng', '📦 Tra cứu đơn hàng của tôi'],
      };
    }

    // 5. Đơn hàng / Vận chuyển / Tra cứu
    if (q.includes('đơn hàng') || q.includes('vận chuyển') || q.includes('giao hàng') || q.includes('ship') || q.includes('tra cứu') || q.includes('hủy đơn')) {
      return {
        reply: `${prefix}về đơn hàng và thời gian giao hàng:\n\n` +
          `🚀 **Thời gian giao hàng:**\n` +
          `• Nội thành Đà Nẵng, TP.HCM, Hà Nội: 1 - 2 ngày làm việc.\n` +
          `• Các tỉnh thành khác trên toàn quốc: 2 - 3 ngày làm việc.\n\n` +
          `📦 **Tra cứu đơn hàng:**\n` +
          `Anh/chị chỉ cần bấm vào nút **[Lịch Sử Đơn]** ở thanh menu trên cùng (hoặc vào mục Lịch sử đơn hàng trong tài khoản) để xem lộ trình, trạng thái vận chuyển và có thể bấm Hủy đơn hàng tự động nếu đổi ý ạ!`,
        suggestions: ['📦 Vào trang Tra cứu đơn hàng', '🔄 Chính sách đổi trả hàng'],
      };
    }

    // 6. Showroom / Địa chỉ / Hotline / Liên hệ
    if (q.includes('địa chỉ') || q.includes('ở đâu') || q.includes('showroom') || q.includes('cửa hàng') || q.includes('hotline') || q.includes('liên hệ') || q.includes('sđt') || q.includes('điện thoại')) {
      return {
        reply: `${prefix}thông tin liên hệ chính thức của NGUYÊN Fashion:\n\n` +
          `📍 **Showroom Flagship:** 134 Nguyễn Đăng Đạo, Phường Hòa Cường Bắc, Quận Cẩm Lệ, TP. Đà Nẵng.\n` +
          `📞 **Hotline CSKH:** 0825 764 371 (Hỗ trợ 08:30 - 22:00 tất cả các ngày trong tuần).\n` +
          `✉️ **Email CSKH:** phannguyen27082005@gmail.com\n\n` +
          `Cửa hàng có chỗ đậu ô tô rộng rãi, phòng thử đồ VIP và luôn có nhân viên chào đón anh/chị chu đáo ạ!`,
        suggestions: ['🏷️ Mã giảm giá hiện có', '📏 Bảng size chi tiết'],
      };
    }

    // 7. Chất liệu & Xuất xứ sản phẩm
    if (q.includes('chất liệu') || q.includes('vải') || q.includes('xuất xứ') || q.includes('bền') || q.includes('giặt')) {
      return {
        reply: `${prefix}tất cả sản phẩm tại NGUYÊN Fashion đều được may từ các dòng chất liệu dệt tự nhiên cao cấp:\n\n` +
          `🌿 **Organic Cotton 100%:** Thấm hút mồ hôi tối đa, mềm mịn và êm ái cho làn da.\n` +
          `🌿 **Lụa Tơ Tằm & Cashmere:** Mềm rủ sang trọng, giữ form đứng dáng, không xù lông.\n` +
          `🌿 **Vải Linen Pháp & Wool:** Đẹp tự nhiên, thoáng mát mùa hè, ấm áp mùa đông.\n\n` +
          `Từng đường kim mũi chỉ đều được hoàn thiện bởi đội ngũ nghệ nhân may lành nghề với tiêu chuẩn xuất khẩu cao cấp nhất ạ!`,
        suggestions: ['📏 Tư vấn chọn size', '🏷️ Mã giảm giá hiện có'],
      };
    }

    // 8. Mặc định / Câu hỏi tự do
    return {
      reply: `${prefix}em đã ghi nhận câu hỏi của mình ạ! Hiện tại chủ shop đang bận một chút, nhưng em (AI CSKH) đã lưu lại yêu cầu này.\n\n` +
        `Để được hỗ trợ nhanh nhất ngay lập tức, anh/chị có thể gọi trực tiếp Hotline **0825 764 371** hoặc chọn các chủ đề nhanh bên dưới để em giải đáp chi tiết cho mình nhé ạ! ✨`,
      suggestions: [
        '📏 Tư vấn chọn size chuẩn',
        '🏷️ Mã giảm giá hiện có',
        '🔄 Chính sách đổi trả hàng',
        '📍 Địa chỉ cửa hàng & Hotline',
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Mô phỏng AI suy nghĩ và phản hồi tự nhiên (600ms)
    setTimeout(() => {
      const response = generateAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      if (!isOpen) setHasUnread(true);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 1. Nút Chat Nổi Tròn ở góc dưới bên phải */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Tooltip Chào Mời khi thu nhỏ */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-zinc-200 text-xs font-semibold text-zinc-800 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all animate-bounce duration-1000 group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {customerShortName ? `Chào ${customerShortName}! Em hỗ trợ được gì ạ?` : 'Chat với Trợ Lý AI NGUYÊN ✨'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
          </div>
        )}

        {/* Nút Tròn Mở Widget */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
          }}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
            isOpen
              ? 'bg-zinc-900 text-white rotate-90 scale-95 border border-zinc-700'
              : 'bg-zinc-950 text-white hover:scale-110 active:scale-95 border-2 border-amber-300/40 hover:border-amber-300 shadow-zinc-950/40'
          }`}
          title="Trợ Lý AI Chăm Sóc Khách Hàng 24/7"
          aria-label="Mở khung chat hỗ trợ AI"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-amber-200" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse"></span>
            </div>
          )}

          {/* Badge thông báo chưa đọc */}
          {!isOpen && hasUnread && (
            <span className="absolute -top-1 -left-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white animate-ping"></span>
          )}
        </button>
      </div>

      {/* 2. Khung Cửa Sổ Chat (Popup Chat Window) */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[550px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-zinc-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 backdrop-blur-xl">
          {/* Header Khung Chat */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-4 flex items-center justify-between border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-zinc-950"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-zinc-100 tracking-tight">Trợ Lý AI NGUYÊN</span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded-md font-extrabold uppercase border border-amber-400/30">
                    AI CSKH 24/7
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Trực tuyến • Sẵn sàng giải đáp
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                title="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Banner Chào Đón Khách Hàng (Tên riêng) */}
          {customerName && (
            <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
              <div className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Chào mừng <strong>{customerName}</strong></span>
              </div>
              <span className="text-[10px] bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                Khách Hàng Thân Thiết
              </span>
            </div>
          )}

          {/* Vùng Tin Nhắn (Scrollable Messages Area) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fcfcfd]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar người gửi */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      msg.sender === 'user'
                        ? 'bg-zinc-950 text-white shadow-sm'
                        : 'bg-zinc-900 text-amber-300 border border-zinc-700'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      customerShortName ? customerShortName[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Nội dung tin nhắn */}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-zinc-950 text-white rounded-tr-xs'
                        : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {/* Thời gian gửi */}
                <span className="text-[10px] text-zinc-400 mt-1 px-9">{msg.time}</span>

                {/* Các nút gợi ý nhanh bên dưới tin nhắn AI */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-9 max-w-[95%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-black rounded-full text-[11px] font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator khi AI đang phản hồi */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-zinc-900 text-amber-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-zinc-200 px-3 py-2 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                  <span className="text-[10px] text-zinc-400 font-medium ml-1">AI đang soạn câu trả lời...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Thanh Gợi Ý Nhanh Cố Định (Quick Bar) */}
          <div className="bg-white border-t border-zinc-100 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => handleSendMessage('Mã giảm giá đang có')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Ticket className="w-3 h-3 text-amber-600" /> Mã giảm giá
            </button>
            <button
              onClick={() => handleSendMessage('Tư vấn chọn size')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Ruler className="w-3 h-3 text-blue-600" /> Chọn size
            </button>
            <button
              onClick={() => handleSendMessage('Chính sách đổi trả')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-emerald-600" /> Đổi trả 15 ngày
            </button>
            <button
              onClick={() => handleSendMessage('Tra cứu đơn hàng')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Package className="w-3 h-3 text-amber-600" /> Đơn hàng
            </button>
            <button
              onClick={() => handleSendMessage('Địa chỉ showroom và hotline')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 text-rose-600" /> Hotline
            </button>
          </div>

          {/* Ô Nhập Tin Nhắn (Chat Input) */}
          <div className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={customerShortName ? `Hỏi AI bất kỳ điều gì, ${customerShortName} ơi...` : 'Hỏi AI về size, mã giảm giá, đổi trả...'}
              className="flex-1 px-3.5 py-2.5 bg-zinc-100 border border-zinc-200 focus:border-zinc-950 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all font-medium"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                inputText.trim()
                  ? 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm active:scale-95'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
              title="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
