<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Toy Project 1 - User Management System

NestJS와 MySQL을 사용한 사용자 관리 시스템입니다.

## 기능

- 사용자 회원가입 (비밀번호 해시화)
- 사용자 목록 조회
- 사용자 상세 조회

## 기술 스택

- **Backend**: NestJS
- **Database**: MySQL
- **ORM**: TypeORM
- **Password Hashing**: bcryptjs

## 프로젝트 설정

### 1. 의존성 설치

```bash
$ npm install
```

### 2. MySQL 데이터베이스 설정

1. MySQL 서버가 실행 중인지 확인하세요.
2. `toyproject1_db` 데이터베이스를 생성하세요:

```sql
CREATE DATABASE toyproject1_db;
```

3. `src/app.module.ts` 파일에서 데이터베이스 연결 정보를 수정하세요:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'your_password', // 실제 MySQL 비밀번호로 변경
  database: 'toyproject1_db',
  entities: [User],
  synchronize: true, // 개발 환경에서만 true로 설정
  autoLoadEntities: true,
}),
```

### 3. 애플리케이션 실행

```bash
# 개발 모드
$ npm run start:dev

# 프로덕션 모드
$ npm run start:prod
```

## API 엔드포인트

### 회원가입
```http
POST /users
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**응답:**
```json
{
  "message": "회원가입이 성공적으로 완료되었습니다.",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

### 사용자 목록 조회
```http
GET /users
```

### 특정 사용자 조회
```http
GET /users/:id
```

## 데이터베이스 스키마

### User 테이블
```sql
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

## 보안 기능

- 비밀번호는 bcryptjs를 사용하여 해시화되어 저장됩니다.
- 사용자명은 중복을 방지하기 위해 UNIQUE 제약조건이 설정되어 있습니다.

## 테스트

```bash
# 단위 테스트
$ npm run test

# e2e 테스트
$ npm run test:e2e

# 테스트 커버리지
$ npm run test:cov
```

## 라이선스

MIT licensed.

# AI를 활용한 WORD to PDF 변환 API

NestJS 기반의 AI 파일 변환 서비스입니다. WORD 문서를 PDF로 변환할 때 AI 기반 최적화를 적용합니다.

## 주요 기능

- 🤖 **AI 기반 최적화**: 텍스트 품질 향상, 이미지 최적화, 메타데이터 정리
- 📄 **다양한 형식 지원**: .doc, .docx 파일 변환
- ⚡ **품질 설정**: low, medium, high 품질 옵션
- 📦 **배치 처리**: 최대 10개 파일 동시 변환
- 👀 **미리보기**: Base64 인코딩된 PDF 미리보기
- 📊 **상태 확인**: 변환기 상태 및 지원 기능 확인

## 설치 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. LibreOffice 설치 (필수)

#### Windows
1. [LibreOffice 공식 사이트](https://www.libreoffice.org/download/download/)에서 다운로드
2. 설치 후 시스템 환경변수 PATH에 추가
3. 또는 설치 경로를 직접 지정 (예: `C:\Program Files\LibreOffice\program\soffice.exe`)

#### macOS
```bash
brew install --cask libreoffice
```

#### Ubuntu/Debian
```bash
sudo apt-get install libreoffice
```

### 3. 환경 변수 설정

`.env` 파일에 데이터베이스 설정을 추가하세요:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

## 사용 방법

### 서버 실행

```bash
npm run start:dev
```

### API 엔드포인트

#### 1. 단일 파일 변환
```http
POST /converter/word-to-pdf
Content-Type: multipart/form-data

file: [WORD 파일]
quality: low|medium|high (선택사항)
```

#### 2. 배치 변환
```http
POST /converter/batch-word-to-pdf
Content-Type: multipart/form-data

files: [WORD 파일들] (최대 10개)
```

#### 3. 변환 상태 확인
```http
GET /converter/status
```

#### 4. PDF 미리보기
```http
POST /converter/preview
Content-Type: multipart/form-data

file: [WORD 파일]
```

## AI 최적화 기능

### 텍스트 최적화
- OCR 품질 향상
- 텍스트 재구성 및 스타일 통일
- 폰트 최적화

### 이미지 최적화
- 해상도 조정
- 압축 최적화
- 색상 보정

### 메타데이터 정리
- 문서 정보 정리
- 보안 정보 제거
- 표준화된 메타데이터 적용

## 품질 설정

- **Low**: 파일 크기 최소화, 기본 변환
- **Medium**: 균형잡힌 품질과 크기 (기본값)
- **High**: 최고 품질, 고해상도 처리

## 예제 사용법

### cURL 예제

```bash
# 단일 파일 변환
curl -X POST http://localhost:3000/converter/word-to-pdf \
  -F "file=@document.docx" \
  -F "quality=high" \
  --output converted.pdf

# 배치 변환
curl -X POST http://localhost:3000/converter/batch-word-to-pdf \
  -F "files=@doc1.docx" \
  -F "files=@doc2.docx"
```

### JavaScript 예제

```javascript
// 단일 파일 변환
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('quality', 'high');

fetch('/converter/word-to-pdf', {
  method: 'POST',
  body: formData
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.pdf';
  a.click();
});
```

## 문제 해결

### LibreOffice 관련 오류
1. LibreOffice가 올바르게 설치되었는지 확인
2. 시스템 PATH에 LibreOffice 경로가 추가되었는지 확인
3. Windows의 경우 설치 경로를 직접 지정:

```typescript
// converter.service.ts에서
const libreofficePath = 'C:\\Program Files\\LibreOffice\\program\\soffice.exe';
```

### 메모리 부족 오류
- 큰 파일 변환 시 메모리 부족이 발생할 수 있습니다
- 품질을 'low'로 설정하거나 파일 크기를 줄여보세요

### 변환 실패
- 지원되는 형식(.doc, .docx)인지 확인
- 파일이 손상되지 않았는지 확인
- 로그를 확인하여 구체적인 오류 메시지 확인

## 개발 환경

- Node.js 18+
- NestJS 11+
- TypeScript
- MySQL
- LibreOffice

## 라이선스

MIT License
