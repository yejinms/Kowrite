import { OpenAI } from 'openai';

interface WorksheetContentRequest {
  category: string;
  topic: string;
  difficulty: string;
  language: string;
  grade?: string;
}

interface WorksheetContent {
  reading: string;
  vocabulary: Array<{
    word: string;
    definition: string;
    example: string;
  }>;
  questions: {
    main: string;
    extended: string;
    reflection: string;
  };
  discussion: string;
  summary: string;
}

export class AIContentGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: false
    });
  }

  /**
   * 학습지 콘텐츠 자동 생성
   */
  public async generateWorksheetContent(request: WorksheetContentRequest): Promise<WorksheetContent> {
    try {
      console.log(`🤖 AI 콘텐츠 생성 시작: ${request.category} - ${request.topic}`);

      const prompt = this.buildPrompt(request);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(request.language)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const aiResponse = completion.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('AI 응답을 받지 못했습니다.');
      }

      // AI 응답을 파싱하여 구조화된 데이터로 변환
      const parsedContent = this.parseAIResponse(aiResponse, request);
      
      console.log(`✅ AI 콘텐츠 생성 완료`);
      
      return parsedContent;

    } catch (error) {
      console.error('❌ AI 콘텐츠 생성 실패:', error);
      
      // AI 생성 실패 시 기본 템플릿 반환
      return this.getFallbackContent(request);
    }
  }

  /**
   * 시스템 프롬프트 생성
   */
  private getSystemPrompt(language: string): string {
    const basePrompt = `당신은 한국 문화와 언어를 가르치는 전문 교육자입니다. 
    미국 학생들을 위한 한국 문화 학습지를 만드는 것이 목표입니다.
    
    다음 형식으로 JSON 응답을 제공해주세요:
    {
      "reading": "읽기 자료 (2-3문단)",
      "vocabulary": [
        {
          "word": "한국어 단어",
          "definition": "단어의 뜻",
          "example": "예문"
        }
      ],
      "questions": {
        "main": "핵심 질문",
        "extended": "확장 질문",
        "reflection": "생각 정리 질문"
      },
      "discussion": "토론 주제",
      "summary": "마무리 학습 안내"
    }`;

    if (language === 'en') {
      return basePrompt + '\n모든 콘텐츠는 영어로 작성해주세요.';
    } else if (language === 'bilingual') {
      return basePrompt + '\n한국어와 영어를 모두 포함하여 작성해주세요.';
    }
    
    return basePrompt + '\n모든 콘텐츠는 한국어로 작성해주세요.';
  }

  /**
   * 사용자 프롬프트 생성
   */
  private buildPrompt(request: WorksheetContentRequest): string {
    const { category, topic, difficulty, language, grade } = request;
    
    const categoryDescriptions = {
      book: '한국 문학 작품이나 동화',
      history: '한국 역사나 문화적 사건',
      person: '한국 유명 인물이나 리더',
      kpop: 'K-Pop 가수나 음악',
      drama: '한국 드라마나 영화'
    };

    const difficultyDescriptions = {
      beginner: '초급 (K-2학년, 6-10세) - 매우 간단한 문장과 기본 어휘',
      intermediate: '중급 (3-8학년, 11-14세) - 중간 수준의 문장과 어휘',
      advanced: '고급 (9-12학년, 15세+) - 복잡한 문장과 고급 어휘'
    };

    return `
    주제: ${topic}
    카테고리: ${categoryDescriptions[category as keyof typeof categoryDescriptions]}
    난이도: ${difficultyDescriptions[difficulty as keyof typeof difficultyDescriptions]}
    언어: ${language === 'ko' ? '한국어' : language === 'en' ? '영어' : '한국어+영어'}
    ${grade ? `학년: ${grade}` : ''}

    위 주제에 대한 학습지를 만들어주세요. 다음 요구사항을 반드시 지켜주세요:

    1. 읽기 자료: 주제에 대한 흥미롭고 교육적인 내용 (2-3문단)
    2. 어휘: 4-6개의 핵심 단어와 쉬운 설명, 예문 포함
    3. 질문: 
       - 핵심 질문: 주제 이해를 위한 기본 질문
       - 확장 질문: 개인 경험과 연결하는 질문
       - 생각 정리: 깊이 있는 사고를 유도하는 질문
    4. 토론 주제: 찬성/반대가 가능한 흥미로운 주제
    5. 마무리: 학습 내용을 정리하는 안내

    난이도에 맞는 적절한 어휘와 문장 구조를 사용해주세요.
    `;
  }

  /**
   * AI 응답 파싱
   */
  private parseAIResponse(aiResponse: string, request: WorksheetContentRequest): WorksheetContent {
    try {
      // JSON 응답 추출 시도
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateAndCleanContent(parsed, request);
      }

      // JSON이 아닌 경우 기본 구조로 변환
      return this.parseTextResponse(aiResponse, request);

    } catch (error) {
      console.warn('AI 응답 파싱 실패, 기본 구조 사용:', error);
      return this.parseTextResponse(aiResponse, request);
    }
  }

  /**
   * 텍스트 응답을 구조화된 데이터로 변환
   */
  private parseTextResponse(text: string, request: WorksheetContentRequest): WorksheetContent {
    // 간단한 텍스트 파싱 로직
    const sections = text.split(/\n\n+/);
    
    return {
      reading: sections[0] || '주제에 대한 읽기 자료를 준비했습니다.',
      vocabulary: this.generateVocabulary(request.topic, request.difficulty),
      questions: {
        main: '주제에 대한 기본적인 이해를 확인하는 질문입니다.',
        extended: '개인 경험과 연결하여 생각해보는 질문입니다.',
        reflection: '깊이 있는 사고를 통해 정리하는 질문입니다.'
      },
      discussion: '이 주제에 대해 토론해보세요.',
      summary: '오늘 학습한 내용을 정리해보세요.'
    };
  }

  /**
   * 어휘 자동 생성
   */
  private generateVocabulary(topic: string, difficulty: string): Array<{word: string, definition: string, example: string}> {
    const commonWords = {
      beginner: [
        { word: '학습', definition: '새로운 것을 배우는 것', example: '오늘 한국 문화를 학습했습니다.' },
        { word: '문화', definition: '한 나라의 생활 방식과 예술', example: '한국 문화가 흥미롭습니다.' },
        { word: '이해', definition: '무엇을 알게 되는 것', example: '이해가 잘 됩니다.' },
        { word: '생각', definition: '머릿속으로 무엇을 궁리하는 것', example: '생각해보세요.' }
      ],
      intermediate: [
        { word: '전통', definition: '오래 전부터 이어져 온 풍습', example: '한국의 전통 문화를 배워봅시다.' },
        { word: '현대', definition: '현재 시대의', example: '현대 한국의 모습을 살펴봅시다.' },
        { word: '의미', definition: '어떤 뜻이나 가치', example: '이것의 의미를 생각해보세요.' },
        { word: '경험', definition: '직접 겪어본 일', example: '여러분의 경험을 이야기해보세요.' }
      ],
      advanced: [
        { word: '철학', definition: '세상과 삶에 대한 깊은 생각', example: '한국 철학의 특징을 알아봅시다.' },
        { word: '가치관', definition: '무엇이 중요한지에 대한 생각', example: '가치관의 차이를 이해해봅시다.' },
        { word: '정체성', definition: '자신이 누구인지에 대한 인식', example: '문화적 정체성에 대해 토론해봅시다.' },
        { word: '다양성', definition: '여러 가지가 섞여 있는 상태', example: '문화의 다양성을 존중합시다.' }
      ]
    };

    return commonWords[difficulty as keyof typeof commonWords] || commonWords.intermediate;
  }

  /**
   * 콘텐츠 검증 및 정리
   */
  private validateAndCleanContent(content: any, request: WorksheetContentRequest): WorksheetContent {
    return {
      reading: content.reading || '읽기 자료를 준비했습니다.',
      vocabulary: Array.isArray(content.vocabulary) ? content.vocabulary.slice(0, 6) : this.generateVocabulary(request.topic, request.difficulty),
      questions: {
        main: content.questions?.main || '주제에 대한 기본 질문입니다.',
        extended: content.questions?.extended || '확장 질문입니다.',
        reflection: content.questions?.reflection || '생각 정리 질문입니다.'
      },
      discussion: content.discussion || '토론 주제입니다.',
      summary: content.summary || '마무리 학습 안내입니다.'
    };
  }

  /**
   * AI 생성 실패 시 기본 콘텐츠 반환
   */
  private getFallbackContent(request: WorksheetContentRequest): WorksheetContent {
    return {
      reading: `${request.topic}에 대한 흥미로운 내용을 준비했습니다. 이 주제는 ${request.category} 분야에서 중요한 의미를 가지고 있습니다.`,
      vocabulary: this.generateVocabulary(request.topic, request.difficulty),
      questions: {
        main: `${request.topic}에 대해 무엇을 알고 있나요?`,
        extended: `${request.topic}와 관련된 경험이 있나요?`,
        reflection: '이 주제를 통해 무엇을 배웠나요?'
      },
      discussion: `${request.topic}에 대한 여러분의 생각을 나누어보세요.`,
      summary: '오늘 학습한 내용을 정리해보세요.'
    };
  }
}
