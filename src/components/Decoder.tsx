import { useState, useEffect } from 'react';
import { decryptMessage } from '../utils/crypto';
import { extractDataFromImage } from '../utils/stegano';
import { SectionTitle } from './SectionTitle';
import { FileInput } from './FileInput';
import { Tooltip } from './Tooltip';

export function Decoder() {
  const [image, setImage] = useState<File | null>(null);
  const [privateKey, setPrivateKey] = useState('');
  const [revealedMessage, setRevealedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [image]);

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
    <div className="space-y-8">
      <SectionTitle>Reveal a Secret Message</SectionTitle>
      
      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <FileInput 
          label="1. Upload Encoded Image (Must be PNG)"
          accept="image/png"
          onChange={setImage}
          selectedFileName={image?.name}
        />
        {imagePreviewUrl && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider text-center">Encoded Image Preview</p>
            <img src={imagePreviewUrl} alt="Encoded Image" className="max-h-64 object-contain mx-auto rounded-md border border-gray-100 dark:border-gray-800" />
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          2. Your Private Key 
          <span className="text-[10px] font-medium text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Never shared</span>
        </label>
        <textarea 
          placeholder="-----BEGIN PRIVATE KEY-----..." 
          value={privateKey} 
          onChange={(e) => setPrivateKey(e.target.value)} 
          className="w-full border-none ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-lg p-4 min-h-[140px] font-mono text-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow resize-y"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Tooltip content="Reads and decrypts the hidden message using your private key." position="top">
          <button 
            onClick={handleDecode} 
            disabled={!image || !privateKey || isProcessing}
            className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Extract & Decrypt'}
          </button>
        </Tooltip>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {revealedMessage && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl relative">
          <div className="absolute top-0 right-0 p-4">
             <button onClick={() => navigator.clipboard.writeText(revealedMessage)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Copy Message">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
             </button>
          </div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Decrypted Secret Message
          </h3>
          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-serif text-lg leading-relaxed">{revealedMessage}</p>
        </div>
      )}
    </div>
  );
}
