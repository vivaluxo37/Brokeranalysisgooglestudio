import React, { useState, useEffect } from 'react'

import { aiProviderManager } from '../../services/aiProviders'

const AIDebug: React.FC = () => {
  const [providerStatus, setProviderStatus] = useState<any[]>([])
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      VITE_API_KEY: import.meta.env.VITE_API_KEY ? 'Set' : 'Not set',
      VITE_HUGGINGFACE_KEY: import.meta.env.VITE_HUGGINGFACE_KEY ? 'Set' : 'Not set',
      VITE_OPENROUTER_KEY: import.meta.env.VITE_OPENROUTER_KEY ? 'Set' : 'Not set',
    })

    // Get provider status
    const status = aiProviderManager.getProviderStatus()
    setProviderStatus(status)
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">🔍 AI Debug Information</h3>

      <div className="mb-4">
        <h4 className="font-semibold mb-1">Environment Variables:</h4>
        <pre className="text-xs bg-white p-2 rounded border">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold mb-1">Provider Status:</h4>
        <pre className="text-xs bg-white p-2 rounded border">
          {JSON.stringify(providerStatus, null, 2)}
        </pre>
      </div>

      <button
        onClick={() => {
          const status = aiProviderManager.getProviderStatus()
          setProviderStatus(status)
        }}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Refresh Status
      </button>
    </div>
  )
}

export default AIDebug
