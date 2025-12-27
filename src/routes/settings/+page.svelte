<script lang="ts">
    import { authClient } from "$lib/auth-client";
    import { onMount } from "svelte";

    const session = authClient.useSession();
    let newName = "";
    let message = "";
    let isSaving = false;

    onMount(() => {
        if ($session.data) {
            newName = $session.data.user.name;
        }
    });

    async function updateName() {
        if (!$session.data) return;
        if (newName === $session.data.user.name) {
            message = "현재 이름과 같습니다.";
            return;
        }

        isSaving = true;
        message = "";

        const { error } = await authClient.updateUser({
            name: newName,
        });

        if (error) {
            console.error("Update failed:", error);
            if (
                error.status === 500 ||
                error.message?.includes("UNIQUE") ||
                error.message?.includes("already exists")
            ) {
                message =
                    "❌ 이미 사용 중인 이름입니다. 다른 이름을 입력해 주세요.";
            } else {
                message =
                    "❌ 에러 발생: " + (error.message || "알 수 없는 오류");
            }
        } else {
            message = "이름이 성공적으로 변경되었습니다! ✅";
        }
        isSaving = false;
    }
</script>

<svelte:head>
    <title>계정 설정 - SvelteKit Auth</title>
</svelte:head>

<div class="settings-container">
    <h1>계정 설정</h1>

    <div class="card">
        <div class="field">
            <label for="name">디스플레이 이름</label>
            <p class="description">
                다른 사용자에게 표시되는 이름을 변경합니다.
            </p>
            <input
                type="text"
                id="name"
                bind:value={newName}
                placeholder="새 이름 입력"
                disabled={isSaving}
            />
        </div>

        <button
            on:click={updateName}
            class="save-btn"
            disabled={isSaving || !newName}
        >
            {isSaving ? "저장 중..." : "변경사항 저장"}
        </button>

        {#if message}
            <p class="status-msg" class:error={message.includes("❌")}>
                {message}
            </p>
        {/if}
    </div>

    <div class="back-link">
        <a href="/">← 홈으로 돌아가기</a>
    </div>
</div>

<style>
    .settings-container {
        max-width: 500px;
        margin: 4rem auto;
        padding: 0 1rem;
    }

    h1 {
        font-size: 1.8rem;
        color: #333;
        margin-bottom: 2rem;
        text-align: center;
    }

    .card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        border: 1px solid #f0f0f0;
    }

    .field {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: #444;
    }

    .description {
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 0.75rem;
    }

    input {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    input:disabled {
        background-color: #f8f9fa;
        cursor: not-allowed;
    }

    .save-btn {
        width: 100%;
        padding: 0.8rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition:
            background-color 0.2s,
            transform 0.1s;
    }

    .save-btn:hover:not(:disabled) {
        background-color: #0056b3;
    }

    .save-btn:active:not(:disabled) {
        transform: scale(0.98);
    }

    .save-btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .status-msg {
        margin-top: 1.25rem;
        padding: 0.75rem;
        border-radius: 6px;
        font-size: 0.9rem;
        text-align: center;
        background-color: #e7f3ff;
        color: #005eb8;
    }

    .status-msg.error {
        background-color: #fff0f0;
        color: #d11a2a;
    }

    .back-link {
        margin-top: 2rem;
        text-align: center;
    }

    .back-link a {
        color: #666;
        text-decoration: none;
        font-size: 0.9rem;
    }

    .back-link a:hover {
        color: #007bff;
        text-decoration: underline;
    }
</style>
