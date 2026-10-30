import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchSampleTodos } from '@/lib/api'
import TodoApp from './TodoApp'

jest.mock('@/lib/api')

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('TodoApp Integration Tests', () => {
  test('すべて削除：キャンセルしたら何も消えない', async () => {
    const user = userEvent.setup()
    localStorage.setItem('todos', JSON.stringify([{ id: '1', text: '牛乳を買う', done: false }]))
    jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<TodoApp />)

    await user.click(screen.getByRole('button', { name: 'すべて削除' }))

    expect(window.confirm).toHaveBeenCalledWith('すべての TODO を削除しますか？')
    expect(screen.getByText('牛乳を買う')).toBeInTheDocument()
  })

  test('すべて削除：OK なら全部消える', async () => {
    const user = userEvent.setup()
    localStorage.setItem('todos', JSON.stringify([{ id: '1', text: '牛乳を買う', done: false }]))
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    render(<TodoApp />)

    await user.click(screen.getByRole('button', { name: 'すべて削除' }))

    expect(screen.getByText('やることはありません')).toBeInTheDocument()
  })

  test('サンプルを読み込むと一覧に追加される', async () => {
    const user = userEvent.setup()
    localStorage.setItem('todos', JSON.stringify([{ id: '1', text: '牛乳を買う', done: false }]))
    fetchSampleTodos.mockResolvedValue(['サンプル1', 'サンプル2'])
    render(<TodoApp />)

    await user.click(screen.getByRole('button', { name: 'サンプルを読み込む' }))

    expect(await screen.findByText('サンプル2')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText(/残り 3 件/)).toBeInTheDocument()
  })

  test('handleAdd: 新しい TODO を追加できる', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByRole('textbox', { name: 'やること' })
    await user.type(input, '卵を買う')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(screen.getByText('卵を買う')).toBeInTheDocument()
  })

  test('handleToggle: TODO の完了状態を切り替えられる', async () => {
    const user = userEvent.setup()
    localStorage.setItem('todos', JSON.stringify([{ id: '1', text: '牛乳を買う', done: false }]))
    render(<TodoApp />)

    const checkbox = screen.getByRole('checkbox', { name: '牛乳を買う' })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)

    expect(checkbox).toBeChecked()
  })

  test('handleDelete: aria-label に対応した削除ボタンで削除できる', async () => {
    const user = userEvent.setup()
    localStorage.setItem('todos', JSON.stringify([{ id: '1', text: '牛乳を買う', done: false }]))
    render(<TodoApp />)

    // aria-label="牛乳を買うを削除" を指定して特定
    await user.click(screen.getByRole('button', { name: '牛乳を買うを削除' }))

    expect(screen.queryByText('牛乳を買う')).not.toBeInTheDocument()
  })

  test('handleEdit: ダブルクリックで編集を開始し、Enter で確定できる', async () => {
    const user = userEvent.setup()
    localStorage.setItem('todos', JSON.stringify([{ id: '1', text: '牛乳を買う', done: false }]))
    render(<TodoApp />)

    // テキスト要素をダブルクリックして編集モードへ
    const todoText = screen.getByText('牛乳を買う')
    await user.dblClick(todoText)

    // 編集用 input を取得し、テキストを変更して Enter 押下
    const editInput = screen.getByRole('textbox', { name: '牛乳を買うを編集' })
    await user.clear(editInput)
    await user.type(editInput, '豆乳を買う{Enter}')

    expect(screen.getByText('豆乳を買う')).toBeInTheDocument()
    expect(screen.queryByText('牛乳を買う')).not.toBeInTheDocument()
  })

  test('handleClearDone: 完了済みの TODO のみ削除される（キャンセル時は維持）', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { id: '1', text: '牛乳を買う', done: true },
        { id: '2', text: 'パンを買う', done: false },
      ])
    )

    // キャンセル時
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<TodoApp />)

    await user.click(screen.getByRole('button', { name: '完了済みを削除' }))

    expect(confirmSpy).toHaveBeenCalledWith('完了済みの TODO を削除しますか？')
    expect(screen.getByText('牛乳を買う')).toBeInTheDocument()
    expect(screen.getByText('パンを買う')).toBeInTheDocument()

    // OK 時
    confirmSpy.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: '完了済みを削除' }))

    expect(screen.queryByText('牛乳を買う')).not.toBeInTheDocument()
    expect(screen.getByText('パンを買う')).toBeInTheDocument()
  })
})