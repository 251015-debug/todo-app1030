import { render, screen } from '@testing-library/react'
import TipsPage from './page'

test('コツが3件表示される', async () => {
  render(await TipsPage())
  expect(screen.getByRole('heading', { name: 'TODOのコツ' })).toBeInTheDocument()
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
})
