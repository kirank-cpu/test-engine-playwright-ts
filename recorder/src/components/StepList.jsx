import React from 'react'
import { Trash2, Copy, ChevronDown, ChevronUp } from 'lucide-react'

const STEP_ICONS = {
  navigate: '🔗',
  click: '🖱️',
  fill: '📝',
  type: '⌨️',
  select: '📋',
  check: '☑️',
  uncheck: '☐',
  hover: '🎯',
  press: '⌨️',
  waitFor: '⏳',
  waitForNavigation: '⏳',
  screenshot: '📸',
  assertElementVisible: '✅',
  assertElementHidden: '❌',
  assertText: '📄',
  assertUrl: '🔗',
  assertValue: '🔢',
  scroll: '📜'
}

const STEP_COLORS = {
  navigate: 'blue',
  click: 'purple',
  fill: 'green',
  type: 'green',
  select: 'green',
  check: 'yellow',
  uncheck: 'yellow',
  hover: 'purple',
  press: 'pink',
  waitFor: 'orange',
  waitForNavigation: 'orange',
  screenshot: 'indigo',
  assertElementVisible: 'green',
  assertElementHidden: 'red',
  assertText: 'cyan',
  assertUrl: 'blue',
  assertValue: 'cyan',
  scroll: 'amber'
}

function StepList({ steps, onDeleteStep }) {
  const [expandedSteps, setExpandedSteps] = React.useState({})

  const toggleExpand = (id) => {
    setExpandedSteps(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getColorClass = (action) => {
    const color = STEP_COLORS[action] || 'gray'
    const colors = {
      blue: 'border-blue-500 bg-blue-50 hover:bg-blue-100',
      purple: 'border-purple-500 bg-purple-50 hover:bg-purple-100',
      green: 'border-green-500 bg-green-50 hover:bg-green-100',
      yellow: 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100',
      orange: 'border-orange-500 bg-orange-50 hover:bg-orange-100',
      pink: 'border-pink-500 bg-pink-50 hover:bg-pink-100',
      indigo: 'border-indigo-500 bg-indigo-50 hover:bg-indigo-100',
      red: 'border-red-500 bg-red-50 hover:bg-red-100',
      cyan: 'border-cyan-500 bg-cyan-50 hover:bg-cyan-100',
      amber: 'border-amber-500 bg-amber-50 hover:bg-amber-100',
      gray: 'border-gray-500 bg-gray-50 hover:bg-gray-100'
    }
    return colors[color] || colors.gray
  }

  const formatStepValue = (step) => {
    switch (step.action) {
      case 'navigate':
      case 'assertUrl':
        return step.url || ''
      case 'fill':
      case 'type':
      case 'select':
        return `${step.selector} = "${step.value}"`
      case 'assertText':
        return `${step.selector} contains "${step.text}"`
      case 'assertValue':
        return `${step.selector} = "${step.value}"`
      case 'press':
        return `Key: ${step.key}`
      case 'screenshot':
        return step.name ? `Name: ${step.name}` : 'Full page'
      default:
        return step.selector || ''
    }
  }

  if (steps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-500 text-lg">No steps recorded yet. Add your first step to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`step-card border-l-4 transition-all ${getColorClass(step.action)}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => toggleExpand(step.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{STEP_ICONS[step.action] || '📌'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">Step {index + 1}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">{step.action}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate max-w-md">
                    {formatStepValue(step) || 'No parameters'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleExpand(step.id)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Toggle details"
              >
                {expandedSteps[step.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button
                onClick={() => {
                  const json = JSON.stringify(step, null, 2)
                  navigator.clipboard.writeText(json)
                  alert('Step JSON copied to clipboard!')
                }}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Copy as JSON"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={() => onDeleteStep(step.id)}
                className="p-2 hover:bg-red-200 rounded-lg transition-colors text-red-600"
                title="Delete step"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedSteps[step.id] && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <pre className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                {JSON.stringify(step, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default StepList
