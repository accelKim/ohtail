# 베이스 이미지 설정
FROM node:14

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 앱 의존성 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 앱 소스 코드 복사
COPY . .

# 클라이언트 빌드
RUN npm run build

# 서버 실행
CMD ["node", "server.js"]

# 포트 설정
EXPOSE 5000
