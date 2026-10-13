import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ChevronLeft,
  Lock,
  Building,
  QrCode,
  Copy,
  Check,
  Eye,
  EyeOff,
  HelpCircle,
  Smartphone,
  Wallet,
  Sparkles,
  Search,
  X,
  MapPin,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { PaymentMethod, CartItem } from '../../types';

export interface ProvinceOption {
  name: string;
  category: 'Thành phố trực thuộc TW' | 'Tỉnh mới';
}

export const VIETNAM_PROVINCES_34: ProvinceOption[] = [
  // 6 Thành phố trực thuộc Trung ương
  { name: 'TP. Đà Nẵng', category: 'Thành phố trực thuộc TW' },
  { name: 'TP. Hồ Chí Minh', category: 'Thành phố trực thuộc TW' },
  { name: 'Hà Nội', category: 'Thành phố trực thuộc TW' },
  { name: 'Hải Phòng', category: 'Thành phố trực thuộc TW' },
  { name: 'Cần Thơ', category: 'Thành phố trực thuộc TW' },
  { name: 'Huế', category: 'Thành phố trực thuộc TW' },

  // 28 Tỉnh mới
  { name: 'An Giang', category: 'Tỉnh mới' },
  { name: 'Bắc Ninh', category: 'Tỉnh mới' },
  { name: 'Cà Mau', category: 'Tỉnh mới' },
  { name: 'Cao Bằng', category: 'Tỉnh mới' },
  { name: 'Đắk Lắk', category: 'Tỉnh mới' },
  { name: 'Điện Biên', category: 'Tỉnh mới' },
  { name: 'Đồng Nai', category: 'Tỉnh mới' },
  { name: 'Đồng Tháp', category: 'Tỉnh mới' },
  { name: 'Gia Lai', category: 'Tỉnh mới' },
  { name: 'Hà Tĩnh', category: 'Tỉnh mới' },
  { name: 'Hưng Yên', category: 'Tỉnh mới' },
  { name: 'Khánh Hòa', category: 'Tỉnh mới' },
  { name: 'Lai Châu', category: 'Tỉnh mới' },
  { name: 'Lâm Đồng', category: 'Tỉnh mới' },
  { name: 'Lạng Sơn', category: 'Tỉnh mới' },
  { name: 'Lào Cai', category: 'Tỉnh mới' },
  { name: 'Nghệ An', category: 'Tỉnh mới' },
  { name: 'Ninh Bình', category: 'Tỉnh mới' },
  { name: 'Phú Thọ', category: 'Tỉnh mới' },
  { name: 'Quảng Ngãi', category: 'Tỉnh mới' },
  { name: 'Quảng Ninh', category: 'Tỉnh mới' },
  { name: 'Quảng Trị', category: 'Tỉnh mới' },
  { name: 'Sơn La', category: 'Tỉnh mới' },
  { name: 'Tây Ninh', category: 'Tỉnh mới' },
  { name: 'Thái Nguyên', category: 'Tỉnh mới' },
  { name: 'Thanh Hóa', category: 'Tỉnh mới' },
  { name: 'Tuyên Quang', category: 'Tỉnh mới' },
  { name: 'Vĩnh Long', category: 'Tỉnh mới' },
];

