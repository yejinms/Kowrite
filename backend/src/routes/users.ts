import express from 'express';

const router = express.Router();

// 사용자 프로필 조회
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile endpoint' });
});

// 사용자 정보 업데이트
router.put('/profile', (req, res) => {
  res.json({ message: 'Update profile endpoint' });
});

export default router;
