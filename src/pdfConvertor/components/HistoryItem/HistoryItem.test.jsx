import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HistoryItem from './HistoryItem'

describe('HistoryItem', () => {
  const mockOnClick = jest.fn()
  const entry = {
    id: 1234567890,
    text: 'This is a sample entry for testing purposes that should be sliced at 60 characters.',
  }

  beforeEach(() => {
    render(<HistoryItem entry={entry} onClick={mockOnClick} />)
  })

  it('renders the text of the entry correctly', () => {
    expect(screen.getByText(entry.text.slice(0, 60))).toBeInTheDocument()
  })

  it('renders the correct date for the entry', () => {
    expect(
      screen.getByText(new Date(entry.id).toLocaleDateString()),
    ).toBeInTheDocument()
  })

  it('calls onClick when the button is clicked', () => {
    const button = screen.getByText(entry.text.slice(0, 60))
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
