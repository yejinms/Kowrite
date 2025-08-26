import express from 'express';
import { WorksheetController } from '../controllers/WorksheetController';
import { authMiddleware } from '../middleware/auth';
import { validateWorksheet } from '../middleware/validation';

const router = express.Router();
const worksheetController = new WorksheetController();

// 학습지 생성
router.post('/generate', 
  authMiddleware, 
  validateWorksheet, 
  worksheetController.generateWorksheet
);

// 학습지 목록 조회
router.get('/', authMiddleware, worksheetController.getWorksheets);

// 특정 학습지 조회
router.get('/:id', authMiddleware, worksheetController.getWorksheet);

// 학습지 업데이트
router.put('/:id', authMiddleware, worksheetController.updateWorksheet);

// 학습지 삭제
router.delete('/:id', authMiddleware, worksheetController.deleteWorksheet);

// 학습지 공유
router.post('/:id/share', authMiddleware, worksheetController.shareWorksheet);

// 학습지 PDF 생성
router.get('/:id/pdf', authMiddleware, worksheetController.generatePDF);

// 학습지 Word 문서 생성
router.get('/:id/word', authMiddleware, worksheetController.generateWord);

// 학습지 템플릿 조회
router.get('/templates', worksheetController.getTemplates);

// 학습지 통계
router.get('/stats', authMiddleware, worksheetController.getWorksheetStats);

export default router;
