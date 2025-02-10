import React, { useState, useCallback } from 'react'

const Converter = ({
  apiUrl,
  apiKey,
  text,
  setText,
  setPdfData,
  setHistory,
  history,
  saveHistory,
}) => {
  const [error, setError] = useState('')
  const [apiError, setApiError] = useState('')

  const handleConvert = useCallback(async () => {
    if (!text.trim()) {
      setError("Це поле обов'язкове")
      return
    }

    setError('')
    setApiError('')

    try {
      const response = await fetch(`${apiUrl}/create-pdf?apiKey=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Something went wrong while processing the request.')
      }

      const blob = await response.blob()
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

      setPdfData(dataUrl)

      const newEntry = { id: Date.now(), text, pdfData: dataUrl }
      setHistory((prevHistory) => [newEntry, ...prevHistory])
      saveHistory([newEntry, ...history])

      setText('')
    } catch (error) {
      console.error(error)
      setApiError(
        'Помилка конвертації. Перевірте підключення або спробуйте пізніше.',
      )
    }
  }, [text, apiUrl, apiKey, setText, setPdfData, setHistory, saveHistory])

  return (
    <div>
      <textarea
        className="w-full border border-gray-300 rounded p-2"
        rows="6"
        placeholder="Введіть текст..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {error && (
        <p className="text-red-700 bg-red-100 border-l-4 border-red-500 p-2 mb-2 text-sm font-medium rounded-md">
          {error}
        </p>
      )}

      {apiError && (
        <p className="text-red-700 bg-red-100 border-l-4 border-red-500 p-2 text-sm font-medium rounded-md">
          {apiError}
        </p>
      )}

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 mt-4"
        onClick={handleConvert}
      >
        Конвертувати в PDF
      </button>
    </div>
  )
}

export default Converter
