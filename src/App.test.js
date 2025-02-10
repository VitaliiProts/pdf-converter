import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import '@testing-library/jest-dom'

const localStorageMock = (function () {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
  }
})()

global.localStorage = localStorageMock

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Конвертер тексту у PDF')).toBeInTheDocument()
  })

  it('loads history from localStorage', () => {
    localStorage.setItem(
      'pdfHistory',
      JSON.stringify([{ id: 1, text: 'Test', pdfData: 'somePdfData' }]),
    )

    render(<App />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('adds new history entry when PDF is generated', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      blob: jest
        .fn()
        .mockResolvedValueOnce(new Blob(['test'], { type: 'application/pdf' })),
    })

    render(<App />)
    const textArea = screen.getByPlaceholderText('Введіть текст...')
    fireEvent.change(textArea, { target: { value: 'Test text' } })

    const button = screen.getByText('Конвертувати в PDF')
    fireEvent.click(button)

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    await waitFor(() => {
      expect(screen.getByText('Test text')).toBeInTheDocument()
    })
  })

  it('displays error if API request fails', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('API error'))

    render(<App />)
    const textArea = screen.getByPlaceholderText('Введіть текст...')
    fireEvent.change(textArea, { target: { value: 'Test text' } })

    const button = screen.getByText('Конвертувати в PDF')
    fireEvent.click(button)
    await waitFor(() => {
      expect(
        screen.getByText(
          'Помилка конвертації. Перевірте підключення або спробуйте пізніше.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('clears text after successful PDF generation', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      blob: jest
        .fn()
        .mockResolvedValueOnce(new Blob(['test'], { type: 'application/pdf' })),
    })

    render(<App />)
    const textArea = screen.getByPlaceholderText('Введіть текст...')
    fireEvent.change(textArea, { target: { value: 'Test text' } })

    const button = screen.getByText('Конвертувати в PDF')
    fireEvent.click(button)

    await waitFor(() => {
      expect(textArea.value).toBe('')
    })
  })
})