export const NEW_WARDS_BY_PROVINCE: Record<string, string[]> = {
  'TP. Đà Nẵng': [
    'Phường Khuê Trung (Mới)',
    'Phường Hòa Thọ Đông',
    'Phường Hòa Thọ Tây',
    'Phường Hòa Cường Bắc',
    'Phường Hòa Cường Nam',
    'Phường Hải Châu I',
    'Phường Hải Châu II',
    'Phường Thạch Thang',
    'Phường Thuận Phước',
    'Phường Bình Thuận',
    'Phường Thanh Khê Đông',
    'Phường Thanh Khê Tây',
    'Phường Chính Gián',
    'Phường Tam Thuận',
    'Phường Vĩnh Trung',
    'Phường Thạc Gián',
    'Phường An Hải Bắc',
    'Phường An Hải Đông',
    'Phường An Hải Tây',
    'Phường Phước Mỹ',
    'Phường Mỹ An',
    'Phường Khuê Mỹ',
    'Phường Hòa Hải',
    'Phường Hòa Quý',
    'Phường Hòa Hiệp Bắc',
    'Phường Hòa Hiệp Nam',
    'Phường Hòa Khánh Bắc',
    'Phường Hòa Khánh Nam',
    'Phường Hòa Minh',
    'Xã Hòa Tiến',
    'Xã Hòa Châu',
    'Xã Hòa Phước',
    'Xã Hòa Khương',
    'Xã Hòa Nhơn',
    'Xã Hòa Phong',
  ],
  'TP. Hồ Chí Minh': [
    'Phường Bến Nghé (Mới)',
    'Phường Bến Thành',
    'Phường Cầu Kho',
    'Phường Cầu Ông Lãnh',
    'Phường Cô Giang',
    'Phường Đa Kao',
    'Phường Nguyễn Cư Trinh',
    'Phường Nguyễn Thái Bình',
    'Phường Phạm Ngũ Lão',
    'Phường Tân Định',
    'Phường Võ Thị Sáu',
    'Phường An Khánh',
    'Phường An Phú',
    'Phường Thảo Điền',
    'Phường Thủ Thiêm',
    'Phường Bình Trưng Đông',
    'Phường Bình Trưng Tây',
    'Phường Cát Lái',
    'Phường Thạnh Mỹ Lợi',
    'Phường Hiệp Phú',
    'Phường Long Bình',
    'Phường Long Thạnh Mỹ',
    'Phường Phước Bình',
    'Phường Phước Long A',
    'Phường Phước Long B',
    'Phường Tăng Nhơn Phú A',
    'Phường Tăng Nhơn Phú B',
    'Phường Linh Trung',
    'Phường Linh Chiểu',
    'Phường Linh Tây',
    'Phường Tam Bình',
    'Phường Tam Phú',
    'Phường Hiệp Bình Chánh',
    'Phường Hiệp Bình Phước',
    'Phường Tân Thuận Đông',
    'Phường Tân Thuận Tây',
    'Phường Phú Mỹ',
    'Phường Tân Phú',
    'Phường Tân Kiểng',
    'Phường Tân Hưng',
  ],
  'Hà Nội': [
    'Phường Tràng Tiền (Mới)',
    'Phường Hàng Bông',
    'Phường Hàng Gai',
    'Phường Hàng Trống',
    'Phường Hàng Đào',
    'Phường Hàng Bạc',
    'Phường Hàng Mã',
    'Phường Cửa Nam',
    'Phường Cửa Đông',
    'Phường Điện Biên',
    'Phường Đội Cấn',
    'Phường Giảng Võ',
    'Phường Kim Mã',
    'Phường Liễu Giai',
    'Phường Ngọc Hà',
    'Phường Quán Thánh',
    'Phường Thành Công',
    'Phường Trúc Bạch',
    'Phường Vĩnh Phúc',
    'Phường Cát Linh',
    'Phường Hàng Bột',
    'Phường Khâm Thiên',
    'Phường Kim Liên',
    'Phường Nam Đồng',
    'Phường Ô Chợ Dừa',
    'Phường Phương Mai',
    'Phường Quang Trung',
    'Phường Quốc Tử Giám',
    'Phường Dịch Vọng',
    'Phường Dịch Vọng Hậu',
    'Phường Mai Dịch',
    'Phường Nghĩa Đô',
    'Phường Nghĩa Tân',
    'Phường Quan Hoa',
    'Phường Trung Hòa',
    'Phường Yên Hòa',
    'Phường Bưởi',
    'Phường Nhật Tân',
    'Phường Phú Thượng',
    'Phường Quảng An',
    'Phường Thụy Khuê',
    'Phường Tứ Liên',
    'Phường Xuân La',
    'Phường Yên Phụ',
  ],
  'Hải Phòng': [
    'Phường Hoàng Văn Thụ (Mới)',
    'Phường Hạ Lý',
    'Phường Minh Khai',
    'Phường Phan Bội Châu',
    'Phường Quán Toan',
    'Phường Thượng Lý',
    'Phường Trại Chuối',
    'Phường An Biên',
    'Phường An Dương',
    'Phường Cát Dài',
    'Phường Cầu Đất',
    'Phường Cầu Tre',
    'Phường Đằng Giang',
    'Phường Đồng Quốc Bình',
    'Phường Lạc Viên',
    'Phường Lương Khánh Thiện',
    'Phường Máy Chai',
    'Phường Máy Tơ',
    'Phường Vạn Mỹ',
    'Phường Đằng Hải',
    'Phường Đằng Lâm',
    'Phường Đông Hải 1',
    'Phường Đông Hải 2',
    'Phường Nam Hải',
    'Phường Thành Tô',
    'Phường Tràng Cát',
  ],
  'Cần Thơ': [
    'Phường Tân An (Mới)',
    'Phường An Bình',
    'Phường An Cư',
    'Phường An Hòa',
    'Phường An Khánh',
    'Phường An Nghiệp',
    'Phường An Phú',
    'Phường Cái Khế',
    'Phường Hưng Lợi',
    'Phường Thới Bình',
    'Phường Xuân Khánh',
    'Phường An Thới',
    'Phường Bình Thủy',
    'Phường Bùi Hữu Nghĩa',
    'Phường Long Hòa',
    'Phường Long Tuyền',
    'Phường Thới An Đông',
    'Phường Trà An',
    'Phường Trà Nóc',
    'Phường Ba Láng',
    'Phường Hưng Phú',
    'Phường Hưng Thạnh',
    'Phường Lê Bình',
    'Phường Phú Thứ',
    'Phường Tân Phú',
  ],
  'Huế': [
    'Phường Vĩnh Ninh (Mới)',
    'Phường An Cựu',
    'Phường An Đông',
    'Phường An Hòa',
    'Phường An Tây',
    'Phường Đông Ba',
    'Phường Gia Hội',
    'Phường Hương An',
    'Phường Hương Hồ',
    'Phường Hương Long',
    'Phường Hương Sơ',
    'Phường Hương Vinh',
    'Phường Kim Long',
    'Phường Phú Hậu',
    'Phường Phú Hội',
    'Phường Phú Nhuận',
    'Phường Phú Thượng',
    'Phường Phước Vĩnh',
    'Phường Phường Đúc',
    'Phường Tây Lộc',
    'Phường Thuận An',
    'Phường Thuận Lộc',
    'Phường Thuận Thành',
    'Phường Thủy Biều',
    'Phường Thủy Vân',
    'Phường Thủy Xuân',
    'Phường Trường An',
    'Phường Vỹ Dạ',
    'Phường Xuân Phú',
  ],
  'Quảng Ninh': [
    'Phường Bạch Đằng (Mới)',
    'Phường Bãi Cháy',
    'Phường Cao Thắng',
    'Phường Cao Xanh',
    'Phường Đại Yên',
    'Phường Giếng Đáy',
    'Phường Hà Khánh',
    'Phường Hà Khẩu',
    'Phường Hà Lầm',
    'Phường Hà Phong',
    'Phường Hà Trung',
    'Phường Hà Tu',
    'Phường Hồng Gai',
    'Phường Hồng Hà',
    'Phường Hồng Hải',
    'Phường Hùng Thắng',
    'Phường Tuần Châu',
    'Phường Việt Hưng',
    'Phường Yết Kiêu',
  ],
  'Đồng Nai': [
    'Phường Quyết Thắng (Mới)',
    'Phường An Bình',
    'Phường An Hòa',
    'Phường Bình Đa',
    'Phường Bửu Hòa',
    'Phường Bửu Long',
    'Phường Hiệp Hòa',
    'Phường Hóa An',
    'Phường Hòa Bình',
    'Phường Hố Nai',
    'Phường Long Bình',
    'Phường Long Bình Tân',
    'Phường Phước Tân',
    'Phường Quang Vinh',
    'Phường Tam Hiệp',
    'Phường Tam Hòa',
    'Phường Tam Phước',
    'Phường Tân Biên',
    'Phường Tân Hạnh',
    'Phường Tân Hòa',
    'Phường Tân Hiệp',
    'Phường Tân Mai',
    'Phường Tân Phong',
    'Phường Tân Tiến',
    'Phường Tân Vạn',
    'Phường Thanh Bình',
    'Phường Thống Nhất',
    'Phường Trảng Dài',
    'Phường Trung Dũng',
  ],
  'Bắc Ninh': [
    'Phường Tiền An (Mới)',
    'Phường Đại Phúc',
    'Phường Đáp Cầu',
    'Phường Hắp Lĩnh',
    'Phường Khắc Niệm',
    'Phường Khúc Xuyên',
    'Phường Kim Chân',
    'Phường Kinh Bắc',
    'Phường Nam Sơn',
    'Phường Ninh Xá',
    'Phường Phong Khê',
    'Phường Suối Hoa',
    'Phường Thị Cầu',
    'Phường Vạn An',
    'Phường Vân Dương',
    'Phường Vệ An',
    'Phường Võ Cường',
    'Phường Vũ Ninh',
  ],
  'Khánh Hòa': [
    'Phường Lộc Thọ (Mới)',
    'Phường Ngọc Hiệp',
    'Phường Phước Hải',
    'Phường Phước Hòa',
    'Phường Phước Long',
    'Phường Phước Tân',
    'Phường Phước Tiến',
    'Phường Phương Sài',
    'Phường Phương Sơn',
    'Phường Tân Lập',
    'Phường Vạn Thắng',
    'Phường Vạn Thạnh',
    'Phường Vĩnh Hải',
    'Phường Vĩnh Hòa',
    'Phường Vĩnh Phước',
    'Phường Vĩnh Thọ',
    'Phường Vĩnh Trường',
    'Phường Vĩnh Nguyên',
    'Phường Xương Huân',
  ],
};

export const getWardsForProvince = (provinceName: string): string[] => {
  const normalized = provinceName.trim();
  if (NEW_WARDS_BY_PROVINCE[normalized]) {
    return NEW_WARDS_BY_PROVINCE[normalized];
  }
  // Try partial match
  const matchedKey = Object.keys(NEW_WARDS_BY_PROVINCE).find(k => normalized.includes(k) || k.includes(normalized));
  if (matchedKey) {
    return NEW_WARDS_BY_PROVINCE[matchedKey];
  }
  return [
    'Phường Trung Tâm (Mới)',
    'Phường 1 (Mới)',
    'Phường 2',
    'Phường 3',
    'Phường 4',
    'Phường 5',
    'Phường Quyết Thắng',
    'Phường Tân Lập',
    'Phường Quang Trung',
    'Phường Trần Phú',
    'Phường Lê Lợi',
    'Xã Trung Tâm',
  ];
};

