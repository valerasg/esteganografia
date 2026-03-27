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
    <div className="space-y-8">
      <SectionTitle>Hide a Secret Message</SectionTitle>
      
      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <FileInput 
          label="1. Select Cover Image"
          accept="image/*"
          onChange={setImage}
          selectedFileName={image?.name}
        />
        {imagePreviewUrl && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider text-center">Original Cover Image</p>
            <img src={imagePreviewUrl} alt="Original Cover" className="max-h-64 object-contain mx-auto rounded-md border border-gray-100 dark:border-gray-800" />
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          2. Write Secret Message
        </label>
        <textarea 
          placeholder="Type your highly sensitive message here..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="w-full border-none ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-950 rounded-lg p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 transition-shadow resize-y text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          3. Recipient's Public Key 
          <span className="text-[10px] font-medium text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full uppercase tracking-wider">PEM Format</span>
        </label>
        <textarea 
          placeholder="-----BEGIN PUBLIC KEY-----..." 
          value={publicKey} 
          onChange={(e) => setPublicKey(e.target.value)} 
          className="w-full border-none ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-950 rounded-lg p-4 min-h-[140px] font-mono text-sm focus:ring-2 focus:ring-blue-500 transition-shadow resize-y text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Tooltip content="Generates a secure PNG image with the hidden message." position="top">
          <button 
            onClick={handleProcess} 
            disabled={!image || !message || !publicKey || isProcessing}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Encrypt & Embed'}
          </button>
        </Tooltip>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {downloadUrl && (
        <div className="mt-8 p-8 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-xl flex flex-col items-center">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-green-800 dark:text-green-300 font-semibold text-lg mb-4 text-center">Success! Message Secured.</p>
          <a 
            href={downloadUrl} 
            download="secure_stegano_image.png"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Download Secure PNG Image
          </a>
          <p className="text-sm text-green-700/80 dark:text-green-400/80 mt-4 text-center max-w-sm">
            Warning: Do not convert this image to JPEG or compress it, or the hidden data will be destroyed.
          </p>
          <div className="mt-8 w-full bg-white dark:bg-gray-950 p-4 rounded-lg border border-green-200 dark:border-green-800/50">
             <p className="text-xs font-semibold text-green-700 dark:text-green-500 mb-3 uppercase tracking-wider text-center">Encoded Result (Visual Check)</p>
             <img src={downloadUrl} alt="Encoded Result" className="max-h-64 object-contain mx-auto rounded-md border border-gray-100 dark:border-gray-800" />
          </div>
        </div>
      )}
    </div>
  );
}
