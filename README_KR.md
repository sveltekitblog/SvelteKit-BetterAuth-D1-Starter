[English version here (README_EN.md)](./README_EN.md)

---

# SvelteKit + Better Auth + Cloudflare D1 가이드 👗

이 프로젝트는 SvelteKit, Better Auth, 그리고 Cloudflare D1(데이터베이스)을 활용하여 구축된 초보자 친화적 인증 시스템입니다. 처음 시작하시는 분들도 아래 순서대로 따라하시면 10분 안에 자신만의 인증 서버를 구축하고 배포할 수 있습니다.

---

## 🚀 시작하기 전 준비물

1. **Node.js 설치**: [nodejs.org](https://nodejs.org/)에서 최신 LTS 버전을 설치하세요.
2. **Cloudflare 계정**: [cloudflare.com](https://www.cloudflare.com/)에 가입되어 있어야 합니다. (무료 플랜으로 충분합니다.)
3. **Google/Naver/Kakao 개발자 계정**: 소셜 로그인을 사용하려면 각 서비스의 개발자 센터에서 Client ID와 Secret을 발급받아야 합니다.

---

## 🛠️ 1단계: 프로젝트 설치 및 로그인

먼저 터미널(또는 명령 프롬프트)을 열고 아래 명령어를 순서대로 입력하세요.

```bash
# 1. 의존성 패키지 설치
npm install

# 2. Cloudflare 로그인 (브라우저가 열리면 승인 버튼을 누르세요)
npx wrangler login
```

---

## 💾 2단계: 데이터베이스(D1) 생성

Cloudflare의 강력한 SQLite 기반 데이터베이스인 D1을 생성합니다.

```bash
# 데이터베이스 생성
# 예제에서는 'ba-sqlite-d1'이라는 이름을 사용합니다.
# 원하신다면 다른 이름(예: my-cool-db)으로 바꾸셔도 되지만, 
# 앞으로 나오는 모든 명령어에서 그 이름을 똑같이 써야 한다는 걸 잊지 마세요!
npx wrangler d1 create ba-sqlite-d1
```

명령어를 입력하면 화면에 `database_id` 가 출력됩니다. (예: `c70b0fef-...-07a30b82b07a`) 이 고유 ID 값을 어딘가에 메모해 두세요.

---

## ⚙️ 3단계: 환경 설정 파일 작성

프로젝트에는 두 가지 설정 파일이 필요합니다. 샘플 파일을 복사해서 사용합니다.

### 1. wrangler.toml 설정
`wrangler.toml.example` 파일을 복사하여 `wrangler.toml` 파일을 만듭니다.
- `database_name`: 2단계에서 본인이 지은 이름을 입력하세요.
- `database_id`: 위에서 메모한 고유 ID를 붙여넣으세요.

### 2. .env 설정
`.env.example` 파일을 복사하여 `.env` 파일을 만듭니다.
- `BETTER_AUTH_SECRET`: 보안을 위해 아주 긴 랜덤 문자열을 아무거나 입력하세요.
- 소셜 로그인을 원하시면 각 사이트에서 발급받은 ID와 Secret을 입력하세요.

---

## 🏗️ 4단계: 클라우드 서버 데이터베이스 테이블 만들기

실제 인터넷에 배포된 사이트가 사용할 데이터베이스 테이블을 생성합니다. 

> [!IMPORTANT]
> 이 명령을 실행하지 않으면 배포된 사이트에서 로그인을 할 때 "테이블을 찾을 수 없다"는 에러가 발생합니다. 반드시 실행해 주세요!

```bash
# 구문 예시 (ba-sqlite-d1 자리에 본인의 DB 이름을 넣으세요)
npx wrangler d1 execute ba-sqlite-d1 --file=./drizzle/0000_init.sql --remote
```

---

## 🌍 5단계: 인터넷에 배포하기 (Cloudflare Pages)

이제 전 세계 누구나 접속할 수 있도록 인터넷에 올립니다.

```bash
# 1. 프로젝트 빌드 (컴파일)
npm run build

# 2. 배포 실행
# [원하는_프로젝트_이름]은 내 사이트의 주소(예: 이름.pages.dev)가 됩니다.
# 처음 실행 시 아래와 같이 질문이 나오면 순서대로 입력하세요:
#   1) "Would you like to create a new project? (Y/n)" -> 'y' 입력
#   2) "Enter the production branch name: (main)" -> '엔터' 입력
# (2025년 12월 기준 안내이며, 추후 Cloudflare CLI 정책에 따라 절차나 질문이 변경될 수 있습니다.)
npx wrangler pages deploy .svelte-kit/cloudflare --project-name [원하는_프로젝트_이름]
```

---

## 🔐 6단계: Cloudflare 대시보드 환경 변수 설정 (필수!)

**가장 중요한 단계입니다!** 배포된 사이트가 정상적으로 작동하려면 Cloudflare 대시보드에서 보안 키를 입력해줘야 합니다.

1. [Cloudflare 대시보드](https://dash.cloudflare.com/) 접속 -> **Workers & Pages** -> 본인의 프로젝트 선택
2. **Settings** -> **Variables and Secrets** 메뉴 클릭
3. **Production** 섹션에 아래 변수들을 반드시 추가하세요:
    - `BETTER_AUTH_SECRET`: 아주 긴 랜덤 문자열 (보안용)
    - `BETTER_AUTH_URL`: 배포된 내 사이트 주소 (예: `https://your-app.pages.dev`)
    - `GOOGLE_CLIENT_ID` 등 소셜 로그인 키값들 (해당하는 경우)
4. **Save**를 눌러 저장합니다. (**주의**: 저장만으로는 즉시 적용되지 않으며, 배포된 사이트에 반영하려면 **반드시 5단계의 배포 명령(`npx wrangler pages deploy...`)을 다시 실행**해야 합니다.)

> [!WARNING]
> 이 설정을 하지 않으면 사이트 접속 시 오류가 발생합니다.

---

## ⚠️ 주의사항

- **보안**: `wrangler.toml`과 `.env` 파일은 절대 깃허브(GitHub)에 올리지 마세요. 
- **이름 일치**: DB 이름을 바꿨다면 `wrangler.toml` 안의 명칭도 똑같이 수정해야 합니다. 
- **소셜 로그인**: 리다이렉트 URI를 개발자 센터에 아래 형식으로 등록하세요. (**`https` 필수**)
    - Google: `https://[내_도메인]/api/auth/callback/google`
    - Naver: `https://[내_도메인]/api/auth/callback/naver`
    - Kakao: `https://[내_도메인]/api/auth/callback/kakao`

이제 당신만의 안전한 인증 시스템이 완성되었습니다! 👗
