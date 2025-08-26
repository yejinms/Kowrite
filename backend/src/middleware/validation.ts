import { Request, Response, NextFunction } from 'express';

export const validateWorksheet = (req: Request, res: Response, next: NextFunction) => {
  const { category, topic, difficulty, language } = req.body;
  
  if (!category || !topic || !difficulty || !language) {
    return res.status(400).json({
      error: '필수 필드가 누락되었습니다.',
      required: ['category', 'topic', 'difficulty', 'language']
    });
  }
  
  const validCategories = ['book', 'history', 'person', 'kpop', 'drama'];
  const validDifficulties = ['beginner', 'intermediate', 'advanced'];
  const validLanguages = ['ko', 'en', 'bilingual'];
  
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: '유효하지 않은 카테고리입니다.',
      valid: validCategories
    });
  }
  
  if (!validDifficulties.includes(difficulty)) {
    return res.status(400).json({
      error: '유효하지 않은 난이도입니다.',
      valid: validDifficulties
    });
  }
  
  if (!validLanguages.includes(language)) {
    return res.status(400).json({
      error: '유효하지 않은 언어입니다.',
      valid: validLanguages
    });
  }
  
  next();
};
