#!/bin/bash

echo "🚀 Kowrite 프로젝트 설정을 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Node.js 버전 확인
echo -e "${BLUE}📋 Node.js 버전을 확인합니다...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js가 설치되어 있지 않습니다. Node.js 18+ 버전을 설치해주세요.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ 버전이 필요합니다. 현재 버전: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 버전 확인 완료: $(node -v)${NC}"

# npm 버전 확인
echo -e "${BLUE}📋 npm 버전을 확인합니다...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm이 설치되어 있지 않습니다.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm 버전 확인 완료: $(npm -v)${NC}"

# Docker 확인
echo -e "${BLUE}📋 Docker를 확인합니다...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker가 설치되어 있지 않습니다. Docker 설치를 권장합니다.${NC}"
    DOCKER_AVAILABLE=false
else
    echo -e "${GREEN}✅ Docker 확인 완료: $(docker --version)${NC}"
    DOCKER_AVAILABLE=true
fi

# Docker Compose 확인
if [ "$DOCKER_AVAILABLE" = true ]; then
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${YELLOW}⚠️  Docker Compose가 설치되어 있지 않습니다.${NC}"
        DOCKER_COMPOSE_AVAILABLE=false
    else
        echo -e "${GREEN}✅ Docker Compose 확인 완료: $(docker-compose --version)${NC}"
        DOCKER_COMPOSE_AVAILABLE=true
    fi
fi

# 의존성 설치
echo -e "${BLUE}📦 프로젝트 의존성을 설치합니다...${NC}"

# 루트 의존성 설치
echo -e "${BLUE}  - 루트 의존성 설치 중...${NC}"
npm install

# 프론트엔드 의존성 설치
echo -e "${BLUE}  - 프론트엔드 의존성 설치 중...${NC}"
cd frontend
npm install
cd ..

# 백엔드 의존성 설치
echo -e "${BLUE}  - 백엔드 의존성 설치 중...${NC}"
cd backend
npm install
cd ..

echo -e "${GREEN}✅ 모든 의존성 설치 완료${NC}"

# 환경변수 파일 생성
echo -e "${BLUE}📝 환경변수 파일을 생성합니다...${NC}"

if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo -e "${GREEN}✅ backend/.env 파일이 생성되었습니다.${NC}"
    echo -e "${YELLOW}⚠️  OpenAI API 키와 데이터베이스 설정을 확인해주세요.${NC}"
else
    echo -e "${GREEN}✅ backend/.env 파일이 이미 존재합니다.${NC}"
fi

# 데이터베이스 초기화 스크립트 생성
echo -e "${BLUE}🗄️  데이터베이스 초기화 스크립트를 생성합니다...${NC}"

mkdir -p database
cat > database/init.sql << 'EOF'
-- Kowrite 데이터베이스 초기화 스크립트

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'teacher',
    school VARCHAR(255),
    grade_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 학습지 테이블
CREATE TABLE IF NOT EXISTS worksheets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    language VARCHAR(10) NOT NULL,
    grade VARCHAR(50),
    content JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 공유된 학습지 테이블
CREATE TABLE IF NOT EXISTS shared_worksheets (
    id SERIAL PRIMARY KEY,
    worksheet_id INTEGER REFERENCES worksheets(id),
    shared_by INTEGER REFERENCES users(id),
    shared_with INTEGER REFERENCES users(id),
    share_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 학습지 평가 테이블
CREATE TABLE IF NOT EXISTS worksheet_ratings (
    id SERIAL PRIMARY KEY,
    worksheet_id INTEGER REFERENCES worksheets(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_worksheets_user_id ON worksheets(user_id);
CREATE INDEX IF NOT EXISTS idx_worksheets_category ON worksheets(category);
CREATE INDEX IF NOT EXISTS idx_worksheets_difficulty ON worksheets(difficulty);
CREATE INDEX IF NOT EXISTS idx_worksheets_created_at ON worksheets(created_at);

-- 샘플 데이터 삽입 (선택사항)
INSERT INTO users (email, password_hash, name, role, school) VALUES 
('demo@kowrite.com', '$2b$10$demo', 'Demo Teacher', 'teacher', 'Demo School')
ON CONFLICT (email) DO NOTHING;

EOF

echo -e "${GREEN}✅ 데이터베이스 초기화 스크립트가 생성되었습니다.${NC}"

# 실행 스크립트 생성
echo -e "${BLUE}📜 실행 스크립트를 생성합니다...${NC}"

cat > scripts/dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Kowrite 개발 서버를 시작합니다..."

# 프론트엔드와 백엔드를 동시에 실행
npm run dev
EOF

cat > scripts/docker-dev.sh << 'EOF'
#!/bin/bash

echo "🐳 Docker로 Kowrite 개발 환경을 시작합니다..."

# Docker Compose로 개발 환경 시작
docker-compose up --build
EOF

cat > scripts/docker-prod.sh << 'EOF'
#!/bin/bash

echo "🚀 Docker로 Kowrite 프로덕션 환경을 시작합니다..."

# 프로덕션 환경 빌드 및 시작
docker-compose --profile production up --build -d
EOF

# 실행 권한 부여
chmod +x scripts/dev.sh
chmod +x scripts/docker-dev.sh
chmod +x scripts/docker-prod.sh

echo -e "${GREEN}✅ 실행 스크립트가 생성되었습니다.${NC}"

# 프로젝트 구조 출력
echo -e "${BLUE}📁 프로젝트 구조:${NC}"
echo "Kowrite/"
echo "├── frontend/          # React 프론트엔드"
echo "├── backend/           # Node.js 백엔드 API"
echo "├── database/          # 데이터베이스 스크립트"
echo "├── scripts/           # 실행 스크립트"
echo "├── docker-compose.yml # Docker 설정"
echo "└── README.md          # 프로젝트 문서"

echo ""
echo -e "${GREEN}🎉 Kowrite 프로젝트 설정이 완료되었습니다!${NC}"
echo ""
echo -e "${BLUE}📋 다음 단계:${NC}"
echo "1. backend/.env 파일에서 OpenAI API 키와 데이터베이스 설정을 확인하세요"
echo "2. 개발 서버 시작: ./scripts/dev.sh"
echo "3. Docker로 시작: ./scripts/docker-dev.sh"
echo ""
echo -e "${YELLOW}💡 도움이 필요하시면 README.md를 참조하세요.${NC}"
