# contract-ai-partner (Web FE)

AI 계약서 검토 시스템 – **React (CRA + MUI v6)**  
> 최신 업데이트 2025-06-18

---

## 🚀 빠른 시작

```bash
# ❶ 레포 클론
git clone https://github.com/Rising-Star-DX/contract-ai-partner-frontend.git
cd contract-ai-partner-frontend/contract-ai-partner

# ❷ 의존성 설치
npm install

# ❸ 개발 서버 실행
npm start                              # http://localhost:3000

```

---

## 💡 웹 개발 서버 실행 전에

### 1. webpack.config.js 파일 수정

```node_modules/react-scripts/config/webpack.config.js```
파일에 들어가서 이미지와 같이 코드 추가

![웹팩수정이미지](https://velog.velcdn.com/images/haru/post/8fa993d1-a078-4f00-883e-9ec0a5278280/image.png)
[참고 링크](https://velog.io/@haru/mime-types-error)

### 2. env 파일 추가
```pgsql
contract-ai-partner  <- 여기에 env 파일 추가 (최상위 폴더 아님!)
├─ public/
├─ src/
│  ├─ api/
│  ├─ components/   
│  ├─ contexts/
│  ├─ pages/
│  └─ utils/
├─ .env    
└─ package.json
```
#### .env 파일 내용
```
# Spring Boot 백엔드 주소
REACT_APP_API_BASE_URL=http://localhost:8080
```


