import React from 'react'

const HistoryItem = ({ entry, onClick }) => {
  return (
    <li className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition-all">
      <button
        className="text-blue-600 hover:text-blue-800 font-medium"
        onClick={onClick}
      >
        {entry.text.slice(0, 60)}
      </button>
      <span className="text-gray-500 text-sm">
        {new Date(entry.id).toLocaleDateString()}
      </span>
    </li>
  )
}

export default HistoryItem
