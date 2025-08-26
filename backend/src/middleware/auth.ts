import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // TODO: 실제 JWT 토큰 검증 로직 구현
  // 현재는 임시로 통과
  req.user = {
    id: '1',
    email: 'demo@kowrite.com',
    role: 'teacher'
  };
  
  next();
};
