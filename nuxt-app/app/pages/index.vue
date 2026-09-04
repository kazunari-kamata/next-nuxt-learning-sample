<script setup lang="ts">
type Task = { id: number; title: string; done: boolean }

// Nuxt は ref / computed を auto-import するため、Vue import を書かずに状態を宣言できます。
const title = ref('')
const requestStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
// SSR の静的 HTML が表示された後、onMounted で Vue のイベント処理が接続されたことを示します。
const isInteractive = ref(false)
// useFetch は SSR の結果を payload に引き継ぐので、hydrate 時の重複取得を避けられます。
const { data: tasks, refresh } = await useFetch<Task[]>('/api/tasks', { default: () => [] })
const remaining = computed(() => tasks.value.filter((task) => !task.done).length)
const debugMode = String(useRuntimeConfig().public.debugMode) === 'true'
const debugSnapshot = computed(() => JSON.stringify({ requestStatus: requestStatus.value, tasks: tasks.value }, null, 2))

onMounted(() => {
  isInteractive.value = true
})

async function addTask() {
  if (!title.value.trim()) return
  // 更新後に useFetch の refresh を呼び、SSR と同じデータソースから一覧を更新します。
  requestStatus.value = 'loading'
  try {
    await $fetch('/api/tasks', { method: 'POST', body: { title: title.value } })
    title.value = ''
    await refresh()
    requestStatus.value = 'success'
  } catch (error) {
    console.error(error)
    requestStatus.value = 'error'
  }
}
</script>

<template>
  <main>
    <p class="eyebrow">Vue + File-based Routing</p>
    <h1>Nuxt のタスク一覧</h1>
    <p>このページでは <code>useFetch</code> で SSR 対応のデータ取得を行います。</p>
    <section class="card">
      <h2>Vue SFC: pages/index.vue</h2>
      <form data-testid="task-form" :data-interactive="isInteractive" @submit.prevent="addTask">
        <input v-model="title" aria-label="タスク名" placeholder="例: ルーティングを比較する">
        <button type="submit">追加</button>
      </form>
      <p>未完了: {{ remaining }} 件</p>
      <ul><li v-for="task in tasks" :key="task.id">{{ task.done ? '✓' : '○' }} {{ task.title }}</li></ul>
      <details v-if="debugMode" class="debug-panel">
        <summary>Debug mode: client state</summary>
        <pre>{{ debugSnapshot }}</pre>
      </details>
    </section>
  </main>
</template>

<style>
:root { color: #1f2937; background: #f8fafc; font-family: system-ui, sans-serif; }
body { margin: 0; }
main { max-width: 680px; margin: 4rem auto; padding: 0 1.5rem; }
.eyebrow { color: #047857; font-weight: 700; }
.card { margin-top: 2rem; padding: 1.5rem; border-radius: 12px; background: white; box-shadow: 0 4px 20px #0f172a12; }
form { display: flex; gap: .5rem; }
input { flex: 1; min-width: 0; padding: .65rem; border: 1px solid #94a3b8; border-radius: 6px; }
button { padding: .65rem 1rem; border: 0; border-radius: 6px; background: #047857; color: white; cursor: pointer; }
li { margin: .5rem 0; }
.debug-panel { margin-top: 1rem; padding: .75rem; border: 1px solid #6ee7b7; border-radius: 6px; background: #ecfdf5; }
.debug-panel pre { overflow: auto; white-space: pre-wrap; }
</style>
