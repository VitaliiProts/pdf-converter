import React, { useState, useEffect } from 'react'
import Converter from './pdfConvertor/components/TextConverter/TextConverter'
import HistoryList from './pdfConvertor/components/HistoryList/HistoryList'
import PdfModal from './pdfConvertor/components/Modal/Modal'
import { LOCAL_STORAGE_KEY } from './pdfConvertor/utils/constants'

function App() {
  const apiUrl = process.env.REACT_APP_API_URL
  const apiKey = process.env.REACT_APP_API_KEY

  const [text, setText] = useState('')
  const [pdfData, setPdfData] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  const saveHistory = (newHistory) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Конвертер тексту у PDF</h1>
        <Converter
          apiUrl={apiUrl}
          apiKey={apiKey}
          text={text}
          setText={setText}
          setPdfData={setPdfData}
          setHistory={setHistory}
          history={history}
          saveHistory={saveHistory}
        />
        {pdfData && <PdfModal pdfData={pdfData} setPdfData={setPdfData} />}
        <HistoryList
          history={history}
          onHistoryClick={(entry) => setPdfData(entry.pdfData)}
        />
      </div>
    </div>
  )
}

export default App
