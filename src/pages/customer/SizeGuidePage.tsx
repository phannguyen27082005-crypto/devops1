import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, Check, HelpCircle, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';

export const SizeGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shirt' | 'pants' | 'dress' | 'jacket'>('shirt');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-200">
          <Ruler className="w-3.5 h-3.5 text-zinc-600" /> Bảng Thông Số May Đo Chuẩn
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-zinc-950">
          Hướng Dẫn Chọn Kích Thước (Size Guide)
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Form dáng thiết kế tại Nguyên Fashion được nghiên cứu theo chỉ số nhân trắc học người Việt, mang lại sự vừa vặn, thoải mái và tôn dáng tối ưu trong mọi hoạt động hàng ngày.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-zinc-200 pb-4">
        {[
          { key: 'shirt', label: 'Áo Thun, Polo & Sơ Mi' },
          { key: 'pants', label: 'Quần Tây, Kaki & Jeans' },
          { key: 'dress', label: 'Váy & Đầm Nữ' },
          { key: 'jacket', label: 'Áo Khoác & Blazer' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-zinc-950 text-white shadow-md'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-6">
        {activeTab === 'shirt' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-950"></span> Bảng Quy Đổi Size Áo (Thun, Polo, Sơ Mi)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-100/80 text-zinc-900 border-b border-zinc-200">
                    <th className="py-3 px-4 font-bold">Size</th>
                    <th className="py-3 px-4 font-bold">Chiều Cao (cm)</th>
                    <th className="py-3 px-4 font-bold">Cân Nặng (kg)</th>
                    <th className="py-3 px-4 font-bold">Vòng Ngực (cm)</th>
                    <th className="py-3 px-4 font-bold">Dài Áo (cm)</th>
                    <th className="py-3 px-4 font-bold">Rộng Vai (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">S</td>
                    <td className="py-3 px-4">150 - 160</td>
                    <td className="py-3 px-4">45 - 53</td>
                    <td className="py-3 px-4">84 - 88</td>
                    <td className="py-3 px-4">66</td>
                    <td className="py-3 px-4">42</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">M</td>
                    <td className="py-3 px-4">160 - 168</td>
                    <td className="py-3 px-4">54 - 62</td>
                    <td className="py-3 px-4">89 - 94</td>
                    <td className="py-3 px-4">69</td>
                    <td className="py-3 px-4">44</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">L</td>
                    <td className="py-3 px-4">168 - 175</td>
                    <td className="py-3 px-4">63 - 70</td>
                    <td className="py-3 px-4">95 - 100</td>
                    <td className="py-3 px-4">72</td>
                    <td className="py-3 px-4">46</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">XL</td>
                    <td className="py-3 px-4">175 - 182</td>
                    <td className="py-3 px-4">71 - 78</td>
                    <td className="py-3 px-4">101 - 106</td>
                    <td className="py-3 px-4">75</td>
                    <td className="py-3 px-4">48</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">2XL</td>
                    <td className="py-3 px-4">180 - 188</td>
                    <td className="py-3 px-4">79 - 88</td>
                    <td className="py-3 px-4">107 - 114</td>
                    <td className="py-3 px-4">77</td>
                    <td className="py-3 px-4">50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pants' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-950"></span> Bảng Quy Đổi Size Quần (Jeans, Kaki, Quần Tây)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-100/80 text-zinc-900 border-b border-zinc-200">
                    <th className="py-3 px-4 font-bold">Size</th>
                    <th className="py-3 px-4 font-bold">Vòng Bụng / Eo (cm)</th>
                    <th className="py-3 px-4 font-bold">Vòng Mông (cm)</th>
                    <th className="py-3 px-4 font-bold">Dài Quần (cm)</th>
                    <th className="py-3 px-4 font-bold">Cân Nặng Ước Lượng (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">29 (S)</td>
                    <td className="py-3 px-4">73 - 75</td>
                    <td className="py-3 px-4">88 - 91</td>
                    <td className="py-3 px-4">96</td>
                    <td className="py-3 px-4">48 - 55</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">30 (M)</td>
                    <td className="py-3 px-4">76 - 78</td>
                    <td className="py-3 px-4">92 - 95</td>
                    <td className="py-3 px-4">98</td>
                    <td className="py-3 px-4">56 - 63</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">31 (L)</td>
                    <td className="py-3 px-4">79 - 82</td>
                    <td className="py-3 px-4">96 - 99</td>
                    <td className="py-3 px-4">100</td>
                    <td className="py-3 px-4">64 - 70</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">32 (XL)</td>
                    <td className="py-3 px-4">83 - 86</td>
                    <td className="py-3 px-4">100 - 104</td>
                    <td className="py-3 px-4">102</td>
                    <td className="py-3 px-4">71 - 77</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">34 (2XL)</td>
                    <td className="py-3 px-4">87 - 92</td>
                    <td className="py-3 px-4">105 - 110</td>
                    <td className="py-3 px-4">104</td>
                    <td className="py-3 px-4">78 - 86</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dress' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-950"></span> Bảng Quy Đổi Size Váy & Đầm Nữ
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-100/80 text-zinc-900 border-b border-zinc-200">
                    <th className="py-3 px-4 font-bold">Size</th>
                    <th className="py-3 px-4 font-bold">Vòng Ngực (cm)</th>
                    <th className="py-3 px-4 font-bold">Vòng Eo (cm)</th>
                    <th className="py-3 px-4 font-bold">Vòng Mông (cm)</th>
                    <th className="py-3 px-4 font-bold">Cân Nặng Ước Lượng (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">S</td>
                    <td className="py-3 px-4">82 - 85</td>
                    <td className="py-3 px-4">64 - 67</td>
                    <td className="py-3 px-4">88 - 91</td>
                    <td className="py-3 px-4">42 - 48</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">M</td>
                    <td className="py-3 px-4">86 - 89</td>
                    <td className="py-3 px-4">68 - 72</td>
                    <td className="py-3 px-4">92 - 95</td>
                    <td className="py-3 px-4">49 - 54</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">L</td>
                    <td className="py-3 px-4">90 - 94</td>
                    <td className="py-3 px-4">73 - 77</td>
                    <td className="py-3 px-4">96 - 100</td>
                    <td className="py-3 px-4">55 - 60</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">XL</td>
                    <td className="py-3 px-4">95 - 100</td>
                    <td className="py-3 px-4">78 - 83</td>
                    <td className="py-3 px-4">101 - 106</td>
                    <td className="py-3 px-4">61 - 66</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'jacket' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-950"></span> Bảng Quy Đổi Size Áo Khoác & Blazer
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-100/80 text-zinc-900 border-b border-zinc-200">
                    <th className="py-3 px-4 font-bold">Size</th>
                    <th className="py-3 px-4 font-bold">Rộng Vai (cm)</th>
                    <th className="py-3 px-4 font-bold">Vòng Ngực (cm)</th>
                    <th className="py-3 px-4 font-bold">Dài Tay (cm)</th>
                    <th className="py-3 px-4 font-bold">Dài Áo (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">S</td>
                    <td className="py-3 px-4">43</td>
                    <td className="py-3 px-4">96</td>
                    <td className="py-3 px-4">60</td>
                    <td className="py-3 px-4">70</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">M</td>
                    <td className="py-3 px-4">45</td>
                    <td className="py-3 px-4">100</td>
                    <td className="py-3 px-4">61.5</td>
                    <td className="py-3 px-4">72</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">L</td>
                    <td className="py-3 px-4">47</td>
                    <td className="py-3 px-4">105</td>
                    <td className="py-3 px-4">63</td>
                    <td className="py-3 px-4">74</td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold text-zinc-950">XL</td>
                    <td className="py-3 px-4">49</td>
                    <td className="py-3 px-4">110</td>
                    <td className="py-3 px-4">64.5</td>
                    <td className="py-3 px-4">76</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Measurement Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200 space-y-2">
          <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> Vòng Ngực
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Dùng thước dây quấn quanh điểm lớn nhất của vòng ngực, giữ thước dây ngang bằng phẳng, không siết quá chặt.
          </p>
        </div>
        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200 space-y-2">
          <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> Vòng Eo
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Đo quanh vòng eo tự nhiên (vị trí hẹp nhất ở phần bụng, thường ở phía trên rốn khoảng 2-3 cm).
          </p>
        </div>
        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200 space-y-2">
          <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> Phân Vân Giữa 2 Size?
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Nếu số đo của bạn nằm giữa 2 size, hãy chọn size lớn hơn nếu thích mặc thoải mái/oversize, hoặc chọn size nhỏ hơn nếu thích ôm vừa vặn (slim fit).
          </p>
        </div>
      </div>

      {/* Support Box */}
      <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-serif-title text-xl sm:text-2xl font-bold">Vẫn chưa chắc chắn về size của bạn?</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Đội ngũ tư vấn thời trang của Nguyên Fashion luôn sẵn sàng hỗ trợ bạn chọn size chuẩn xác nhất qua Hotline hoặc Zalo.
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
            to="/products"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-zinc-700"
          >
            Khám phá sản phẩm <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
