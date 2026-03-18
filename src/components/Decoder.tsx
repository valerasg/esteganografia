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
    <div className="space-y-8 animate-fade-in-up" style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}>
      <SectionTitle>Reveal a Secret Message</SectionTitle>
      
      <div className="bg-gray-50/50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <FileInput 
          label="1. Upload Encoded Image (Must be PNG)"
          accept="image/png"
          onChange={setImage}
          selectedFileName={image?.name}
        />
        {imagePreviewUrl && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-inner border border-gray-100 dark:border-gray-800 animate-fade-in-up">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider text-center">Encoded Image Preview</p>
            <img src={imagePreviewUrl} alt="Encoded Image" className="max-h-64 object-contain mx-auto rounded-lg shadow-sm" />
          </div>
        )}
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 tracking-wide flex items-center gap-2">
          2. Your Private Key 
          <span className="text-xs font-normal text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">Never shared</span>
        </label>
        <textarea 
          placeholder="-----BEGIN PRIVATE KEY-----..." 
          value={privateKey} 
          onChange={(e) => setPrivateKey(e.target.value)} 
          className="w-full border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-900 text-red-900/80 dark:text-red-200/80 rounded-xl p-4 min-h-[140px] font-mono text-sm focus:ring-2 focus:ring-purple-500 shadow-inner transition-all resize-y"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Tooltip content="Reads and decrypts the hidden message using your private key." position="top">
          <button 
            onClick={handleDecode} 
            disabled={!image || !privateKey || isProcessing}
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold py-4 px-10 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isProcessing ? 'Processing (Extracting & Decrypting)...' : 'Extract & Decrypt'}
          </button>
        </Tooltip>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-xl text-sm font-medium animate-fade-in-up">
          {error}
        </div>
      )}

      {revealedMessage && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-900 border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-2xl relative animate-fade-in-up overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <button onClick={() => navigator.clipboard.writeText(revealedMessage)} className="text-gray-400 hover:text-purple-500 transition-colors" title="Copy Message">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
             </button>
          </div>
          <h3 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Decrypted Secret Message
          </h3>
          <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap font-serif text-lg leading-relaxed">{revealedMessage}</p>
        </div>
      )}
    </div>
  );
}
