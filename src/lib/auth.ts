import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './server/db';
import { admin } from "better-auth/plugins";
import { env } from '$env/dynamic/private';

export const getAuth = (D1: D1Database) => betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db(D1), {
        provider: 'sqlite'
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID || '',
            clientSecret: env.GOOGLE_CLIENT_SECRET || ''
        },
        naver: {
            clientId: env.NAVER_CLIENT_ID || '',
            clientSecret: env.NAVER_CLIENT_SECRET || ''
        },
        kakao: {
            clientId: env.KAKAO_CLIENT_ID || '',
            clientSecret: env.KAKAO_CLIENT_SECRET || ''
        }
    },
    plugins: [
        admin({
            defaultRole: "user",
        }),
    ],
});
