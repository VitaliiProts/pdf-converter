import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PdfModal from './Modal'

describe('PdfModal', () => {
  const mockSetPdfData = jest.fn()

  it('renders modal when pdfData is provided', () => {
    const pdfData = 'data:application/pdf;base64,PDF_CONTENT'

    render(<PdfModal pdfData={pdfData} setPdfData={mockSetPdfData} />)

    // Перевіряємо, що iframe з PDF відображається
    const iframe = screen.getByTitle('PDF Viewer')
    expect(iframe).toBeInTheDocument()

    // Перевіряємо, що модальне вікно відкрито
    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()
  })

  it('does not render modal when pdfData is not provided', () => {
    render(<PdfModal pdfData={null} setPdfData={mockSetPdfData} />)

    // Перевіряємо, що модальне вікно не рендериться
    const modal = screen.queryByRole('dialog')
    expect(modal).toBeNull()
  })

  it('calls setPdfData(null) when close button is clicked', () => {
    const pdfData = 'data:application/pdf;base64,PDF_CONTENT'

    render(<PdfModal pdfData={pdfData} setPdfData={mockSetPdfData} />)

    // Клікаємо на кнопку закриття
    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    // Перевіряємо, чи викликалась функція setPdfData з null
    expect(mockSetPdfData).toHaveBeenCalledWith(null)
    expect(mockSetPdfData).toHaveBeenCalledTimes(1)
  })
})
