import { beforeEach, describe, expect, it } from 'vitest'
import { addTask, listTasks, resetTasksForTest } from './tasks'

describe('Nuxt task store', () => {
  beforeEach(resetTasksForTest)

  it('returns the initial task', () => {
    expect(listTasks()).toEqual([
      { id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false },
    ])
  })

  it('adds a task that can be read back by the API layer', () => {
    const created = addTask('Nitro handler をテストする')

    expect(created).toMatchObject({ title: 'Nitro handler をテストする', done: false })
    expect(listTasks()).toContainEqual(created)
  })
})
