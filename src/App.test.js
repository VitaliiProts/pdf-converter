import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import '@testing-library/jest-dom'

// Мок для localStorage
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

// Мокаємо global localStorage
global.localStorage = localStorageMock

describe('App component', () => {
  beforeEach(() => {
    // Очищаємо localStorage перед кожним тестом
    localStorage.clear()
  })

  it('renders without crashing', () => {
    render(<App />)

    // Перевіряємо, чи рендериться текст на сторінці
    expect(screen.getByText('Конвертер тексту у PDF')).toBeInTheDocument()
  })

  it('loads history from localStorage', () => {
    // Мокаємо дані в localStorage
    localStorage.setItem(
      'pdfHistory',
      JSON.stringify([{ id: 1, text: 'Test', pdfData: 'somePdfData' }]),
    )

    render(<App />)

    // Перевіряємо, чи історія відображається
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('adds new history entry when PDF is generated', async () => {
    // Мокаємо API
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      blob: jest
        .fn()
        .mockResolvedValueOnce(new Blob(['test'], { type: 'application/pdf' })),
    })

    render(<App />)

    // Вводимо текст в textarea
    const textArea = screen.getByPlaceholderText('Введіть текст...')
    fireEvent.change(textArea, { target: { value: 'Test text' } })

    // Клікаємо на кнопку конвертації
    const button = screen.getByText('Конвертувати в PDF')
    fireEvent.click(button)

    // Перевіряємо, чи викликали fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    // Перевіряємо, чи історія оновилась
    await waitFor(() => {
      expect(screen.getByText('Test text')).toBeInTheDocument()
    })
  })

  it('displays error if API request fails', async () => {
    // Мокаємо API для помилки
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('API error'))

    render(<App />)

    // Вводимо текст в textarea
    const textArea = screen.getByPlaceholderText('Введіть текст...')
    fireEvent.change(textArea, { target: { value: 'Test text' } })

    // Клікаємо на кнопку конвертації
    const button = screen.getByText('Конвертувати в PDF')
    fireEvent.click(button)

    // Перевіряємо, чи відображено повідомлення про помилку
    await waitFor(() => {
      expect(
        screen.getByText(
          'Помилка конвертації. Перевірте підключення або спробуйте пізніше.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('clears text after successful PDF generation', async () => {
    // Мокаємо API
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      blob: jest
        .fn()
        .mockResolvedValueOnce(new Blob(['test'], { type: 'application/pdf' })),
    })

    render(<App />)

    // Вводимо текст в textarea
    const textArea = screen.getByPlaceholderText('Введіть текст...')
    fireEvent.change(textArea, { target: { value: 'Test text' } })

    // Клікаємо на кнопку конвертації
    const button = screen.getByText('Конвертувати в PDF')
    fireEvent.click(button)

    // Перевіряємо, чи текст очищений
    await waitFor(() => {
      expect(textArea.value).toBe('')
    })
  })
})
