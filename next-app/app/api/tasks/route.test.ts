import { beforeEach, describe, expect, it } from 'vitest'
import { GET, POST } from './route'
import { resetTasksForTest } from './store'
import { DELETE, PATCH } from './[id]/route'

const initialTaskContext = { params: Promise.resolve({ id: '1' }) }

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

  it('PATCH updates a task', async () => {
    const response = await PATCH(new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ title: '更新済みの task', done: true }),
    }), initialTaskContext)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ id: 1, title: '更新済みの task', done: true })
  })

  it('PATCH preserves fields that are not supplied', async () => {
    const response = await PATCH(new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ done: true }),
    }), initialTaskContext)

    await expect(response.json()).resolves.toMatchObject({
      id: 1,
      title: 'Next.js と Nuxt の対応を比べる',
      done: true,
    })
  })

  it('PATCH rejects an empty update and an unknown task', async () => {
    const emptyResponse = await PATCH(new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({}),
    }), initialTaskContext)
    const missingResponse = await PATCH(new Request('http://localhost/api/tasks/999', {
      method: 'PATCH',
      body: JSON.stringify({ done: true }),
    }), { params: Promise.resolve({ id: '999' }) })

    expect(emptyResponse.status).toBe(400)
    expect(missingResponse.status).toBe(404)
  })

  it('PATCH rejects an invalid task id', async () => {
    const response = await PATCH(new Request('http://localhost/api/tasks/not-an-id', {
      method: 'PATCH',
      body: JSON.stringify({ done: true }),
    }), { params: Promise.resolve({ id: 'not-an-id' }) })

    expect(response.status).toBe(400)
  })

  it('DELETE removes a task and reports an unknown task', async () => {
    const deletedResponse = await DELETE(new Request('http://localhost/api/tasks/1', { method: 'DELETE' }), initialTaskContext)
    const missingResponse = await DELETE(new Request('http://localhost/api/tasks/999', { method: 'DELETE' }), {
      params: Promise.resolve({ id: '999' }),
    })

    expect(deletedResponse.status).toBe(204)
    expect(missingResponse.status).toBe(404)
    await expect(GET().json()).resolves.toEqual([])
  })
})
