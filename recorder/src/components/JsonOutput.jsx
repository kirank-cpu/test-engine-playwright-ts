import React from 'react'
import { Copy, X } from 'lucide-react'

function JsonOutput({ json, onClose }) {
  const jsonString = JSON.stringify(json, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    alert('JSON copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">📄 JSON Output</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* JSON Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-white flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 btn-primary"
          >
            <Copy size={20} />
            Copy JSON
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default JsonOutput
