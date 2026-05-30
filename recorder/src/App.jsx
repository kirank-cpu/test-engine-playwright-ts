import React, { useState } from 'react'
import StepRecorder from './components/StepRecorder'
import StepList from './components/StepList'
import TestSuiteForm from './components/TestSuiteForm'
import JsonOutput from './components/JsonOutput'
import { Download, Eye, Trash2 } from 'lucide-react'

function App() {
  const [steps, setSteps] = useState([])
  const [testSuite, setTestSuite] = useState({
    name: 'Test Suite',
    description: 'Test suite description',
    timeout: 30000,
    variables: {
      baseUrl: 'https://example.com'
    }
  })
  const [showJsonPreview, setShowJsonPreview] = useState(false)
  const [showTestSuiteForm, setShowTestSuiteForm] = useState(false)

  const addStep = (step) => {
    setSteps([...steps, { ...step, id: Date.now() }])
  }

  const deleteStep = (id) => {
    setSteps(steps.filter(step => step.id !== id))
  }

  const clearAllSteps = () => {
    if (window.confirm('Are you sure you want to clear all steps?')) {
      setSteps([])
    }
  }

  const generateJson = () => {
    const formattedSteps = steps.map(({ id, ...step }) => step)
    return {
      ...testSuite,
      tests: [
        {
          name: `${testSuite.name} - Test`,
          steps: formattedSteps
        }
      ]
    }
  }

  const downloadJson = () => {
    const json = generateJson()
    const dataStr = JSON.stringify(json, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${testSuite.name.replace(/\s+/g, '-').toLowerCase()}.test.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-400 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🎬 Test Step Recorder</h1>
          <p className="text-blue-100 text-lg">Record UI interactions and convert them to JSON test steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recorder */}
          <div className="lg:col-span-2">
            <div className="glass-effect p-8 rounded-2xl mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Record Steps</h2>
              <StepRecorder onAddStep={addStep} testSuite={testSuite} />
            </div>

            {/* Steps List */}
            <div className="glass-effect p-8 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📋 Recorded Steps ({steps.length})</h2>
                {steps.length > 0 && (
                  <button
                    onClick={clearAllSteps}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                    Clear All
                  </button>
                )}
              </div>
              <StepList steps={steps} onDeleteStep={deleteStep} />
            </div>
          </div>

          {/* Right Column - Controls & Preview */}
          <div className="lg:col-span-1">
            {/* Test Suite Settings */}
            <div className="glass-effect p-6 rounded-2xl mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Test Suite</h2>
              <button
                onClick={() => setShowTestSuiteForm(!showTestSuiteForm)}
                className="w-full btn-primary mb-4"
              >
                {showTestSuiteForm ? 'Hide Settings' : 'Edit Settings'}
              </button>
              {showTestSuiteForm && (
                <TestSuiteForm testSuite={testSuite} setTestSuite={setTestSuite} />
              )}
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600"><strong>Suite:</strong> {testSuite.name}</p>
                <p className="text-sm text-gray-600"><strong>Timeout:</strong> {testSuite.timeout}ms</p>
              </div>
            </div>

            {/* Export Options */}
            <div className="glass-effect p-6 rounded-2xl mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📤 Export</h2>
              <button
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="w-full flex items-center justify-center gap-2 mb-3 btn-secondary"
              >
                <Eye size={18} />
                {showJsonPreview ? 'Hide JSON' : 'Preview JSON'}
              </button>
              <button
                onClick={downloadJson}
                disabled={steps.length === 0}
                className="w-full flex items-center justify-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                Download JSON
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {steps.length === 0 ? 'Add steps to export' : `Ready to export ${steps.length} steps`}
              </p>
            </div>

            {/* Stats */}
            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="font-bold text-gray-800 mb-3">📊 Statistics</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">Total Steps: <span className="font-bold text-blue-600">{steps.length}</span></p>
                <p className="text-gray-700">
                  Action Types: <span className="font-bold text-purple-600">
                    {new Set(steps.map(s => s.action)).size}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* JSON Preview Modal */}
        {showJsonPreview && (
          <JsonOutput json={generateJson()} onClose={() => setShowJsonPreview(false)} />
        )}
      </div>
    </div>
  )
}

export default App
