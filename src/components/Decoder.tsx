import { useState } from 'react';
import { decryptMessage } from '../utils/crypto';
import { extractDataFromImage } from '../utils/stegano';
import { SectionTitle } from './SectionTitle';
import { FileInput } from './FileInput';

export function Decoder() {
  const [image, setImage] = useState<File | null>(null);
  const [privateKey, setPrivateKey] = useState('');
  const [revealedMessage, setRevealedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleDecode() {
    if (!image || !privateKey) return;
    
    setIsProcessing(true);
    setRevealedMessage(null);
    setError(null);
    
    try {
      // 1. Extract hidden data
      const encryptedText = await extractDataFromImage(image);
      
      // 2. Decrypt
      const decryptedText = decryptMessage(encryptedText, privateKey);
      
      setRevealedMessage(decryptedText);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Decryption failed. The private key doesn't match or no hidden message exists.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle>Reveal a Message</SectionTitle>
      
      <FileInput 
        label="1. Upload Encoded Image (PNG)"
        accept="image/png"
        onChange={setImage}
        selectedFileName={image?.name}
      />

      <div>
        <label className="block text-sm font-semibold mb-2">2. Your Private Key (PEM format)</label>
        <textarea 
          placeholder="-----BEGIN PRIVATE KEY-----..." 
          value={privateKey} 
          onChange={(e) => setPrivateKey(e.target.value)} 
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md p-3 min-h-[120px] font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button 
        onClick={handleDecode} 
        disabled={!image || !privateKey || isProcessing}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Extract & Decrypt'}
      </button>

      {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}

      {revealedMessage && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Decrypted Secret Message:</h3>
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-medium">{revealedMessage}</p>
        </div>
      )}
    </div>
  );
}
