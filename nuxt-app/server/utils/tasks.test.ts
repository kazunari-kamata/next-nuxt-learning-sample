import { beforeEach, describe, expect, it } from 'vitest'
import { addTask, deleteTask, listTasks, resetTasksForTest, updateTask } from './tasks'

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

  it('updates the title and completion state of an existing task', () => {
    const updated = updateTask(1, { title: '更新済みの task', done: true })

    expect(updated).toEqual({ id: 1, title: '更新済みの task', done: true })
    expect(listTasks()).toContainEqual(updated)
  })

  it('preserves fields that are not supplied by a partial update', () => {
    expect(updateTask(1, { done: true })).toEqual({
      id: 1,
      title: 'Next.js と Nuxt の対応を比べる',
      done: true,
    })
  })

  it('deletes an existing task and returns undefined for unknown tasks', () => {
    expect(deleteTask(1)).toMatchObject({ id: 1 })
    expect(listTasks()).toEqual([])
    expect(deleteTask(999)).toBeUndefined()
    expect(updateTask(999, { done: true })).toBeUndefined()
  })
})
