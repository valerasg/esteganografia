import { useState } from 'react';
import { encryptMessage } from '../utils/crypto';
import { embedDataInImage } from '../utils/stegano';
import { SectionTitle } from './SectionTitle';
import { FileInput } from './FileInput';

export function Encoder() {
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-6">
      <SectionTitle>Hide a Message</SectionTitle>
      
      <FileInput 
        label="1. Select Target Image"
        accept="image/*"
        onChange={setImage}
        selectedFileName={image?.name}
      />

      <div>
        <label className="block text-sm font-semibold mb-2">2. Write Secret Message</label>
        <textarea 
          placeholder="Type your secret message here..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">3. Recipient's Public Key (PEM format)</label>
        <textarea 
          placeholder="-----BEGIN PUBLIC KEY-----..." 
          value={publicKey} 
          onChange={(e) => setPublicKey(e.target.value)} 
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md p-3 min-h-[120px] font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button 
        onClick={handleProcess} 
        disabled={!image || !message || !publicKey || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Encrypt & Embed'}
      </button>

      {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}

      {downloadUrl && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex flex-col items-center">
          <p className="text-green-700 dark:text-green-400 font-semibold mb-3">Success! Your message is safely hidden.</p>
          <a 
            href={downloadUrl} 
            download="secret_image.png"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors"
          >
            Download Secure Image (PNG)
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Note: Image must remain as PNG to preserve the hidden data.</p>
        </div>
      )}
    </div>
  );
}
