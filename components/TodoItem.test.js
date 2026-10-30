import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from './TodoItem'

const mockTodo = { id: '1', text: '牛乳を買う', done: false }
const mockOnToggle = jest.fn()
const mockOnDelete = jest.fn()
const mockOnEdit = jest.fn()

// 各テストの実行前（beforeEach）にモックの呼び出し履歴をリセット
beforeEach(() => {
  jest.clearAllMocks()
})

const renderTodoItem = (props = {}) => {
  return render(
    <TodoItem
      todo={mockTodo}
      onToggle={mockOnToggle}
      onDelete={mockOnDelete}
      onEdit={mockOnEdit}
      {...props}
    />
  )
}

test('startEdit: 編集モードに切り替わり、現在の TODO テキストが初期値として入力欄に入ること', async () => {
  const user = userEvent.setup()
  renderTodoItem()

  const todoSpan = screen.getByText('牛乳を買う')
  await user.dblClick(todoSpan)

  const editInput = screen.getByRole('textbox', { name: '牛乳を買うを編集' })
  expect(editInput).toBeInTheDocument()
  expect(editInput).toHaveValue('牛乳を買う')
})

test('finishEdit (onBlur): フォーカスが外れたときに編集内容が保存されること', async () => {
  const user = userEvent.setup()
  renderTodoItem()

  await user.dblClick(screen.getByText('牛乳を買う'))
  const editInput = screen.getByRole('textbox', { name: '牛乳を買うを編集' })

  await user.clear(editInput)
  await user.type(editInput, '豆乳を買う')
  await user.click(document.body)

  expect(mockOnEdit).toHaveBeenCalledWith('1', '豆乳を買う')
})

test('handleKeyDown (Enter): Enter キー押下で編集内容が確定・保存されること', async () => {
  const user = userEvent.setup()
  renderTodoItem()

  await user.dblClick(screen.getByText('牛乳を買う'))
  const editInput = screen.getByRole('textbox', { name: '牛乳を買うを編集' })

  await user.clear(editInput)
  await user.type(editInput, 'ジュースを買う{Enter}')

  expect(mockOnEdit).toHaveBeenCalledWith('1', 'ジュースを買う')
})

test('handleKeyDown (Escape): Escape キー押下で編集がキャンセルされ元のテキストが維持されること', async () => {
  const user = userEvent.setup()
  renderTodoItem()

  await user.dblClick(screen.getByText('牛乳を買う'))
  const editInput = screen.getByRole('textbox', { name: '牛乳を買うを編集' })

  await user.clear(editInput)
  await user.type(editInput, '変更途中のテキスト{Escape}')

  expect(mockOnEdit).not.toHaveBeenCalled()
  expect(screen.getByText('牛乳を買う')).toBeInTheDocument()
})

test('onToggle: チェックボックスをクリックすると onToggle が呼び出され完了状態が切り替わること', async () => {
  const user = userEvent.setup()
  renderTodoItem()

  const checkbox = screen.getByRole('checkbox')
  await user.click(checkbox)

  expect(mockOnToggle).toHaveBeenCalledWith('1')
})

test('onDelete: aria-label で指定された削除ボタンをクリックすると onDelete が呼び出されること', async () => {
  const user = userEvent.setup()
  renderTodoItem()

  const deleteButton = screen.getByRole('button', { name: '牛乳を買うを削除' })
  await user.click(deleteButton)

  expect(mockOnDelete).toHaveBeenCalledWith('1')
})

test('startEdit (onDoubleClick): TODO のテキスト要素をダブルクリックすると編集モードに切り替わること', async () => {
  const user = userEvent.setup()
  renderTodoItem()

  const todoSpan = screen.getByText('牛乳を買う')
  await user.dblClick(todoSpan)

  const editInput = screen.getByRole('textbox', { name: '牛乳を買うを編集' })
  expect(editInput).toBeInTheDocument()
})