import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HistoryList from './HistoryList'

jest.mock('./HistoryItem', () => ({ entry, onClick }) => (
  <li data-testid="history-item" onClick={() => onClick(entry)}>
    {entry.text.slice(0, 60)}
  </li>
))

describe('History', () => {
  const mockOnHistoryClick = jest.fn()
  const history = [
    { id: 1, text: 'Test entry 1' },
    { id: 2, text: 'Test entry 2' },
  ]

  it('does not render if history is empty', () => {
    render(<HistoryList history={[]} onHistoryClick={mockOnHistoryClick} />)
    expect(screen.queryByText('Історія конвертацій:')).toBeNull()
  })

  it('renders history items correctly when history is not empty', () => {
    render(
      <HistoryList history={history} onHistoryClick={mockOnHistoryClick} />,
    )

    // Перевіряємо, чи рендеряться правильні елементи
    history.forEach((entry) => {
      expect(screen.getByText(entry.text.slice(0, 60))).toBeInTheDocument()
    })
  })

  it('calls onHistoryClick when a history item is clicked', () => {
    render(
      <HistoryList history={history} onHistoryClick={mockOnHistoryClick} />,
    )

    // Клікаємо на перший елемент історії
    const historyItem = screen.getByText(history[0].text.slice(0, 60))
    fireEvent.click(historyItem)

    // Перевіряємо, чи викликалась функція з правильним аргументом
    expect(mockOnHistoryClick).toHaveBeenCalledWith(history[0])
    expect(mockOnHistoryClick).toHaveBeenCalledTimes(1)
  })
})
