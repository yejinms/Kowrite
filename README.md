# 🎓 미국 진출용 교사용 학습지 자동 생성 프로그램

## 📋 프로젝트 개요

교사가 주제를 입력하면 자동으로 읽기 자료, 어휘, 질문, 토론 주제를 포함한 학습지를 생성하는 웹 기반 프로그램입니다.

### ✨ 주요 특징
- **교육적 콘텐츠**: 책, 역사, 인물 중심
- **대중문화 콘텐츠**: K-Pop, 드라마/영화 균형 제공
- **난이도별 조정**: 초급(K-5), 중급(초등고학년/중학), 고급(중등이상)
- **미국 교육 표준**: Common Core Standards 연계
- **다양한 출력 형식**: PDF, Word, LMS 연동

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행
```bash
# 저장소 클론
git clone [repository-url]
cd Kowrite

# 의존성 설치
npm install

# 환경변수 설정
cd frontend
cp .env.example .env.local
# .env.local 파일에서 VITE_OPENAI_API_KEY를 실제 API 키로 변경

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3002 접속
```

### 🔐 환경변수 설정

프로젝트를 실행하기 전에 다음 환경변수를 설정해야 합니다:

1. **frontend/.env.local** 파일 생성:
```bash
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Development Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_ENV=development
```

2. **OpenAI API 키 발급**:
   - [OpenAI Platform](https://platform.openai.com/)에서 계정 생성
   - API 키 발급 및 복사
   - `.env.local` 파일의 `VITE_OPENAI_API_KEY`에 붙여넣기

⚠️ **보안 주의사항**: 
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- API 키를 공개 저장소에 노출하지 마세요
- 프로덕션 환경에서는 서버 사이드에서 API 키를 관리하세요

## 🏗️ 프로젝트 구조

```
Kowrite/
├── frontend/          # React 프론트엔드
├── backend/           # Node.js 백엔드 API
├── database/          # 데이터베이스 스키마 및 마이그레이션
├── docs/             # 프로젝트 문서
├── assets/           # 이미지, 아이콘 등 정적 자원
└── scripts/          # 유틸리티 스크립트
```

## 🎯 주요 기능

1. **주제 선택**: 5개 카테고리 (책, 역사, 인물, K-Pop, 드라마/영화)
2. **자동 학습지 생성**: AI 기반 콘텐츠 생성
3. **난이도 조정**: Lexile 지수 기반 문장 및 어휘 조정
4. **출력 형식**: PDF, Word, LMS 연동
5. **교사 커뮤니티**: 학습지 공유 및 리뷰

## 🔧 기술 스택

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **AI/ML**: OpenAI GPT API, LangChain
- **Deployment**: Docker, AWS/Vercel

## 📚 사용 예시

### K-Pop 학습지 생성
1. 카테고리: 🎶 K-Pop 선택
2. 주제어: "BTS 봄날" 입력
3. 난이도: 중급 선택
4. 자동 생성된 학습지 검토 및 편집
5. PDF 다운로드 또는 LMS 업로드

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 [Issues](https://github.com/your-username/Kowrite/issues)를 통해 연락해주세요.
