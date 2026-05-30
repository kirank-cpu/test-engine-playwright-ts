import React, { useState } from 'react'

function TestSuiteForm({ testSuite, setTestSuite }) {
  const [name, setName] = useState(testSuite.name)
  const [description, setDescription] = useState(testSuite.description)
  const [timeout, setTimeout] = useState(testSuite.timeout)
  const [baseUrl, setBaseUrl] = useState(testSuite.variables?.baseUrl || '')
  const [newVarName, setNewVarName] = useState('')
  const [newVarValue, setNewVarValue] = useState('')

  const handleSave = () => {
    setTestSuite({
      name,
      description,
      timeout,
      variables: {
        ...testSuite.variables,
        baseUrl
      }
    })
  }

  const handleAddVariable = () => {
    if (!newVarName.trim() || !newVarValue.trim()) {
      alert('Please enter both variable name and value')
      return
    }

    setTestSuite({
      ...testSuite,
      variables: {
        ...testSuite.variables,
        [newVarName]: newVarValue
      }
    })

    setNewVarName('')
    setNewVarValue('')
  }

  const handleRemoveVariable = (varName) => {
    const newVars = { ...testSuite.variables }
    delete newVars[varName]
    setTestSuite({
      ...testSuite,
      variables: newVars
    })
  }

  return (
    <div className="space-y-4">
      {/* Test Suite Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Test Suite Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field resize-none h-20"
          placeholder="Describe what this test suite tests"
        />
      </div>

      {/* Timeout */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Timeout (ms)</label>
        <input
          type="number"
          value={timeout}
          onChange={(e) => setTimeout(parseInt(e.target.value))}
          className="input-field"
        />
      </div>

      {/* Variables */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Variables</label>

        {/* Base URL */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Base URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com"
            className="input-field text-sm"
          />
        </div>

        {/* Additional Variables */}
        {Object.entries(testSuite.variables)
          .filter(([key]) => key !== 'baseUrl')
          .map(([key, value]) => (
            <div key={key} className="flex gap-2 mb-2">
              <input
                type="text"
                value={key}
                disabled
                className="input-field text-sm bg-gray-100"
              />
              <input
                type="text"
                value={value}
                disabled
                className="input-field text-sm bg-gray-100"
              />
              <button
                onClick={() => handleRemoveVariable(key)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          ))}

        {/* Add New Variable */}
        <div className="border-t pt-3 mt-3">
          <p className="text-xs text-gray-600 mb-2">Add custom variable:</p>
          <div className="space-y-2">
            <input
              type="text"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              placeholder="Variable name (e.g., testUser)"
              className="input-field text-sm"
            />
            <input
              type="text"
              value={newVarValue}
              onChange={(e) => setNewVarValue(e.target.value)}
              placeholder="Variable value"
              className="input-field text-sm"
            />
            <button
              onClick={handleAddVariable}
              className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
            >
              Add Variable
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full btn-primary"
      >
        Save Settings
      </button>
    </div>
  )
}

export default TestSuiteForm