const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    items: allCartItems,
    couponCode: cartCouponCode,
    clearCart,
    removeFromCart,
    updateQuantity,
    updateItemVariant,
  } = useCart();

  const selectedItemsState = (location.state as any)?.selectedItems as CartItem[] | undefined;
  const initialItems = useMemo(() => {
    if ((location.state as any)?.resumeCheckout && selectedItemsState) {
      return selectedItemsState;
    }
    if (selectedItemsState && selectedItemsState.length > 0) {
      const selectedIds = new Set(selectedItemsState.map(item => item.id));
      return allCartItems.filter(item => selectedIds.has(item.id));
    }
    return allCartItems;
  }, [selectedItemsState, allCartItems, location.state]);

  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>(initialItems);
  const [productDetailsMap, setProductDetailsMap] = useState<Record<string, any>>({});

  React.useEffect(() => {
    setCheckoutItems(initialItems);
  }, [initialItems]);

  // Load product details for all checkout items to get variant sizes and colors
  React.useEffect(() => {
    const fetchMissingProducts = async () => {
      const productIds = Array.from(new Set<string>(checkoutItems.map(i => i.productId)));
      for (const pId of productIds) {
        if (!productDetailsMap[pId]) {
          try {
            const res = await api.products.getByIdOrSlug(pId);
            if (res.success && res.data?.product) {
              setProductDetailsMap(prev => ({
                ...prev,
                [pId]: res.data.product,
              }));
            }
          } catch {
            // Ignore if product cannot be loaded
          }
        }
      }
    };
    if (checkoutItems.length > 0) {
      fetchMissingProducts();
    }
  }, [checkoutItems]);

  const items = checkoutItems;

  const handleUpdateItemVariant = (itemKey: string, newSize: string, newColor: string) => {
    const targetItem = checkoutItems.find(
      it => (it.variantId || it.id || `${it.productId}_${it.size}_${it.color}`) === itemKey
    );
    if (!targetItem) return;

    const prod = productDetailsMap[targetItem.productId];
    const matchedVariant =
      prod?.variants?.find((v: any) => v.size === newSize && v.color === newColor) ||
      prod?.variants?.find((v: any) => v.size === newSize) ||
      prod?.variants?.find((v: any) => v.color === newColor);

    const updatedSize = newSize;
    const updatedColor = newColor;
    const updatedVariantId = matchedVariant?.id || targetItem.variantId;
    const updatedSku = matchedVariant?.sku || targetItem.sku;
    const updatedColorCode = matchedVariant?.colorCode || targetItem.colorCode;
    const updatedPrice = matchedVariant?.price || targetItem.price;

    setCheckoutItems(prev =>
      prev.map(it => {
        const key = it.variantId || it.id || `${it.productId}_${it.size}_${it.color}`;
        if (key === itemKey) {
          return {
            ...it,
            size: updatedSize,
            color: updatedColor,
            variantId: updatedVariantId,
            sku: updatedSku,
            colorCode: updatedColorCode,
            price: updatedPrice,
          };
        }
        return it;
      })
    );

    if (updateItemVariant) {
      const cartItem = allCartItems.find(
        it => (it.variantId || it.id) === itemKey || it.id === itemKey
      );
      if (cartItem) {
        updateItemVariant(cartItem.id, {
          size: updatedSize,
          color: updatedColor,
          variantId: updatedVariantId,
          sku: updatedSku,
          colorCode: updatedColorCode,
          price: updatedPrice,
        });
      }
    }

    success(`Đã cập nhật: Size ${updatedSize} • Màu ${updatedColor}`);
  };

  const handleUpdateItemQuantity = (itemKey: string, newQty: number) => {
    if (newQty < 1) return;
    setCheckoutItems(prev =>
      prev.map(it => {
        const key = it.variantId || it.id || `${it.productId}_${it.size}_${it.color}`;
        if (key === itemKey) {
          const maxStock = it.maxStock || 99;
          const clamped = Math.min(newQty, maxStock);
          return { ...it, quantity: clamped };
        }
        return it;
      })
    );
    const cartItem = allCartItems.find(
      it => (it.variantId || it.id) === itemKey || it.id === itemKey
    );
    if (cartItem) {
      updateQuantity(cartItem.id, newQty);
    }
  };

  const handleRemoveItem = (itemKey: string) => {
    if (checkoutItems.length <= 1) {
      error('Đơn hàng cần tối thiểu 1 sản phẩm.');
      return;
    }
    setCheckoutItems(prev =>
      prev.filter(it => {
        const key = it.variantId || it.id || `${it.productId}_${it.size}_${it.color}`;
        return key !== itemKey;
      })
    );
    const cartItem = allCartItems.find(
      it => (it.variantId || it.id) === itemKey || it.id === itemKey
    );
    if (cartItem) {
      removeFromCart(cartItem.id);
    }
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  }, [items]);

  const [voucherPickerOpen, setVoucherPickerOpen] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<import('../../types').Coupon[]>([]);
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [vouchersError, setVouchersError] = useState('');
  React.useEffect(() => {
    if (!voucherPickerOpen) return;
    let cancelled = false;
    setVouchersLoading(true);
    setVouchersError('');
    api.coupons.getAvailable().then(res => {
      if (!cancelled) setAvailableVouchers(res.data || []);
    }).catch(err => {
      if (!cancelled) setVouchersError(err.message || 'Không thể tải mã giảm giá');
    }).finally(() => {
      if (!cancelled) setVouchersLoading(false);
    });
    return () => { cancelled = true; };
  }, [voucherPickerOpen]);

  const [couponInput, setCouponInput] = useState(cartCouponCode || '');
  const [couponCode, setCouponCode] = useState(cartCouponCode || '');
  const [couponFeedback, setCouponFeedback] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [validatedDiscount, setValidatedDiscount] = useState({ subtotal: -1, amount: 0 });

  React.useEffect(() => {
    let cancelled = false;
    if (!couponCode) {
      setValidatedDiscount({ subtotal: -1, amount: 0 });
      setCouponLoading(false);
      return;
    }
    setCouponLoading(true);
    setCouponFeedback('');
    api.coupons.validate(couponCode, subtotal).then(res => {
      if (cancelled) return;
      if (!res.success || !res.data) throw new Error(res.message || 'Mã giảm giá không hợp lệ');
      setValidatedDiscount({ subtotal, amount: res.data.discountAmount });
      setCouponFeedback(res.message);
    }).catch(err => {
      if (cancelled) return;
      setCouponCode('');
      setValidatedDiscount({ subtotal: -1, amount: 0 });
      setCouponFeedback(err.message || 'Không thể áp dụng mã giảm giá');
    }).finally(() => {
      if (!cancelled) setCouponLoading(false);
    });
    return () => { cancelled = true; };
  }, [couponCode, subtotal]);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponFeedback('Vui lòng nhập mã giảm giá');
      return;
    }
    setCouponInput(code);
    setCouponCode(code);
  };

  const shippingFee = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= 500000 ? 0 : 30000;
  }, [subtotal, items.length]);

  const discountAmount = couponCode && validatedDiscount.subtotal === subtotal
    ? validatedDiscount.amount : 0;

  const total = Math.max(0, subtotal + shippingFee - discountAmount);
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || '',
    province: 'TP. Hồ Chí Minh',
    district: '',
    ward: '',
    shippingAddress: (user as any)?.address || '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const provinceDropdownRef = React.useRef<HTMLDivElement>(null);

  // New Wards search & dropdown state
  const [wardSearch, setWardSearch] = useState('');
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const wardDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provinceDropdownRef.current && !provinceDropdownRef.current.contains(event.target as Node)) {
        setIsProvinceDropdownOpen(false);
      }
      if (wardDropdownRef.current && !wardDropdownRef.current.contains(event.target as Node)) {
        setIsWardDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProvinces = useMemo(() => {
    if (!provinceSearch.trim()) return VIETNAM_PROVINCES_34;
    const cleanQuery = removeVietnameseTones(provinceSearch.trim());
    return VIETNAM_PROVINCES_34.filter(p => {
      const cleanName = removeVietnameseTones(p.name);
      return (
        cleanName.includes(cleanQuery) ||
        p.name.toLowerCase().includes(provinceSearch.trim().toLowerCase())
      );
    });
  }, [provinceSearch]);

  const currentWards = useMemo(() => {
    return getWardsForProvince(formData.province || 'TP. Đà Nẵng');
  }, [formData.province]);

  const filteredWards = useMemo(() => {
    if (!wardSearch.trim()) return currentWards;
    const cleanQuery = removeVietnameseTones(wardSearch.trim());
    return currentWards.filter(w => {
      const cleanW = removeVietnameseTones(w);
      return cleanW.includes(cleanQuery) || w.toLowerCase().includes(wardSearch.trim().toLowerCase());
    });
  }, [currentWards, wardSearch]);
  const [cardSubMethod, setCardSubMethod] = useState<'INTERNATIONAL' | 'DOMESTIC' | 'WALLET'>('INTERNATIONAL');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCvv: '',
    bankName: 'MB Bank',
  });
  const [showCvv, setShowCvv] = useState(false);

  // Detect card brand
  const detectCardBrand = (number: string) => {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
    if (clean.startsWith('35')) return 'JCB';
    if (clean.startsWith('9704')) return 'NAPAS';
    return 'CREDIT';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardData(prev => ({ ...prev, cardExpiry: raw }));
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardData(prev => ({ ...prev, cardCvv: raw }));
  };

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText('6000270805');
    setCopiedAccount(true);
    success('Đã sao chép số tài khoản MB Bank: 6000270805');
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Pre-fill user data if user logs in
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        customerPhone: prev.customerPhone || user.phone || '',
        customerEmail: prev.customerEmail || user.email || '',
        shippingAddress: prev.shippingAddress || (user as any).address || '',
      }));
    }
  }, [user]);

  const formatVND = (num: any): string => {
    const val = Number(num);
    return isNaN(val) ? '0' : val.toLocaleString('vi-VN');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-title text-2xl font-bold text-zinc-900">
          Chưa có sản phẩm nào để thanh toán
        </h2>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-zinc-950 text-white rounded-xl text-xs font-bold"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      error('Vui lòng đăng nhập để đặt hàng bằng tài khoản của bạn');
      navigate('/login', {
        state: {
          from: {
            pathname: '/checkout',
            state: { selectedItems: checkoutItems, resumeCheckout: true },
          },
        },
      });
      return;
    }

    if (couponLoading || (couponCode && validatedDiscount.subtotal !== subtotal)) {
      error('Vui lòng chờ kiểm tra mã giảm giá');
      return;
    }

    if (!formData.customerName.trim()) {
      error('Vui lòng nhập Họ và tên người nhận hàng');
      const el = document.getElementById('input-customer-name');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      return;
    }

    const cleanPhone = formData.customerPhone.trim().replace(/\D/g, '');
    if (!formData.customerPhone.trim() || cleanPhone.length < 10) {
      error('Vui lòng nhập Số điện thoại nhận hàng hợp lệ (ít nhất 10 số)');
      const el = document.getElementById('input-customer-phone');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      return;
    }

    let finalShippingAddress = formData.shippingAddress.trim();
    if (!finalShippingAddress) {
      if (formData.ward.trim()) {
        finalShippingAddress = `${formData.ward.trim()}, ${formData.province || 'Việt Nam'}`;
      } else {
        error('Vui lòng nhập Địa chỉ nhận hàng (Số nhà, tên đường hoặc Phường/Xã)');
        const el = document.getElementById('input-shipping-address');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
        return;
      }
    }

    // Card validations if VNPAY/Card is selected
    let cardSummaryNote = '';
    if (paymentMethod === 'VNPAY') {
      if (cardSubMethod === 'INTERNATIONAL' || cardSubMethod === 'DOMESTIC') {
        const rawNumber = cardData.cardNumber.replace(/\s/g, '');
        if (!rawNumber || rawNumber.length < 15) {
          error('Vui lòng nhập Số thẻ thanh toán hợp lệ (15 - 16 chữ số)');
          return;
        }

        if (!cardData.cardHolder.trim()) {
          error('Vui lòng nhập Họ và tên in trên thẻ (không dấu)');
          return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.cardExpiry)) {
          error('Vui lòng nhập Ngày hết hạn của thẻ hợp lệ (Định dạng MM/YY, ví dụ: 08/28)');
          return;
        }

        // Check if expiry date is not expired
        const [expMonth, expYear] = cardData.cardExpiry.split('/').map(Number);
        const fullYear = 2000 + expYear;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        if (fullYear < currentYear || (fullYear === currentYear && expMonth < currentMonth)) {
          error('Thẻ đã hết hạn sử dụng. Vui lòng kiểm tra lại ngày hết hạn');
          return;
        }

        if (cardSubMethod === 'INTERNATIONAL' && (!cardData.cardCvv || cardData.cardCvv.length < 3)) {
          error('Vui lòng nhập Mã bảo mật CVV/CVC (3 chữ số ở mặt sau thẻ)');
          return;
        }

        const brand = detectCardBrand(rawNumber);
        const last4 = rawNumber.slice(-4);
        cardSummaryNote = ` [Thanh toán ${cardSubMethod === 'DOMESTIC' ? 'Thẻ ATM Napas (' + cardData.bankName + ')' : 'Thẻ ' + brand}: **** ${last4}, Hạn: ${cardData.cardExpiry}, Chủ thẻ: ${cardData.cardHolder.trim().toUpperCase()}]`;
      } else {
        cardSummaryNote = ' [Cổng thanh toán điện tử MoMo / VNPAY QR]';
      }
    }

    setSubmitting(true);
    try {
      const fullNote = `${formData.note.trim()}${cardSummaryNote}`.trim();
      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim(),
        province: formData.province,
        district: formData.district.trim(),
        ward: formData.ward.trim(),
        shippingAddress: finalShippingAddress,
        note: fullNote,
        paymentMethod,
        couponCode: couponCode || undefined,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: i.productName || (i as any).name || 'Sản phẩm',
          sku: i.sku,
          size: i.size,
          color: i.color,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.image,
        })),
      };

      const res = await api.orders.create(orderPayload);
      if (res.success && res.data) {
        if (selectedItemsState && selectedItemsState.length > 0) {
          selectedItemsState.forEach(i => removeFromCart(i.id || i.variantId));
        } else {
          clearCart();
        }
        success('Đặt hàng thành công!');
        navigate(`/order-success/${res.data.orderCode}`, {
          state: { order: res.data },
        });
      } else {
        error(res.message || 'Lỗi xử lý đơn hàng');
      }
    } catch (err: any) {
      error(err.message || 'Không thể tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <Link
          to="/cart"
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Quay lại giỏ hàng
        </Link>
        <span className="text-xs text-zinc-500 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-emerald-600" /> Thanh toán bảo mật SSL 256-bit
        </span>
      </div>

      <form noValidate onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Shipping & Payment form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Customer details */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="font-bold text-base text-zinc-950 flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-600" /> 1. Thông Tin Nhận Hàng
              </h2>
              <span className="text-[11px] text-rose-500 font-medium">* Bắt buộc điền</span>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Vui lòng điền chính xác <strong>Số điện thoại</strong> và <strong>Địa chỉ nhận hàng</strong> để nhân viên liên hệ giao hàng tận tay nhanh nhất.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-customer-name"
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Số điện thoại nhận hàng (10 số) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-customer-phone"
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Email nhận hóa đơn điện tử (Tùy chọn)
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="email@example.com (để nhận thông báo trạng thái đơn)"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
              />
            </div>

            {/* Địa chỉ sau sáp nhập: CHỈ DÙNG 34 TỈNH/THÀNH PHỐ MỚI VÀ PHƯỜNG MỚI */}
            <div className="space-y-4">
              {/* Tỉnh / Thành phố mới */}
              <div ref={provinceDropdownRef} className="relative">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                    Tỉnh / Thành phố mới <span className="text-rose-500">*</span>
                  </label>
                  {formData.province && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Đang chọn: <strong>{formData.province}</strong>
                    </span>
                  )}
                </div>

                {/* Nút bấm chọn nhanh các Thành phố & Tỉnh lớn */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] text-zinc-400 font-medium">Chọn nhanh (34 Tỉnh/TP mới):</span>
                  {['TP. Đà Nẵng', 'TP. Hồ Chí Minh', 'Hà Nội', 'Hải Phòng', 'Cần Thơ', 'Huế', 'Đồng Nai', 'Bắc Ninh'].map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, province: city, ward: '' }));
                        setProvinceSearch('');
                        setWardSearch('');
                        setIsProvinceDropdownOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                        formData.province === city
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* Ô tìm kiếm Tỉnh / Thành phố mới */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={isProvinceDropdownOpen ? provinceSearch : (provinceSearch || formData.province || '')}
                    onChange={e => {
                      setProvinceSearch(e.target.value);
                      if (!isProvinceDropdownOpen) setIsProvinceDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setIsProvinceDropdownOpen(true);
                      setProvinceSearch('');
                    }}
                    placeholder="🔍 Gõ tìm kiếm trong 34 Tỉnh / Thành phố mới..."
                    className="w-full pl-9 pr-20 py-2.5 bg-zinc-50 border border-zinc-300 focus:border-zinc-950 rounded-xl text-xs text-zinc-900 font-medium focus:outline-none focus:ring-1 focus:ring-zinc-950 shadow-2xs transition-all"
                  />

                  {/* Nút Xóa / Dropdown toggle */}
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                    {provinceSearch && (
                      <button
                        type="button"
                        onClick={() => setProvinceSearch('')}
                        className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors"
                        title="Xóa tìm kiếm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                      className="px-2 py-1 text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 bg-zinc-200/70 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                    >
                      {isProvinceDropdownOpen ? 'Đóng' : '34 Tỉnh/TP'}
                    </button>
                  </div>
                </div>

                {/* Dropdown danh sách 34 Tỉnh / Thành phố mới */}
                {isProvinceDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-zinc-300 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-100 max-h-72 flex flex-col">
                    <div className="px-3.5 py-2 bg-zinc-100/80 border-b border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                      <span>
                        {provinceSearch.trim()
                          ? `Kết quả tìm kiếm cho "${provinceSearch.trim()}" (${filteredProvinces.length} địa phương)`
                          : `Danh sách 34 Tỉnh / Thành Phố Mới Sau Sáp Nhập (${filteredProvinces.length})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsProvinceDropdownOpen(false)}
                        className="text-zinc-500 hover:text-zinc-800 font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="overflow-y-auto divide-y divide-zinc-100 p-1">
                      {filteredProvinces.length > 0 ? (
                        filteredProvinces.map(prov => {
                          const isSelected = formData.province === prov.name;
                          return (
                            <button
                              key={prov.name}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, province: prov.name, ward: '' }));
                                setProvinceSearch('');
                                setWardSearch('');
                                setIsProvinceDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-zinc-950 text-white font-bold'
                                  : 'text-zinc-800 hover:bg-zinc-100 font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs">{prov.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : prov.category === 'Thành phố trực thuộc TW'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'bg-zinc-100 text-zinc-600'
                                }`}>
                                  {prov.category}
                                </span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center space-y-2">
                          <p className="text-xs text-zinc-500">
                            Không tìm thấy tỉnh nào khớp với "<strong>{provinceSearch}</strong>"
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const customName = provinceSearch.trim();
                              if (customName) {
                                setFormData(prev => ({ ...prev, province: customName, ward: '' }));
                                setProvinceSearch('');
                                setWardSearch('');
                                setIsProvinceDropdownOpen(false);
                              }
                            }}
                            className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            ✓ Sử dụng "{provinceSearch.trim()}" làm Tỉnh / TP của bạn
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Phường / Xã mới sau sáp nhập */}
              <div ref={wardDropdownRef} className="relative">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-zinc-600" />
                    Phường / Xã mới <span className="text-rose-500">*</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      ✨ Đơn vị hành chính mới
                    </span>
                  </label>
                  {formData.ward && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Đang chọn: <strong>{formData.ward}</strong>
                    </span>
                  )}
                </div>

                {/* Gợi ý chọn nhanh các Phường mới thuộc Tỉnh/TP đã chọn */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] text-zinc-400 font-medium">Phường mới tại {formData.province || 'tỉnh này'}:</span>
                  {currentWards.slice(0, 6).map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, ward: w }));
                        setWardSearch('');
                        setIsWardDropdownOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                        formData.ward === w
                          ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                          : 'bg-purple-50/60 text-purple-900 border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>

                {/* Ô tìm kiếm & Chọn Phường / Xã mới */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    id="input-ward"
                    type="text"
                    value={isWardDropdownOpen ? wardSearch : (wardSearch || formData.ward || '')}
                    onChange={e => {
                      const val = e.target.value;
                      setWardSearch(val);
                      setFormData(prev => ({ ...prev, ward: val }));
                      if (!isWardDropdownOpen) setIsWardDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setIsWardDropdownOpen(true);
                      setWardSearch('');
                    }}
                    placeholder={`🔍 Gõ tìm hoặc chọn Phường / Xã mới tại ${formData.province || 'tỉnh thành'}...`}
                    className="w-full pl-9 pr-24 py-2.5 bg-zinc-50 border border-zinc-300 focus:border-purple-600 rounded-xl text-xs text-zinc-900 font-medium focus:outline-none focus:ring-1 focus:ring-purple-600 shadow-2xs transition-all"
                  />

                  {/* Nút toggle dropdown Phường mới */}
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                    {wardSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setWardSearch('');
                          setFormData(prev => ({ ...prev, ward: '' }));
                        }}
                        className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors"
                        title="Xóa"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
                      className="px-2 py-1 text-[11px] font-semibold text-purple-800 hover:text-purple-950 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors cursor-pointer"
                    >
                      {isWardDropdownOpen ? 'Đóng' : 'Danh sách'}
                    </button>
                  </div>
                </div>

                {/* Dropdown danh sách Phường / Xã mới */}
                {isWardDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-purple-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-100 max-h-64 flex flex-col">
                    <div className="px-3.5 py-2 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between text-[11px] text-purple-900 font-medium">
                      <span>
                        Danh sách Phường / Xã mới tại {formData.province || 'địa phương'} ({filteredWards.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsWardDropdownOpen(false)}
                        className="text-purple-600 hover:text-purple-950 font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="overflow-y-auto divide-y divide-purple-50 p-1">
                      {filteredWards.length > 0 ? (
                        filteredWards.map(w => {
                          const isSelected = formData.ward === w;
                          return (
                            <button
                              key={w}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, ward: w }));
                                setWardSearch('');
                                setIsWardDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-700 text-white font-bold'
                                  : 'text-zinc-800 hover:bg-purple-50 font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Building className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-purple-600'}`} />
                                <span>{w}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center space-y-1.5">
                          <p className="text-xs text-zinc-500">
                            Không có trong danh sách gợi ý sẵn.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const customWard = wardSearch.trim();
                              if (customWard) {
                                setFormData(prev => ({ ...prev, ward: customWard }));
                                setWardSearch('');
                                setIsWardDropdownOpen(false);
                              }
                            }}
                            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            ✓ Sử dụng "{wardSearch.trim()}" làm Phường / Xã mới của bạn
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Địa chỉ chi tiết nhận hàng (Số nhà, tên đường, thôn xóm, tòa nhà...) <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-shipping-address"
                type="text"
                value={formData.shippingAddress}
                onChange={e => setFormData({ ...formData, shippingAddress: e.target.value })}
                placeholder="Ví dụ: Số 158 Đường Đồng Khởi, Chung cư Landmark 81..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Ghi chú cho shipper (Tùy chọn)
              </label>
              <textarea
                rows={2}
                value={formData.note}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                placeholder="Giao hàng giờ hành chính, gọi trước khi giao 15 phút..."
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <CreditCard className="w-4 h-4 text-zinc-600" /> 2. Phương Thức Thanh Toán
            </h2>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-zinc-950 bg-zinc-50 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-zinc-950 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-xs text-zinc-950 block">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Thanh toán bằng tiền mặt cho nhân viên giao hàng khi nhận và kiểm tra kiện hàng.
                  </p>
                </div>
              </label>

              {/* BANK TRANSFER */}
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-zinc-950 bg-zinc-50 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="mt-1 text-zinc-950 focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-950 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      Chuyển khoản Ngân hàng (VietQR MB Bank 24/7)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Quét mã QR qua ứng dụng ngân hàng MB Bank, Vietcombank, Techcombank, VPBank, Momo... Đơn hàng sẽ được xác nhận tự động.
                  </p>

                  {paymentMethod === 'BANK_TRANSFER' && (
                    <div className="mt-4 p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* QR Code image */}
                        <div className="bg-gradient-to-b from-rose-50/50 to-white p-3 rounded-2xl border border-zinc-200/80 flex flex-col items-center justify-center shadow-xs shrink-0">
                          <img
                            src="/vietqr.png"
                            alt="VietQR MB Bank - PHAN NHAT NGUYEN"
                            onError={e => {
                              (e.target as HTMLImageElement).src = `https://api.vietqr.io/image/970422-6000270805-compact.jpg?accountName=PHAN%20NHAT%20NGUYEN&amount=${total}&addInfo=NGUYENFASHION`;
                            }}
                            className="w-40 sm:w-44 h-auto object-contain rounded-xl shadow-xs"
                          />
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-600 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Quét bằng App Ngân Hàng
                          </div>
                        </div>

                        {/* Account Details */}
                        <div className="w-full flex-1 space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                            <span className="text-zinc-500 text-[11px]">Ngân hàng:</span>
                            <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                              <span className="text-rose-600 font-extrabold text-xs">★</span> MB Bank (Quân Đội)
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                            <span className="text-zinc-500 text-[11px]">Chủ tài khoản:</span>
                            <strong className="font-bold text-zinc-950 uppercase tracking-wide text-xs">
                              PHAN NHAT NGUYEN
                            </strong>
                          </div>

                          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                            <span className="text-zinc-500 text-[11px]">Số tài khoản:</span>
                            <div className="flex items-center gap-2">
                              <strong className="font-mono text-sm font-bold text-emerald-700 tracking-wider">
                                6000270805
                              </strong>
                              <button
                                type="button"
                                onClick={handleCopyAccount}
                                className="px-2 py-1 rounded-md text-[11px] font-semibold bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 flex items-center gap-1 transition-all shadow-2xs active:scale-95"
                                title="Sao chép STK"
                              >
                                {copiedAccount ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" /> Đã chép
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-zinc-500" /> Sao chép
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                            <span className="text-emerald-800 text-[11px] font-medium">Số tiền thanh toán:</span>
                            <span className="font-mono font-bold text-base text-emerald-700">
                              {total.toLocaleString('vi-VN')}đ
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-500 italic pt-1 leading-relaxed">
                            * Bạn có thể quét mã QR ngay bây giờ hoặc tiếp tục xem lại thông tin tại trang xác nhận đơn hàng sau khi hoàn tất.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* VNPAY / MOMO / CREDIT & DEBIT CARD */}
              <div
                onClick={() => setPaymentMethod('VNPAY')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'VNPAY'
                    ? 'border-zinc-950 bg-zinc-50 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'VNPAY'}
                    onChange={() => setPaymentMethod('VNPAY')}
                    className="mt-1 text-zinc-950 focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-xs text-zinc-950 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        Ví điện tử MoMo / VNPay / Thẻ ATM / Thẻ Quốc Tế (Visa/Master)
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-700">VISA</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700">Master</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-700">NAPAS</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-pink-100 text-pink-700">MoMo</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Cổng thanh toán điện tử trực tuyến an toàn & mã hóa bảo mật chuẩn PCI-DSS.
                    </p>
                  </div>
                </div>

                {paymentMethod === 'VNPAY' && (
                  <div
                    onClick={e => e.stopPropagation()}
                    className="mt-4 p-4 sm:p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-4"
                  >
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200/80 text-xs">
                      <button
                        type="button"
                        onClick={() => setCardSubMethod('INTERNATIONAL')}
                        className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 text-[11px] ${
                          cardSubMethod === 'INTERNATIONAL'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        Thẻ Quốc Tế (Visa / Master / JCB)
                      </button>

                      <button
                        type="button"
                        onClick={() => setCardSubMethod('DOMESTIC')}
                        className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 text-[11px] ${
                          cardSubMethod === 'DOMESTIC'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5 text-emerald-600" />
                        Thẻ ATM Nội Địa (Napas)
                      </button>

                      <button
                        type="button"
                        onClick={() => setCardSubMethod('WALLET')}
                        className={`py-1.5 px-3 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 text-[11px] ${
                          cardSubMethod === 'WALLET'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <Wallet className="w-3.5 h-3.5 text-pink-600" />
                        MoMo / VNPay QR
                      </button>
                    </div>

                    {/* CONTENT: INTERNATIONAL OR DOMESTIC CARD FORM */}
                    {(cardSubMethod === 'INTERNATIONAL' || cardSubMethod === 'DOMESTIC') && (
                      <div className="space-y-4 pt-1">
                        {/* Interactive Card Mockup Preview */}
                        <div className="relative w-full max-w-sm mx-auto h-44 sm:h-48 rounded-2xl p-5 text-white shadow-2xl overflow-hidden bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-900 border border-zinc-700/80 flex flex-col justify-between">
                          {/* Glossy light effect */}
                          <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
                          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                          {/* Top Row: Chip + Wireless + Brand */}
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                              {/* EMV Chip */}
                              <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-500 border border-amber-300/80 shadow-inner flex items-center justify-center p-1 relative">
                                <div className="w-full h-full border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 opacity-60">
                                  <div className="border-r border-b border-amber-700/30"></div>
                                  <div className="border-b border-amber-700/30"></div>
                                  <div className="border-r border-amber-700/30"></div>
                                  <div></div>
                                </div>
                              </div>
                              {/* Contactless waves icon */}
                              <svg className="w-5 h-5 text-zinc-400 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                                <path d="M6 13.5a8.5 8.5 0 0 1 12 0" />
                                <path d="M3.5 10.5a12 12 0 0 1 17 0" />
                              </svg>
                            </div>

                            {/* Brand Logo */}
                            <div className="text-right">
                              {cardSubMethod === 'DOMESTIC' ? (
                                <span className="font-sans font-black text-sm text-emerald-400 tracking-wider">
                                  napas 24/7
                                </span>
                              ) : (
                                <>
                                  {detectCardBrand(cardData.cardNumber) === 'VISA' && (
                                    <span className="font-serif italic font-extrabold text-xl text-blue-400 tracking-wider">
                                      VISA
                                    </span>
                                  )}
                                  {detectCardBrand(cardData.cardNumber) === 'MASTERCARD' && (
                                    <div className="flex items-center -space-x-2">
                                      <div className="w-6 h-6 rounded-full bg-rose-500/90 shadow-sm" />
                                      <div className="w-6 h-6 rounded-full bg-amber-400/90 shadow-sm" />
                                    </div>
                                  )}
                                  {detectCardBrand(cardData.cardNumber) === 'JCB' && (
                                    <span className="font-sans font-black text-base text-rose-400 tracking-wider">
                                      JCB
                                    </span>
                                  )}
                                  {detectCardBrand(cardData.cardNumber) === 'NAPAS' && (
                                    <span className="font-sans font-extrabold text-sm text-emerald-400 tracking-wider">
                                      napas
                                    </span>
                                  )}
                                  {detectCardBrand(cardData.cardNumber) === 'CREDIT' && (
                                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                      DEBIT / CREDIT
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Middle: Card Number */}
                          <div className="relative z-10 py-1">
                            <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-zinc-100 drop-shadow-sm">
                              {cardData.cardNumber || '•••• •••• •••• ••••'}
                            </div>
                          </div>

                          {/* Bottom Row: Holder & Expiry */}
                          <div className="flex items-end justify-between relative z-10 text-[11px]">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-medium">
                                Chủ Thẻ / CARDHOLDER
                              </span>
                              <span className="font-mono font-bold tracking-wider text-zinc-100 uppercase truncate max-w-[170px] block">
                                {cardData.cardHolder || 'NGUYEN VAN A'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-medium">
                                Hạn Dùng / EXPIRES
                              </span>
                              <span className="font-mono font-bold tracking-wider text-zinc-100">
                                {cardData.cardExpiry || 'MM/YY'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-3 pt-2">
                          {/* If Domestic ATM, select Bank */}
                          {cardSubMethod === 'DOMESTIC' && (
                            <div>
                              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                Ngân hàng phát hành thẻ <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={cardData.bankName}
                                onChange={e => setCardData({ ...cardData, bankName: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-medium"
                              >
                                <option value="MB Bank">MB Bank (Ngân hàng Quân Đội)</option>
                                <option value="Vietcombank">Vietcombank (Ngoại thương Việt Nam)</option>
                                <option value="Techcombank">Techcombank (Kỹ Thương)</option>
                                <option value="BIDV">BIDV (Đầu tư và Phát triển)</option>
                                <option value="VietinBank">VietinBank (Công Thương)</option>
                                <option value="Agribank">Agribank (Nông nghiệp & PTNT)</option>
                                <option value="ACB">ACB (Á Châu)</option>
                                <option value="VPBank">VPBank (Việt Nam Thịnh Vượng)</option>
                                <option value="TPBank">TPBank (Tiên Phong)</option>
                                <option value="Sacombank">Sacombank (Sài Gòn Thương Tín)</option>
                                <option value="HDBank">HDBank (Phát triển TP.HCM)</option>
                                <option value="OCB">OCB (Phương Đông)</option>
                              </select>
                            </div>
                          )}

                          {/* Card Number */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-semibold text-zinc-700">
                                Số thẻ {cardSubMethod === 'DOMESTIC' ? 'ATM' : 'tín dụng / ghi nợ'}{' '}
                                <span className="text-rose-500">*</span>
                              </label>
                              <span className="text-[11px] text-zinc-400 font-mono">
                                {cardData.cardNumber.replace(/\s/g, '').length}/16 chữ số
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={19}
                                value={cardData.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="Ví dụ: 4123 4567 8901 2345"
                                className="w-full pl-10 pr-24 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-zinc-950 font-semibold"
                              />
                              <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                              <div className="absolute right-3 top-2.5 flex items-center gap-1">
                                {detectCardBrand(cardData.cardNumber) === 'VISA' && (
                                  <span className="font-serif italic font-extrabold text-xs text-blue-600">VISA</span>
                                )}
                                {detectCardBrand(cardData.cardNumber) === 'MASTERCARD' && (
                                  <span className="font-sans font-black text-xs text-rose-600">Master</span>
                                )}
                                {detectCardBrand(cardData.cardNumber) === 'JCB' && (
                                  <span className="font-sans font-black text-xs text-rose-500">JCB</span>
                                )}
                                {detectCardBrand(cardData.cardNumber) === 'NAPAS' && (
                                  <span className="font-sans font-bold text-xs text-emerald-600">NAPAS</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Cardholder Name */}
                          <div>
                            <label className="block text-xs font-semibold text-zinc-700 mb-1">
                              Họ và tên in trên thẻ <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={cardData.cardHolder}
                              onChange={e =>
                                setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })
                              }
                              placeholder="Ví dụ: NGUYEN VAN A (không dấu)"
                              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 uppercase font-medium focus:outline-none focus:ring-1 focus:ring-zinc-950"
                            />
                          </div>

                          {/* Expiry Date & CVV */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-zinc-700">
                                  Ngày hết hạn <span className="text-rose-500">*</span>
                                </label>
                                <span className="text-[10px] text-zinc-400">MM/YY</span>
                              </div>
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={5}
                                value={cardData.cardExpiry}
                                onChange={handleCardExpiryChange}
                                placeholder="12/28"
                                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 font-mono tracking-widest text-center font-bold focus:outline-none focus:ring-1 focus:ring-zinc-950"
                              />
                            </div>

                            {cardSubMethod === 'INTERNATIONAL' ? (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-xs font-semibold text-zinc-700">
                                    Mã CVV / CVC <span className="text-rose-500">*</span>
                                  </label>
                                  <span className="text-[10px] text-zinc-400">3 số mặt sau</span>
                                </div>
                                <div className="relative">
                                  <input
                                    type={showCvv ? 'text' : 'password'}
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={cardData.cardCvv}
                                    onChange={handleCardCvvChange}
                                    placeholder="123"
                                    className="w-full pl-3.5 pr-8 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 font-mono tracking-widest text-center font-bold focus:outline-none focus:ring-1 focus:ring-zinc-950"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowCvv(!showCvv)}
                                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
                                    title={showCvv ? 'Ẩn CVV' : 'Hiện CVV'}
                                  >
                                    {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                  Bảo mật thẻ
                                </label>
                                <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold h-[38px]">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Xác thực OTP Napas</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Security Notice */}
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-start gap-2 text-[11px] text-zinc-600">
                          <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            Thông tin thẻ được mã hóa <strong>SSL 256-bit</strong> đạt tiêu chuẩn an ninh quốc tế{' '}
                            <strong>PCI-DSS Level 1</strong>. Hệ thống cam kết không lưu giữ mã CVV của quý khách.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CONTENT: WALLET MOMO / VNPAY */}
                    {cardSubMethod === 'WALLET' && (
                      <div className="space-y-3 pt-1 text-center py-4">
                        <div className="w-12 h-12 mx-auto rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-zinc-900">
                            Thanh toán nhanh qua Ví MoMo hoặc VNPAY App
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-1 max-w-sm mx-auto">
                            Sau khi bấm Xác nhận đặt hàng, hệ thống sẽ mở cổng thanh toán bảo mật với mã QR để bạn quét trực tiếp trên điện thoại.
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Hỗ trợ hoàn tiền tự động 100% nếu có hủy đơn
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Review Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-950">
                Đơn Hàng Của Bạn ({items.length} món)
              </h3>
              <span className="text-[11px] text-zinc-500 font-medium">
                {items.reduce((s, it) => s + it.quantity, 0)} sản phẩm
              </span>
            </div>

            {/* Items scroll with Quantity & Size / Color Controls */}
            <div className="max-h-[380px] overflow-y-auto space-y-3.5 pr-1 divide-y divide-zinc-100">
              {items.map(item => {
                const displayName = item.productName || (item as any).name || 'Sản phẩm';
                const itemKey = item.variantId || item.id || `${item.productId}_${item.size}_${item.color}`;
                const maxStock = item.maxStock || 99;

                const product = productDetailsMap[item.productId];
                const variants = product?.variants || [];

                const availableSizes: string[] = (() => {
                  if (variants.length > 0) {
                    const s = Array.from(new Set(variants.map((v: any) => v.size)));
                    if (item.size && !s.includes(item.size)) s.unshift(item.size);
                    return s;
                  }
                  return Array.from(new Set([item.size || 'S', 'S', 'M', 'L', 'XL', 'XXL']));
                })();

                const availableColors: string[] = (() => {
                  if (variants.length > 0) {
                    const c = Array.from(new Set(variants.map((v: any) => v.color)));
                    if (item.color && !c.includes(item.color)) c.unshift(item.color);
                    return c;
                  }
                  return Array.from(new Set([item.color || 'Trắng Sữa', 'Trắng Sữa', 'Đen', 'Xanh Navy', 'Beige', 'Xám']));
                })();

                return (
                  <div key={itemKey} className="pt-3.5 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <img
                        src={item.image}
                        alt={displayName}
                        className="w-13 h-15 rounded-xl object-cover border border-zinc-200 shrink-0 shadow-2xs mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-zinc-900 truncate" title={displayName}>
                          {displayName}
                        </p>

                        {/* Interactive Size & Color Selection */}
                        <div className="mt-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-zinc-700 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Chọn Size & Màu:
                            </span>
                            <span className="font-semibold text-zinc-800 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                              {item.size} • {item.color}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Size Selector */}
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                                Kích Thước (Size)
                              </label>
                              <div className="relative">
                                <select
                                  value={item.size}
                                  onChange={(e) => handleUpdateItemVariant(itemKey, e.target.value, item.color)}
                                  className="w-full text-[11px] font-bold text-zinc-950 bg-white border border-zinc-300 hover:border-zinc-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer shadow-2xs appearance-none pr-5 transition-colors"
                                  title="Chọn kích thước (size)"
                                >
                                  {availableSizes.map(s => (
                                    <option key={s} value={s}>
                                      Size {s}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-1.5 pointer-events-none text-zinc-400">
                                  <ChevronDown className="w-3 h-3" />
                                </div>
                              </div>
                            </div>

                            {/* Color Selector */}
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                                Màu Sắc
                              </label>
                              <div className="relative">
                                <select
                                  value={item.color}
                                  onChange={(e) => handleUpdateItemVariant(itemKey, item.size, e.target.value)}
                                  className="w-full text-[11px] font-medium text-zinc-950 bg-white border border-zinc-300 hover:border-zinc-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer shadow-2xs appearance-none pr-5 transition-colors truncate"
                                  title="Chọn màu sắc"
                                >
                                  {availableColors.map(c => (
                                    <option key={c} value={c}>
                                      {c}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-1.5 pointer-events-none text-zinc-400">
                                  <ChevronDown className="w-3 h-3" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Quantity Stepper */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="inline-flex items-center border border-zinc-300 rounded-lg bg-zinc-50 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(itemKey, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 rounded flex items-center justify-center text-zinc-600 hover:text-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
                              title="Giảm số lượng"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-zinc-950 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(itemKey, item.quantity + 1)}
                              disabled={item.quantity >= maxStock}
                              className="w-6 h-6 rounded flex items-center justify-center text-zinc-600 hover:text-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
                              title="Tăng số lượng"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-[10px] text-zinc-400 font-mono">
                            x {formatVND(item.price)}đ
                          </span>

                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(itemKey)}
                              className="p-1 text-zinc-400 hover:text-rose-600 transition-colors ml-auto cursor-pointer"
                              title="Xóa món này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pt-0.5">
                      <span className="font-mono font-bold text-xs sm:text-sm text-zinc-950 block">
                        {formatVND(item.price * item.quantity)}đ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financial summary */}
            <div className="pt-4 border-t border-zinc-100 mb-5">
              <label htmlFor="checkout-coupon" className="block text-sm font-semibold text-zinc-900 mb-2">Mã giảm giá</label>
              <div className="flex gap-2">
                <input id="checkout-coupon" value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                  placeholder="Nhập mã giảm giá" disabled={couponLoading}
                  className="min-w-0 flex-1 rounded-xl border border-zinc-300 px-3 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                  className="rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                  {couponLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
                </button>
              </div>
              <button type="button" aria-expanded={voucherPickerOpen} aria-controls="checkout-vouchers"
                onClick={() => setVoucherPickerOpen(open => !open)}
                className="mt-3 flex w-full items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-600">
                <span>Chọn mã giảm giá có sẵn</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${voucherPickerOpen ? 'rotate-180' : ''}`} />
              </button>
              {voucherPickerOpen && <div id="checkout-vouchers" className="mt-3 max-h-80 space-y-3 overflow-y-auto" aria-label="Danh sách mã giảm giá">
                {vouchersLoading && <p role="status" className="text-xs text-zinc-500">Đang tải voucher...</p>}
                {vouchersError && <p role="alert" className="text-xs text-rose-600">{vouchersError}</p>}
                {!vouchersLoading && !vouchersError && availableVouchers.length === 0 && <p className="text-xs text-zinc-500">Chưa có mã giảm giá còn hiệu lực.</p>}
                {!vouchersLoading && !vouchersError && [...availableVouchers].sort((a, b) =>
                  Number(subtotal < a.minOrderValue) - Number(subtotal < b.minOrderValue)
                ).map(voucher => {
                  const eligible = subtotal >= voucher.minOrderValue;
                  const selected = couponCode === voucher.code;
                  return <div key={voucher.id} className={`rounded-xl border p-3 ${selected ? 'border-emerald-400 bg-emerald-50' : eligible ? 'border-rose-200 bg-white' : 'border-zinc-200 bg-zinc-50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-bold text-rose-600">Giảm {voucher.discountType === 'PERCENT' ? `${voucher.discountValue}%` : `${formatVND(voucher.discountValue)}đ`}</p>
                        <p className="mt-1 break-all text-xs font-bold text-zinc-900">{voucher.code}</p>
                        <p className="mt-1 text-xs text-zinc-600">{voucher.description}</p>
                        <p className="mt-1 text-xs text-zinc-500">Đơn từ {formatVND(voucher.minOrderValue)}đ{voucher.maxDiscount ? ` · Giảm tối đa ${formatVND(voucher.maxDiscount)}đ` : ''}</p>
                        <p className="mt-1 text-xs text-zinc-500">HSD: {voucher.endDate.split('-').reverse().join('/')}</p>
                      </div>
                      <button type="button" disabled={!eligible || couponLoading || selected}
                        onClick={() => { setCouponInput(voucher.code); setCouponCode(voucher.code); setVoucherPickerOpen(false); }}
                        className="shrink-0 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white disabled:bg-zinc-200 disabled:text-zinc-500">
                        {selected ? 'Đã chọn' : 'Chọn'}
                      </button>
                    </div>
                    {!eligible && <p className="mt-2 text-xs text-amber-700">Mua thêm {formatVND(voucher.minOrderValue - subtotal)}đ để dùng mã này</p>}
                  </div>;
                })}
              </div>}
              {couponFeedback && <p role="status" className={`mt-2 text-xs ${couponCode ? 'text-emerald-600' : 'text-rose-600'}`}>{couponFeedback}</p>}
              {couponCode && !couponLoading && <button type="button" onClick={() => {
                setCouponCode(''); setCouponInput(''); setCouponFeedback('');
              }} className="mt-2 text-xs text-zinc-600 underline">Hủy mã {couponCode}</button>}
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Tiền hàng:</span>
                <span className="font-mono font-bold text-zinc-900">{formatVND(subtotal)}đ</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Phí vận chuyển:</span>
                <span className="font-mono">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  ) : (
                    `${formatVND(shippingFee)}đ`
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Mã khuyến mãi ({couponCode}):</span>
                  <span className="font-mono font-bold">-{formatVND(discountAmount)}đ</span>
                </div>
              )}
              <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                <span className="font-bold text-sm text-zinc-950">Tổng thanh toán:</span>
                <span className="font-mono font-extrabold text-xl text-rose-600">
                  {formatVND(total !== undefined && total !== null ? total : (subtotal + shippingFee - discountAmount))}đ
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || couponLoading || Boolean(couponCode && validatedDiscount.subtotal !== subtotal)}
              className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all shadow-xl disabled:opacity-50"
            >
              {submitting ? 'Đang Xử Lý Đơn Hàng...' : !isAuthenticated ? 'Đăng Nhập Để Đặt Hàng' : 'Xác Nhận Đặt Hàng Ngay'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
