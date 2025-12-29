import { getAuth } from "$lib/auth";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect, fail } from "@sveltejs/kit";
import type { Actions, RequestEvent } from "./$types";

export const actions: Actions = {
    deleteAccount: async (event: RequestEvent) => {
        const D1 = event.platform?.env.DB;
        if (!D1) {
            return fail(500, { message: "데이터베이스 연결 오류" });
        }

        const auth = getAuth(D1);
        const session = await auth.api.getSession({
            headers: event.request.headers
        });

        if (!session) {
            return fail(401, { message: "로그인이 필요합니다." });
        }

        try {
            // 서버 사이드에서 세션 유저의 ID와 요청이 일치하는지 재확인 (보안 핵심)
            const userId = session.user.id;

            // Drizzle을 사용해 유저 삭제 (Cascade 설정으로 인해 관련 데이터 자동 삭제됨)
            await db(D1).delete(user).where(eq(user.id, userId));
        } catch (e) {
            console.error("Account deletion error:", e);
            return fail(500, { message: "계정 삭제 중 오류가 발생했습니다." });
        }

        throw redirect(303, "/");
    }
};
