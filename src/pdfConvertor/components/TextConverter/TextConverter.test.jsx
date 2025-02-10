import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Converter from './TextConverter'

describe('Converter', () => {
  const apiUrl = 'https://mockapi.com'
  const apiKey = 'mockapikey'
  const mockSetText = jest.fn()
  const mockSetPdfData = jest.fn()
  const mockSetHistory = jest.fn()
  const mockSaveHistory = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without error', () => {
    render(
      <Converter
        apiUrl={apiUrl}
        apiKey={apiKey}
        text=""
        setText={mockSetText}
        setPdfData={mockSetPdfData}
        setHistory={mockSetHistory}
        history={[]}
        saveHistory={mockSaveHistory}
      />,
    )

    expect(screen.getByPlaceholderText('Введіть текст...')).toBeInTheDocument()
  })

  it('displays an error message if text is empty or just spaces', async () => {
    render(
      <Converter
        apiUrl={apiUrl}
        apiKey={apiKey}
        text=""
        setText={mockSetText}
        setPdfData={mockSetPdfData}
        setHistory={mockSetHistory}
        history={[]}
        saveHistory={mockSaveHistory}
      />,
    )

    const button = screen.getByText('Конвертувати в PDF')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Це поле обов'язкове")).toBeInTheDocument()
    })
  })

  it('successfully converts text to pdf and updates history', async () => {
    // Оновлюємо mockPdfData для відображення реальної Base64 строки
    const mockPdfData = 'data:application/pdf;base64,PDF_CONTENT'

    // Мокаємо fetch, щоб повернути реальний Blob
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      blob: () =>
        Promise.resolve(
          new Blob(
            [new Uint8Array(Buffer.from(mockPdfData.split(',')[1], 'base64'))],
            { type: 'application/pdf' },
          ),
        ),
    })

    render(
      <Converter
        apiUrl={apiUrl}
        apiKey={apiKey}
        text="Test text"
        setText={mockSetText}
        setPdfData={mockSetPdfData}
        setHistory={mockSetHistory}
        history={[]}
        saveHistory={mockSaveHistory}
      />,
    )

    const button = screen.getByText('Конвертувати в PDF')
    fireEvent.click(button)

    await waitFor(() => {
      // Перевірка, що setPdfData був викликаний з PDF контентом
      expect(mockSetPdfData).toHaveBeenCalledWith(
        expect.stringContaining('data:application/pdf;base64,'),
      )
      expect(mockSetHistory).toHaveBeenCalled()
      expect(mockSaveHistory).toHaveBeenCalled()
      expect(mockSetText).toHaveBeenCalledWith('')
    })
  })

  it('displays an API error message if the request fails', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false })

    render(
      <Converter
        apiUrl={apiUrl}
        apiKey={apiKey}
        text="Test text"
        setText={mockSetText}
        setPdfData={mockSetPdfData}
        setHistory={mockSetHistory}
        history={[]}
        saveHistory={mockSaveHistory}
      />,
    )

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
})
