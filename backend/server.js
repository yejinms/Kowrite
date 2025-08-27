const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
  credentials: true
}));
app.use(express.json());

// OpenAI 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Kowrite 백엔드 서버가 정상 작동 중입니다.',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 워크시트 생성 API
app.post('/api/worksheets/generate', async (req, res) => {
  try {
    const { category, topic, difficulty, language, grade } = req.body;
    
    console.log(`🎯 워크시트 생성 요청: ${category} - ${topic} (${difficulty})`);
    
    // AI 프롬프트 생성
    const prompt = `
다음 주제로 한국 문화 학습지를 만들어주세요:

카테고리: ${category}
주제: ${topic}
난이도: ${difficulty}
언어: ${language}
학년: ${grade || '초등학교'}

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
    "main": "주요 질문",
    "extended": "심화 질문",
    "reflection": "생각해보기 질문"
  },
  "discussion": "토론 주제",
  "summary": "요약"
}
`;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "당신은 한국 문화와 언어를 가르치는 전문 교육자입니다. 미국 학생들을 위한 한국 문화 학습지를 만드는 것이 목표입니다."
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

    // AI 응답 파싱 시도
    let worksheetContent;
    try {
      worksheetContent = JSON.parse(aiResponse);
    } catch (parseError) {
      // JSON 파싱 실패 시 기본 템플릿 사용
      worksheetContent = {
        reading: `${topic}에 대한 ${difficulty} 난이도의 읽기 자료입니다.`,
        vocabulary: [
          {
            word: "샘플 단어",
            definition: "샘플 정의",
            example: "샘플 예문"
          }
        ],
        questions: {
          main: `${topic}에 대해 무엇을 배웠나요?`,
          extended: `${topic}의 중요성은 무엇인가요?`,
          reflection: `${topic}에 대해 어떻게 생각하나요?`
        },
        discussion: `${topic}에 대한 토론 주제입니다.`,
        summary: `${topic}에 대한 요약입니다.`
      };
    }

    // 워크시트 데이터 구성
    const worksheet = {
      id: Date.now().toString(),
      title: `${topic} 학습지`,
      category,
      topic,
      difficulty,
      language,
      grade,
      content: worksheetContent,
      createdAt: new Date().toISOString(),
      status: 'published'
    };

    console.log(`✅ 워크시트 생성 완료: ${worksheet.title}`);
    
    res.status(201).json({
      success: true,
      message: '워크시트가 성공적으로 생성되었습니다!',
      data: worksheet
    });

  } catch (error) {
    console.error('❌ 워크시트 생성 실패:', error);
    res.status(500).json({
      success: false,
      message: '워크시트 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 워크시트 템플릿 조회
app.get('/api/worksheets/templates', (req, res) => {
  const templates = [
    { id: '1', name: '한국 문화 기초', category: '문화', difficulty: '초급' },
    { id: '2', name: '한국어 회화', category: '언어', difficulty: '중급' },
    { id: '3', name: '한국 역사', category: '역사', difficulty: '고급' }
  ];
  
  res.json({
    success: true,
    data: templates
  });
});

// 워크시트 통계
app.get('/api/worksheets/stats', (req, res) => {
  const stats = {
    total: 150,
    thisMonth: 25,
    categories: {
      '문화': 45,
      '언어': 38,
      '역사': 32,
      '음식': 20,
      '기타': 15
    }
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: '요청한 리소스를 찾을 수 없습니다.',
    path: req.originalUrl 
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: '서버 내부 오류가 발생했습니다.'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Kowrite 백엔드 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`📚 AI 워크시트 생성 시스템 준비 완료`);
  console.log(`🔗 프론트엔드: http://localhost:3002`);
  console.log(`🔗 백엔드 API: http://localhost:${PORT}`);
  console.log(`🤖 OpenAI API 키: ${process.env.OPENAI_API_KEY ? '설정됨' : '설정되지 않음'}`);
});
