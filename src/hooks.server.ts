import { getAuth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/api/auth')) {
        const D1 = event.platform?.env.DB;
        if (!D1) {
            console.error('D1 Database binding (DB) not found in platform.env');
            return resolve(event);
        }
        const auth = getAuth(D1);
        console.log('Better Auth Request:', event.url.pathname);
        return svelteKitHandler({ event, resolve, auth, building });
    }
    return resolve(event);
};
