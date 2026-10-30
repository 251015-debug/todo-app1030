import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoForm from './TodoForm'

test('handleSubmit: 空文字送信時にエラーメッセージが表示され onAdd が呼ばれない', async () => {
  const user = userEvent.setup()
  const mockOnAdd = jest.fn()
  render(<TodoForm onAdd={mockOnAdd} />)

  const input = screen.getByRole('textbox')
  await user.type(input, '   ')
  await user.click(screen.getByRole('button', { name: '追加' }))

  expect(screen.getByText('やることを入力してください')).toBeInTheDocument()
  expect(mockOnAdd).not.toHaveBeenCalled()
})

test('handleSubmit: 正しい入力値で送信された場合に onAdd が呼ばれフォームがリセットされる', async () => {
  const user = userEvent.setup()
  const mockOnAdd = jest.fn()
  render(<TodoForm onAdd={mockOnAdd} />)

  const input = screen.getByRole('textbox')
  await user.type(input, '本を買う')
  await user.click(screen.getByRole('button', { name: '追加' }))

  expect(mockOnAdd).toHaveBeenCalledWith('本を買う')
  expect(input).toHaveValue('')
})

test('handleChange: 文字を入力するとエラーメッセージが消去される', async () => {
  const user = userEvent.setup()
  const mockOnAdd = jest.fn()
  render(<TodoForm onAdd={mockOnAdd} />)

  const input = screen.getByRole('textbox')

  // 空で送信してエラーを出す
  await user.click(screen.getByRole('button', { name: '追加' }))
  expect(screen.getByText('やることを入力してください')).toBeInTheDocument()

  // 文字を入力したらエラーが消えるか確認
  await user.type(input, 'あ')
  expect(screen.queryByText('やることを入力してください')).not.toBeInTheDocument()
})