<script lang="ts">
    let email = "";
    let password = "";
    let confirmPassword = "";
    let name = "";
    let message = "";
    let isLogin = true;

    import { authClient } from "$lib/auth-client";

    async function handleAuth() {
        if (!isLogin && password !== confirmPassword) {
            message = "Error: Passwords do not match";
            return;
        }

        const endpoint = isLogin
            ? "/api/auth/sign-in/email"
            : "/api/auth/sign-up/email";
        const body = isLogin ? { email, password } : { email, password, name };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            // Handle potentially empty responses
            const text = await res.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                data = { message: "Failed to parse response" };
            }

            if (res.ok) {
                message = isLogin
                    ? "Logged in successfully!"
                    : "Signed up successfully!";

                if (isLogin) {
                    // Refresh the page to update header/session UI
                    window.location.reload();
                } else {
                    isLogin = true; // Switch to login mode after signup
                }
            } else {
                message = `Error: ${data.message || "Authentication failed"} (Status: ${res.status})`;
            }
        } catch (err) {
            message = `Error: ${err}`;
        }
    }

    async function signInWithSocial(provider: "google" | "naver" | "kakao") {
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch (err) {
            message = `Error: ${err}`;
        }
    }
    const session = authClient.useSession();
</script>

<div class="container">
    {#if $session.data}
        <div class="welcome-card">
            <h2>Welcome back, {$session.data.user.name}! 👋</h2>
            <p>
                You are currently logged in as <strong
                    >{$session.data.user.email}</strong
                >.
            </p>
            <p>
                Your role: <span class="badge"
                    >{$session.data.user.role || "user"}</span
                >
            </p>
            <div class="actions">
                <button
                    on:click={() => window.location.reload()}
                    class="primary-btn">Refresh Session</button
                >
            </div>
        </div>
    {:else}
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>

        <form on:submit|preventDefault={handleAuth}>
            {#if !isLogin}
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" bind:value={name} required />
                </div>
            {/if}

            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" bind:value={email} required />
            </div>

            <div>
                <label for="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    required
                />
            </div>

            {#if !isLogin}
                <div>
                    <label for="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        bind:value={confirmPassword}
                        required
                    />
                </div>
            {/if}

            <button type="submit" class="primary-btn"
                >{isLogin ? "Login" : "Sign Up"}</button
            >
        </form>

        <div class="social-auth">
            <p>Or continue with</p>
            <div class="social-btns">
                <button
                    on:click={() => signInWithSocial("google")}
                    class="social-btn google">Google</button
                >
                <button
                    on:click={() => signInWithSocial("naver")}
                    class="social-btn naver">Naver</button
                >
                <button
                    on:click={() => signInWithSocial("kakao")}
                    class="social-btn kakao">Kakao</button
                >
            </div>
        </div>

        <button on:click={() => (isLogin = !isLogin)} class="switch-btn">
            {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
        </button>

        {#if message}
            <p class="message">{message}</p>
        {/if}
    {/if}
</div>

<style>
    .welcome-card {
        text-align: center;
        padding: 1rem;
    }

    .badge {
        background-color: #e9ecef;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-weight: bold;
        text-transform: capitalize;
    }

    .actions {
        margin-top: 2rem;
    }

    .container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    form div {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
    }

    .primary-btn {
        width: 100%;
        padding: 0.75rem;
        margin-top: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    }

    .primary-btn:hover {
        background-color: #0056b3;
    }

    .social-auth {
        margin-top: 1.5rem;
        text-align: center;
        border-top: 1px solid #eee;
        padding-top: 1.5rem;
    }

    .social-auth p {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
    }

    .social-btns {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .social-btn {
        padding: 0.6rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .google {
        background-color: white;
        color: #444;
    }
    .naver {
        background-color: #03cf5d;
        color: white;
        border-color: #03cf5d;
    }
    .kakao {
        background-color: #fee500;
        color: #3c1e1e;
        border-color: #fee500;
    }

    .social-btn:hover {
        opacity: 0.9;
    }

    .switch-btn {
        width: 100%;
        padding: 0.5rem;
        margin-top: 1.5rem;
        background: none;
        border: none;
        color: #007bff;
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .message {
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: #f0f0f0;
        border-radius: 4px;
        text-align: center;
    }
</style>
