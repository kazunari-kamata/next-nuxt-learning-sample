import { beforeEach, describe, expect, it } from 'vitest'
import { GET, POST } from './route'
import { resetTasksForTest } from './store'

describe('Next.js Route Handler', () => {
  beforeEach(resetTasksForTest)

  it('GET returns the initial task', async () => {
    const response = GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual([
      { id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false },
    ])
  })

  it('POST creates a task', async () => {
    const response = await POST(new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Route Handler をテストする' }),
    }))

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({ title: 'Route Handler をテストする', done: false })
  })

  it('POST rejects an empty title', async () => {
    const response = await POST(new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '  ' }),
    }))

    expect(response.status).toBe(400)
  })
})
