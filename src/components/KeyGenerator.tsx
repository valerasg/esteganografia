import { useState } from 'react';
import { generateKeyPair } from '../utils/crypto';

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
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-2">Testing Toolkit: Generate Keys</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Need keys to test the app? Generate a temporary 2048-bit RSA key pair below.
      </p>
      <button 
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-gray-800 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white px-4 py-2 rounded shadow text-sm font-semibold disabled:opacity-75"
      >
        {isGenerating ? 'Generating Keys (Please wait)...' : 'Generate Key Pair'}
      </button>

      {keys && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Public Key</label>
            <textarea 
              readOnly 
              value={keys.public} 
              className="w-full h-32 text-xs font-mono p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Private Key</label>
            <textarea 
              readOnly 
              value={keys.private} 
              className="w-full h-32 text-xs font-mono p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:outline-none" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
