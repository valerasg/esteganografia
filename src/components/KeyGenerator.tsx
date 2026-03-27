import { useState } from 'react';
import { generateKeyPair } from '../utils/crypto';
import { Tooltip } from './Tooltip';

export function KeyGenerator() {
  const [keys, setKeys] = useState<{ public: string; private: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  function handleGenerate() {
    setIsGenerating(true);
    // Use timeout to allow UI to update to 'Generating...' before locking the main thread
    setTimeout(() => {
      try {
        const generated = generateKeyPair();
        setKeys({ public: generated.publicKey, private: generated.privateKey });
      } catch (e) {
        console.error("Key generation failed", e);
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Testing Toolkit</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Generate a temporary 2048-bit RSA key pair for testing the application locally.
          </p>
        </div>
        <Tooltip content="Keys are generated locally and never leave your browser." position="top">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full md:w-auto bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-wait"
          >
            {isGenerating ? 'Generating...' : 'Generate Key Pair'}
          </button>
        </Tooltip>
      </div>

      {keys && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="group relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1">Public Key <span className="text-gray-400 lowercase font-medium">(Share this)</span></label>
            <div className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => navigator.clipboard.writeText(keys.public)} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-200 transition-colors">Copy</button>
            </div>
            <textarea 
              readOnly 
              value={keys.public} 
              className="w-full h-40 text-xs font-mono p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none" 
            />
          </div>
          <div className="group relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1">Private Key <span className="text-red-500 lowercase font-medium">(Keep secret)</span></label>
            <div className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => navigator.clipboard.writeText(keys.private)} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-200 transition-colors">Copy</button>
            </div>
            <textarea 
              readOnly 
              value={keys.private} 
              className="w-full h-40 text-xs font-mono p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-red-700 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
