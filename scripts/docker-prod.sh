#!/bin/bash

echo "🚀 Docker로 Kowrite 프로덕션 환경을 시작합니다..."

# 프로덕션 환경 빌드 및 시작
docker-compose --profile production up --build -d
