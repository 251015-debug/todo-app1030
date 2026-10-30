import { render, screen } from '@testing-library/react'
import TodoApp from './TodoAppClient'
// next/dynamic の動作をモック化し、同期的にコンポーネントを読み込むように設定
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="todo-app">TodoApp Mock Component</div>
  return DynamicComponent
})

describe('TodoApp Wrapper Component', () => {
  it('TodoAppコンポーネントが正しくレンダリングされること', () => {
    render(<TodoApp />)

    // モック化したTodoAppが表示されているか検証
    const todoAppElement = screen.getByTestId('todo-app')
    expect(todoAppElement).toBeInDOM
    expect(todoAppElement).toHaveTextContent('TodoApp Mock Component')
  })
})