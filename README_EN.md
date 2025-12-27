[한국어 버전은 여기를 클릭하세요 (README_KR.md)](./README_KR.md)

---

# SvelteKit + Better Auth + Cloudflare D1 Guide 👗

This project is a beginner-friendly authentication system built using SvelteKit, Better Auth, and Cloudflare D1 (Database). Even if you're a complete beginner, follow this guide to build and deploy your own auth server in 10 minutes.

---

## 🚀 Prerequisites

1. **Install Node.js**: Download and install the latest LTS version from [nodejs.org](https://nodejs.org/).
2. **Cloudflare Account**: You need a free account at [cloudflare.com](https://www.cloudflare.com/).
3. **Developer Accounts (Optional)**: To use social login, you'll need Client IDs and Secrets from Google, Naver, or Kakao developer consoles.

---

## 🛠️ Step 1: Installation & Login

Open your terminal and run the following commands in order.

```bash
# 1. Install dependencies
npm install

# 2. Login to Cloudflare (Allow access in the browser window that opens)
npx wrangler login
```

---

## 💾 Step 2: Create D1 Database

Create a Cloudflare D1 database (powered by SQLite).

```bash
# Create the database
# In this example, we use the name 'ba-sqlite-d1'.
# You can choose any name you like (e.g., 'my-cool-db'), 
# but remember to use that EXACT name in all upcoming commands!
npx wrangler d1 create ba-sqlite-d1
```

After running this, copy the `database_id` displayed in the terminal (e.g., `c70b0fef-...-07a30b82b07a`). Save this ID somewhere safe.

---

## ⚙️ Step 3: Configuration Files

You need to set up two main configuration files using the provided examples.

### 1. `wrangler.toml` Setup
Copy `wrangler.toml.example` to create a `wrangler.toml` file.
- `database_name`: Enter the name you chose in Step 2.
- `database_id`: Paste your unique `database_id`.

### 2. `.env` Setup
Copy `.env.example` to create a `.env` file.
- `BETTER_AUTH_SECRET`: Enter any long, random string for security.
- Add your Social Login Client IDs and Secrets if available.

---

## 🏗️ Step 4: Create Cloud Database Tables

Create the database tables for your live website.

> [!IMPORTANT]
> If you skip this, your live site will throw a "Table not found" error during login. Make sure to run this!

```bash
# Example (Replace 'ba-sqlite-d1' with your chosen DB name)
npx wrangler d1 execute ba-sqlite-d1 --file=./drizzle/0000_init.sql --remote
```

---

## 🌍 Step 5: Deploy to the Internet (Cloudflare Pages)

Publish your project for the whole world to see.

```bash
# 1. Build the project
npm run build

# 2. Deploy
# [your-project-name] will become your site's URL (e.g., your-project-name.pages.dev).
# On the first run, answer the following prompts in order:
#   1) "Would you like to create a new project? (Y/n)" -> Press 'y'
#   2) "Enter the production branch name: (main)" -> Press 'Enter'
# (Info as of Dec 2025. This flow may change as Cloudflare updates their CLI.)
npx wrangler pages deploy .svelte-kit/cloudflare --project-name [your-project-name]
```

---

## 🔐 Step 6: Cloudflare Dashboard Environment Variables (Required!)

**The most critical step!** For your live site to work, you must add your security keys to the Cloudflare dashboard.

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> Select your Project.
2. Navigate to **Settings** -> **Variables and Secrets**.
3. Under the **Production** section, add the following variables:
    - `BETTER_AUTH_SECRET`: A long, random string (for security).
    - `BETTER_AUTH_URL`: Your live site URL (e.g., `https://your-app.pages.dev`).
    - `GOOGLE_CLIENT_ID` and other keys (if applicable).
4. Click **Save**. (**Important**: Saving alone does not apply the changes immediately. To reflect them on your live site, you **MUST run the deployment command from Step 5 (`npx wrangler pages deploy...`) again**.)

> [!WARNING]
> Without these settings, your site will encounter errors or fail to load.

---

## ⚠️ Important Notes

- **Security**: NEVER upload your `wrangler.toml` or `.env` files to GitHub.
- **Consistency**: If you chose a custom DB name, update it in your `wrangler.toml` as well.
- **Social Login**: Register your Redirect URIs in developer consoles as follows (**`https` Required**):
    - Google: `https://[your-domain]/api/auth/callback/google`
    - Naver: `https://[your-domain]/api/auth/callback/naver`
    - Kakao: `https://[your-domain]/api/auth/callback/kakao`

Your secure authentication system is now ready! 👗
