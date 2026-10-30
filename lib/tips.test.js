import { getTips, pickTip } from './tips'

test('コツを3件返す', async () => {
  const tips = await getTips()
  expect(tips).toHaveLength(3)
  expect(tips[0]).toEqual({ id: 1, text: expect.any(String) })
})
test.each([
  [0, 1],
  [2, 3],
  [3, 1],
  [6, 1],
])('曜日 %i なら id %i のコツを選ぶ', async (day, expectedId) => {
  const tips = await getTips()
  expect(pickTip(tips, day).id).toBe(expectedId)
})
