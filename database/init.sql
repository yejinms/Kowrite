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

