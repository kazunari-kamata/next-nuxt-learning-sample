import { expect, test } from '@playwright/test'

const applications = [
  {
    name: 'Next.js',
    url: 'http://localhost:3000',
    heading: 'Next.js のタスク一覧',
    interactiveSelector: 'form',
  },
  {
    name: 'Nuxt',
    url: 'http://localhost:3001',
    heading: 'Nuxt のタスク一覧',
    interactiveSelector: '[data-testid="task-form"][data-interactive="true"]',
  },
]

for (const application of applications) {
  test(`${application.name} completes the task CRUD flow through the browser`, async ({ page }) => {
    const title = `Playwright ${application.name} task ${Date.now()}`

    await page.goto(application.url)
    await expect(page.getByRole('heading', { name: application.heading })).toBeVisible()
    await expect(page.locator(application.interactiveSelector)).toBeVisible()
    await page.getByLabel('タスク名').fill(title)
    const postResponse = page.waitForResponse((response) => (
      response.url().endsWith('/api/tasks') && response.request().method() === 'POST'
    ))
    await page.getByRole('button', { name: '追加' }).click()
    const createdResponse = await postResponse
    expect(createdResponse.status()).toBe(201)
    const createdTask = await createdResponse.json() as { id: number }
    const taskItem = page.getByRole('listitem').filter({ hasText: title })
    await expect(taskItem).toBeVisible()

    const updateResponse = page.waitForResponse((response) => (
      response.url().endsWith(`/api/tasks/${createdTask.id}`) && response.request().method() === 'PATCH'
    ))
    await taskItem.getByRole('button', { name: '完了にする' }).click()
    expect((await updateResponse).status()).toBe(200)
    await expect(taskItem).toContainText(`✓ ${title}`)

    const deleteResponse = page.waitForResponse((response) => (
      response.url().endsWith(`/api/tasks/${createdTask.id}`) && response.request().method() === 'DELETE'
    ))
    await taskItem.getByRole('button', { name: '削除' }).click()
    expect((await deleteResponse).status()).toBe(204)
    await expect(taskItem).toBeHidden()
  })
}
