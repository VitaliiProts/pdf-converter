import React from 'react'

const PdfModal = ({ pdfData, setPdfData }) => {
  if (!pdfData) return null
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
    >
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-3xl w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Результат PDF:</h2>
          <button
            className="text-white bg-gray-700 p-2 rounded-full hover:bg-gray-800 transition-all w-8 h-8 flex items-center justify-center"
            onClick={() => setPdfData(null)}
          >
            <span className="text-xl font-semibold">✕</span>
          </button>
        </div>
        <div className="relative w-full h-96 mt-6">
          <iframe
            src={pdfData}
            title="PDF Viewer"
            className="w-full h-full border-none rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

export default PdfModal
