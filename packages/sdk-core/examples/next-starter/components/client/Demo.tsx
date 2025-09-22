'use client';

import { useState } from 'react';
import { useCompose } from '@actionpackd/sdk-core/client';

const providers = ['openai', 'anthropic', 'gemini'];

export function Demo(): React.ReactElement {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('openai');
  
  const {
    completion,
    isLoading,
    error,
    cancel,
  } = useCompose(prompt, {
    endpoint: '/api/compose',
    retries: 0,
    onStructured: (data: unknown): void => {
      console.log('Structured data:', data);
    },
    temperature: 0.7,
    maxTokens: 1000,
  });

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="mb-4">
        <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
          Provider
        </label>
        <select
          id="provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {providers.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          Prompt
        </label>
        <div className="mt-1">
          <textarea
            id="prompt"
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setPrompt('')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Clear
        </button>
        {isLoading ? (
          <button
            type="button"
            onClick={cancel}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPrompt(prompt)}
            disabled={!prompt}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Generate
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {completion && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Completion
          </label>
          <div className="mt-1 bg-gray-50 rounded-md p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-900">
              {completion}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
