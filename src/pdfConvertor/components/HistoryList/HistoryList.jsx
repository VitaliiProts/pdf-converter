import React from 'react'
import HistoryItem from '../HistoryItem/HistoryItem'

const HistoryList = ({ history, onHistoryClick }) => {
  if (!history.length) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Історія конвертацій:
      </h2>
      <ul className="space-y-3">
        {history.map((entry) => (
          <HistoryItem
            key={entry.id}
            entry={entry}
            onClick={() => onHistoryClick(entry)}
          />
        ))}
      </ul>
    </div>
  )
}

export default HistoryList
