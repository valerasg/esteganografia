import { useState, useEffect } from 'react';
import { encryptMessage } from '../utils/crypto';
import { embedDataInImage } from '../utils/stegano';
import { SectionTitle } from './SectionTitle';
import { FileInput } from './FileInput';
import { Tooltip } from './Tooltip';

export function Encoder() {
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  async function handleProcess() {
    if (!image || !message || !publicKey) return;
    
    setIsProcessing(true);
    setError(null);
    setDownloadUrl(null);

    try {
      // 1. Encrypt message
      const encryptedText = encryptMessage(message, publicKey);
      
      // 2. Embed into image
      const modifiedImageBlob = await embedDataInImage(image, encryptedText);
      
      // 3. Create download URL
      setDownloadUrl(URL.createObjectURL(modifiedImageBlob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error encoding the image.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up" style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}>
      <SectionTitle>Hide a Secret Message</SectionTitle>
      
      <div className="bg-gray-50/50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <FileInput 
          label="1. Select Cover Image"
          accept="image/*"
          onChange={setImage}
          selectedFileName={image?.name}
        />
        {imagePreviewUrl && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-inner border border-gray-100 dark:border-gray-800 animate-fade-in-up">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider text-center">Original Cover Image</p>
            <img src={imagePreviewUrl} alt="Original Cover" className="max-h-64 object-contain mx-auto rounded-lg shadow-sm" />
          </div>
        )}
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
          2. Write Secret Message
        </label>
        <textarea 
          placeholder="Type your highly sensitive message here..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="w-full border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-900 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 shadow-inner transition-all resize-y"
        />
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 tracking-wide flex items-center gap-2">
          3. Recipient's Public Key 
          <span className="text-xs font-normal text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">PEM Format</span>
        </label>
        <textarea 
          placeholder="-----BEGIN PUBLIC KEY-----..." 
          value={publicKey} 
          onChange={(e) => setPublicKey(e.target.value)} 
          className="w-full border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-900 rounded-xl p-4 min-h-[140px] font-mono text-sm focus:ring-2 focus:ring-blue-500 shadow-inner transition-all resize-y"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Tooltip content="Generates a secure PNG image with the hidden message." position="top">
          <button 
            onClick={handleProcess} 
            disabled={!image || !message || !publicKey || isProcessing}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-4 px-10 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isProcessing ? 'Processing (Encrypting & Hiding)...' : 'Encrypt & Embed'}
          </button>
        </Tooltip>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-xl text-sm font-medium animate-fade-in-up">
          {error}
        </div>
      )}

      {downloadUrl && (
        <div className="mt-8 p-8 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800/50 rounded-2xl flex flex-col items-center shadow-inner animate-fade-in-up">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-green-800 dark:text-green-300 font-extrabold text-xl mb-4 text-center">Success! Message Secured.</p>
          <a 
            href={downloadUrl} 
            download="secure_stegano_image.png"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-600/30 transition-transform transform hover:-translate-y-1"
          >
            Download Secure PNG Image
          </a>
          <p className="text-sm font-semibold text-green-700/70 dark:text-green-400/70 mt-4 text-center max-w-sm">
            ⚠️ Warning: Do not convert this image to JPEG or compress it, or the hidden data will be destroyed.
          </p>
          <div className="mt-8 w-full bg-white/50 dark:bg-black/20 p-4 rounded-xl">
             <p className="text-xs font-bold text-green-700/80 dark:text-green-400/80 mb-3 uppercase tracking-wider text-center">Encoded Result (Visual Check)</p>
             <img src={downloadUrl} alt="Encoded Result" className="max-h-64 object-contain mx-auto rounded-lg shadow-sm border border-green-300 dark:border-green-700/50" />
          </div>
        </div>
      )}
    </div>
  );
}
