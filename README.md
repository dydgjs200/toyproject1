# File Upload & Conversion API

NestJS 기반의 파일 업로드 및 변환 API 서비스입니다. 사용자 인증, 파일 관리, S3 저장소 연동, 그리고 Word to PDF 변환 기능을 제공합니다.

## 🚀 주요 기능

### 🔐 인증 시스템
- JWT 기반 사용자 인증
- 회원가입/로그인/로그아웃
- 비밀번호 해시화 (bcrypt)
- 보안된 API 엔드포인트

### 📁 파일 관리
- 파일 업로드 (S3 저장)
- 파일 다운로드
- 파일 조회 (전체/개인/단일)
- 파일 삭제
- 본인 파일만 접근 가능한 보안 제어

### 🔄 파일 변환
- Word 문서를 PDF로 변환
- 변환된 PDF를 S3에 자동 저장
- LibreOffice 기반 변환 엔진

### 📊 일관된 API 응답
- 모든 API 응답이 표준화된 형태
- `{ status, description, data, timestamp }` 구조
- 스웨거 문서와 실제 응답 일치

## 🛠 기술 스택

### Backend
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: MySQL (TypeORM)
- **Authentication**: JWT, Passport
- **File Storage**: AWS S3
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

### 주요 라이브러리
- `@aws-sdk/client-s3`: AWS S3 클라이언트
- `bcryptjs`: 비밀번호 해시화
- `docx-pdf`: Word to PDF 변환
- `multer`: 파일 업로드 처리
- `pdf-lib`: PDF 처리

## 📁 프로젝트 구조

```
src/
├── auth/                    # 인증 모듈
│   ├── dto/                # 인증 관련 DTO
│   ├── guards/             # JWT 가드
│   ├── auth.controller.ts  # 인증 컨트롤러
│   ├── auth.service.ts     # 인증 서비스
│   └── auth.module.ts      # 인증 모듈
├── user/                   # 사용자 모듈
│   ├── dto/                # 사용자 관련 DTO
│   ├── entities/           # 사용자 엔티티
│   ├── user.controller.ts  # 사용자 컨트롤러
│   ├── user.service.ts     # 사용자 서비스
│   └── user.module.ts      # 사용자 모듈
├── file/                   # 파일 모듈
│   ├── dto/                # 파일 관련 DTO
│   ├── entities/           # 파일 엔티티
│   ├── file.controller.ts  # 파일 컨트롤러
│   ├── file.service.ts     # 파일 서비스
│   └── file.module.ts      # 파일 모듈
├── convert/                # 변환 모듈
│   ├── dto/                # 변환 관련 DTO
│   ├── convert.controller.ts # 변환 컨트롤러
│   ├── convert.service.ts  # 변환 서비스
│   └── convert.module.ts   # 변환 모듈
├── s3/                     # S3 모듈
│   ├── dto/                # S3 관련 DTO
│   ├── s3.controller.ts    # S3 컨트롤러
│   ├── s3.service.ts       # S3 서비스
│   └── s3.module.ts        # S3 모듈
├── common/                 # 공통 모듈
│   ├── dto/                # 공통 DTO
│   ├── decorators/         # 커스텀 데코레이터
│   ├── filters/            # 예외 필터
│   ├── interceptors/       # 응답 인터셉터
│   ├── pipe/               # 커스텀 파이프
│   └── common.module.ts    # 공통 모듈
└── main.ts                 # 애플리케이션 진입점
```

## 🗄 데이터베이스 스키마

### User 테이블
```sql
CREATE TABLE user (
  userId INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

### File 테이블
```sql
CREATE TABLE file (
  fileId INT PRIMARY KEY AUTO_INCREMENT,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  originalName VARCHAR(255) NOT NULL,
  s3Key VARCHAR(255) NOT NULL,
  s3Url VARCHAR(500) NOT NULL,
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE
);
```

## 🔧 설치 및 실행

### 1. 환경 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket
CORS_ORIGIN=http://localhost:3000
PORT=3000
```

### 2. 데이터베이스 설정
```bash
# MySQL 데이터베이스 생성
CREATE DATABASE your_database;
```

### 3. 애플리케이션 실행
```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

## 📚 API 문서

### Swagger UI
애플리케이션 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
```
http://localhost:3000/api
```

### 주요 API 엔드포인트

#### 인증 (Auth)
- `POST /auth/login` - 로그인
- `POST /auth/logout` - 로그아웃

#### 사용자 (Users)
- `POST /users/register` - 회원가입
- `DELETE /users/:userId` - 사용자 탈퇴
- `PUT /users/:userId` - 사용자 정보 수정
- `GET /users/getAllUser` - 전체 사용자 조회
- `GET /users/:userId` - 특정 사용자 조회

#### 파일 (Files)
- `POST /file/upload` - 파일 업로드
- `GET /file/download/:fileId` - 파일 다운로드
- `DELETE /file/delete/:fileId` - 파일 삭제
- `GET /file/getAllFile` - 전체 파일 조회
- `GET /file/getFile/:fileId` - 단일 파일 조회
- `GET /file/getMyFile/:userId` - 내 파일 조회

#### 변환 (Convert)
- `POST /convert/wordToPdf` - Word to PDF 변환

## 🔒 보안 기능

### 인증 및 권한
- JWT 토큰 기반 인증
- 비밀번호 bcrypt 해시화
- 본인 파일만 접근 가능한 제어
- API 엔드포인트별 인증 가드 적용

### 파일 보안
- 파일 소유자 확인 로직
- S3 접근 권한 제어
- 안전한 파일 업로드 처리

## 📊 API 응답 형식

### 성공 응답
```json
{
  "status": 200,
  "description": "요청이 성공적으로 처리되었습니다.",
  "data": {
    // 실제 데이터
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 에러 응답
```json
{
  "status": 400,
  "description": "잘못된 요청입니다.",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 🚀 배포

### Docker (권장)
```bash
# Docker 이미지 빌드
docker build -t file-upload-api .

# 컨테이너 실행
docker run -p 3000:3000 file-upload-api
```

### 직접 배포
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod
```

## 📝 개발 가이드

### 새로운 API 추가
1. 컨트롤러에 엔드포인트 추가
2. 서비스 로직 구현
3. DTO 정의 (필요시)
4. 스웨거 문서 작성
5. 테스트 코드 작성

### 데이터베이스 마이그레이션
```bash
# TypeORM CLI 사용
npx typeorm migration:generate
npx typeorm migration:run
```


## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**개발자**: 최용헌  
**버전**: 0.0.1  
**최종 업데이트**: 2025년 7월 
