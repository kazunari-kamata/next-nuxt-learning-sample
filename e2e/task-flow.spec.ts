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
  test(`${application.name} adds a task through the browser`, async ({ page }) => {
    const title = `Playwright ${application.name} task ${Date.now()}`

    await page.goto(application.url)
    await expect(page.getByRole('heading', { name: application.heading })).toBeVisible()
    await expect(page.locator(application.interactiveSelector)).toBeVisible()
    await page.getByLabel('タスク名').fill(title)
    const postResponse = page.waitForResponse((response) => (
      response.url().endsWith('/api/tasks') && response.request().method() === 'POST'
    ))
    await page.getByRole('button', { name: '追加' }).click()
    await expect((await postResponse).status()).toBe(201)
    await expect(page.getByText(title)).toBeVisible()
  })
}
