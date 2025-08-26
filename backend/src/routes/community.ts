import express from 'express';

const router = express.Router();

// 커뮤니티 게시글 목록
router.get('/posts', (req, res) => {
  res.json({ message: 'Community posts endpoint' });
});

// 게시글 생성
router.post('/posts', (req, res) => {
  res.json({ message: 'Create post endpoint' });
});

export default router;
