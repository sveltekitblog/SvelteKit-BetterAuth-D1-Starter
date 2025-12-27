<script lang="ts">
    import { authClient } from "$lib/auth-client";

    const session = authClient.useSession();

    async function handleLogout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                },
            },
        });
    }
</script>

<header class="header">
    <div class="logo">
        <a href="/">SvelteKit Auth</a>
    </div>
    <nav>
        {#if $session.data}
            <div class="user-info">
                <span class="user-details">
                    <strong>{$session.data.user.name}</strong>
                    ({$session.data.user.role || "user"})
                </span>
                <div class="header-actions">
                    <a href="/settings" class="icon-btn" title="Settings">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            ><path
                                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                            /><circle cx="12" cy="12" r="3" /></svg
                        >
                    </a>
                    <button on:click={handleLogout} class="logout-btn"
                        >Logout</button
                    >
                </div>
            </div>
        {:else}
            <div class="auth-links">
                <span>Welcome, please log in</span>
            </div>
        {/if}
    </nav>
</header>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #fff;
        border-bottom: 1px solid #eee;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .logo a {
        font-size: 1.25rem;
        font-weight: bold;
        color: #007bff;
        text-decoration: none;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .user-details {
        font-size: 0.95rem;
        color: #333;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .icon-btn {
        background: none;
        border: none;
        color: #666;
        padding: 0.4rem;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color 0.2s,
            color 0.2s;
    }

    .icon-btn:hover {
        background-color: #f0f0f0;
        color: #007bff;
    }

    .logout-btn {
        background-color: #f8f9fa;
        color: #555;
        border: 1px solid #ddd;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.2s;
    }

    .logout-btn:hover {
        background-color: #e9ecef;
        border-color: #ccc;
        color: #333;
    }

    .auth-links {
        color: #666;
        font-size: 0.9rem;
    }
</style>
