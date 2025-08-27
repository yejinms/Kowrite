import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { WorksheetService } from '../services/WorksheetService';
import { AIContentGenerator } from '../services/AIContentGenerator';
import { Worksheet } from '../entities/Worksheet';

export class WorksheetController {
  private worksheetService: WorksheetService;
  private aiGenerator: AIContentGenerator;

  constructor() {
    this.worksheetService = new WorksheetService();
    this.aiGenerator = new AIContentGenerator();
  }

  /**
   * AI를 사용하여 학습지 자동 생성
   */
  public generateWorksheet = async (req: Request, res: Response) => {
    try {
      const { category, topic, difficulty, language, grade } = req.body;
      const userId = (req as any).user?.id;

      console.log(`🎯 학습지 생성 시작: ${category} - ${topic} (${difficulty})`);

      // 1. AI 콘텐츠 생성
      const aiContent = await this.aiGenerator.generateWorksheetContent({
        category,
        topic,
        difficulty,
        language,
        grade
      });

      // 2. 학습지 데이터 구성
      const worksheetData = {
        title: `${topic} 학습지`,
        category,
        topic,
        difficulty,
        language,
        grade,
        content: aiContent,
        userId,
        status: 'draft'
      };

      // 3. 데이터베이스에 저장
      const worksheet = await this.worksheetService.createWorksheet(worksheetData);

      console.log(`✅ 학습지 생성 완료: ID ${worksheet.id}`);

      res.status(201).json({
        success: true,
        message: '학습지가 성공적으로 생성되었습니다.',
        data: worksheet
      });

    } catch (error) {
      console.error('❌ 학습지 생성 실패:', error);
      res.status(500).json({
        success: false,
        message: '학습지 생성 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  };

  /**
   * 사용자의 학습지 목록 조회
   */
  public getWorksheets = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { page = 1, limit = 10, category, difficulty } = req.query;

      const worksheets = await this.worksheetService.getWorksheetsByUser(
        userId,
        {
          page: Number(page),
          limit: Number(limit),
          category: category as string,
          difficulty: difficulty as string
        }
      );

      res.json({
        success: true,
        data: worksheets
      });

    } catch (error) {
      console.error('❌ 학습지 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '학습지 목록을 불러오는데 실패했습니다.'
      });
    }
  };

  /**
   * 특정 학습지 조회
   */
  public getWorksheet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: '학습지 ID가 필요합니다.'
        });
        return;
      }

      const worksheet = await this.worksheetService.getWorksheetById(id);

      if (!worksheet) {
        res.status(404).json({
          success: false,
          message: '학습지를 찾을 수 없습니다.'
        });
        return;
      }

      res.json({
        success: true,
        data: worksheet
      });

    } catch (error) {
      console.error('❌ 학습지 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '학습지를 불러오는데 실패했습니다.'
      });
    }
  };

  /**
   * 학습지 업데이트
   */
  public updateWorksheet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: '학습지 ID가 필요합니다.'
        });
        return;
      }

      const worksheet = await this.worksheetService.updateWorksheet(id, updateData);

      res.json({
        success: true,
        message: '학습지가 성공적으로 업데이트되었습니다.',
        data: worksheet
      });

    } catch (error) {
      console.error('❌ 학습지 업데이트 실패:', error);
      res.status(500).json({
        success: false,
        message: '학습지 업데이트에 실패했습니다.'
      });
    }
  };

  /**
   * 학습지 삭제
   */
  public deleteWorksheet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: '학습지 ID가 필요합니다.'
        });
        return;
      }

      await this.worksheetService.deleteWorksheet(id);

      res.json({
        success: true,
        message: '학습지가 성공적으로 삭제되었습니다.'
      });

    } catch (error) {
      console.error('❌ 학습지 삭제 실패:', error);
      res.status(500).json({
        success: false,
        message: '학습지 삭제에 실패했습니다.'
      });
    }
  };

  /**
   * 학습지 공유
   */
  public shareWorksheet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { shareType, recipients } = req.body;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: '학습지 ID가 필요합니다.'
        });
        return;
      }

      const shareResult = await this.worksheetService.shareWorksheet(id);

      res.json({
        success: true,
        message: '학습지가 성공적으로 공유되었습니다.',
        data: shareResult
      });

    } catch (error) {
      console.error('❌ 학습지 공유 실패:', error);
      res.status(500).json({
        success: false,
        message: '학습지 공유에 실패했습니다.'
      });
    }
  };

  /**
   * PDF 생성
   */
  public generatePDF = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: '학습지 ID가 필요합니다.'
        });
        return;
      }

      const pdfBuffer = await this.worksheetService.generatePDF(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="worksheet-${id}.pdf"`);
      res.send(pdfBuffer);

    } catch (error) {
      console.error('❌ PDF 생성 실패:', error);
      res.status(500).json({
        success: false,
        message: 'PDF 생성에 실패했습니다.'
      });
    }
  };

  /**
   * Word 문서 생성
   */
  public generateWord = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: '학습지 ID가 필요합니다.'
        });
        return;
      }

      const wordBuffer = await this.worksheetService.generateWord(id);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="worksheet-${id}.docx"`);
      res.send(wordBuffer);

    } catch (error) {
      console.error('❌ Word 문서 생성 실패:', error);
      res.status(500).json({
        success: false,
        message: 'Word 문서 생성에 실패했습니다.'
      });
    }
  };

  /**
   * 학습지 템플릿 조회
   */
  public getTemplates = async (req: Request, res: Response) => {
    try {
      const templates = await this.worksheetService.getTemplates();

      res.json({
        success: true,
        data: templates
      });

    } catch (error) {
      console.error('❌ 템플릿 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '템플릿을 불러오는데 실패했습니다.'
      });
    }
  };

  /**
   * 학습지 통계 조회
   */
  public getWorksheetStats = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const stats = await this.worksheetService.getStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('❌ 통계 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '통계를 불러오는데 실패했습니다.'
      });
    }
  };
}
