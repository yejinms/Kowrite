import express from 'express';

const router = express.Router();

// 로그인
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

// 회원가입
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

// 로그아웃
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint' });
});

export default router;
