import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { authenticateToken, AuthRequest, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

// 1. Customer Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Định dạng Email không hợp lệ' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải chứa ít nhất 6 ký tự' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Xác nhận mật khẩu không khớp' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email này đã được đăng ký trong hệ thống' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'CUSTOMER',
      status: 'ACTIVE',
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      token,
      user: userPayload,
      data: {
        token,
        user: userPayload,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đăng ký', error: error.message });
  }
});

// 2. Customer Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập Email và Mật khẩu' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    if (user.status === 'BLOCKED') {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ cửa hàng.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    };

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: userPayload,
      data: {
        token,
        user: userPayload,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi đăng nhập', error: error.message });
  }
});

// 3. Dedicated Admin Login (Strict role check)
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập Email và Mật khẩu quản trị' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu quản trị không chính xác' });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Từ chối truy cập: Tài khoản này không có thẩm quyền Quản trị viên (Admin).',
      });
    }

    if (user.status === 'BLOCKED') {
      return res.status(403).json({ success: false, message: 'Tài khoản quản trị này đã bị khóa' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu quản trị không chính xác' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    };

    return res.json({
      success: true,
      message: 'Xác thực Quản Trị Viên thành công',
      token,
      user: userPayload,
      data: {
        token,
        user: userPayload,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xác thực Admin', error: error.message });
  }
});

// 4. Current Profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin người dùng' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      createdAt: user.createdAt,
    },
  });
});

// 5. Update Profile
router.put('/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  const { name, phone, avatar } = req.body;
  const updated = db.updateUser(req.user!.id, {
    ...(name && { name: name.trim() }),
    ...(phone && { phone: phone.trim() }),
    ...(avatar && { avatar: avatar.trim() }),
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
  }

  const userPayload = {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    role: updated.role,
    avatar: updated.avatar,
  };

  return res.json({
    success: true,
    message: 'Cập nhật thông tin thành công',
    user: userPayload,
    data: userPayload,
  });
});

// 6. Change Password
router.post('/change-password', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Xác nhận mật khẩu mới không khớp' });
    }

    const user = db.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    db.updateUser(user.id, { passwordHash: newPasswordHash });

    return res.json({
      success: true,
      message: 'Đổi mật khẩu thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập sau.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Lỗi đổi mật khẩu', error: error.message });
  }
});

export default router;
