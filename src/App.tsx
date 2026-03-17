import { useState } from 'react';
import { encryptMessage, decryptMessage, generateKeyPair } from './utils/crypto';
import { embedDataInImage, extractDataFromImage } from './utils/stegano';

function App() {
  const [activeTab, setActiveTab] = useState<'ENCODE' | 'DECODE'>('ENCODE');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Secure Steganography</h1>
          <p className="text-gray-500">Hide encrypted messages inside your images seamlessly.</p>
        </header>

        <div className="flex justify-center space-x-4 mb-8 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('ENCODE')}
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${
              activeTab === 'ENCODE' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            Hide Message (Encode)
          </button>
          <button
            onClick={() => setActiveTab('DECODE')}
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${
              activeTab === 'DECODE' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            Reveal Message (Decode)
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          {activeTab === 'ENCODE' ? <Encoder /> : <Decoder />}
        </div>
        
        <div className="mt-12">
          <KeyGenerator />
        </div>
      </div>
    </div>
  );
}

function Encoder() {
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
    } catch (err: any) {
      setError(err.message || "Error encoding the image.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2">Hide a Message</h2>
      
      <div>
        <label className="block text-sm font-semibold mb-2">1. Select Target Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImage(e.target.files?.[0] || null)} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {image && <p className="text-xs text-gray-400 mt-1">Selected: {image.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">2. Write Secret Message</label>
        <textarea 
          placeholder="Type your secret message here..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="w-full border border-gray-300 rounded-md p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">3. Recipient's Public Key (PEM format)</label>
        <textarea 
          placeholder="-----BEGIN PUBLIC KEY-----..." 
          value={publicKey} 
          onChange={(e) => setPublicKey(e.target.value)} 
          className="w-full border border-gray-300 rounded-md p-3 min-h-[120px] font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button 
        onClick={handleProcess} 
        disabled={!image || !message || !publicKey || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Encrypt & Embed'}
      </button>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      {downloadUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md flex flex-col items-center">
          <p className="text-green-700 font-semibold mb-3">Success! Your message is safely hidden.</p>
          <a 
            href={downloadUrl} 
            download="secret_image.png"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors"
          >
            Download Secure Image (PNG)
          </a>
          <p className="text-xs text-gray-500 mt-2">Note: Image must remain as PNG to preserve the hidden data.</p>
        </div>
      )}
    </div>
  );
}

function Decoder() {
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
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Decryption failed. The private key doesn't match or no hidden message exists.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2">Reveal a Message</h2>
      
      <div>
        <label className="block text-sm font-semibold mb-2">1. Upload Encoded Image (PNG)</label>
        <input 
          type="file" 
          accept="image/png" 
          onChange={(e) => setImage(e.target.files?.[0] || null)} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {image && <p className="text-xs text-gray-400 mt-1">Selected: {image.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">2. Your Private Key (PEM format)</label>
        <textarea 
          placeholder="-----BEGIN PRIVATE KEY-----..." 
          value={privateKey} 
          onChange={(e) => setPrivateKey(e.target.value)} 
          className="w-full border border-gray-300 rounded-md p-3 min-h-[120px] font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button 
        onClick={handleDecode} 
        disabled={!image || !privateKey || isProcessing}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Extract & Decrypt'}
      </button>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      {revealedMessage && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Decrypted Secret Message:</h3>
          <p className="text-gray-800 whitespace-pre-wrap font-medium">{revealedMessage}</p>
        </div>
      )}
    </div>
  );
}

function KeyGenerator() {
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
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-bold mb-2">Testing Toolkit: Generate Keys</h3>
      <p className="text-sm text-gray-600 mb-4">
        Need keys to test the app? Generate a temporary 2048-bit RSA key pair below.
      </p>
      <button 
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded shadow text-sm font-semibold disabled:opacity-75"
      >
        {isGenerating ? 'Generating Keys (Please wait)...' : 'Generate Key Pair'}
      </button>

      {keys && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Public Key</label>
            <textarea 
              readOnly 
              value={keys.public} 
              className="w-full h-32 text-xs font-mono p-2 bg-white border border-gray-300 rounded focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Private Key</label>
            <textarea 
              readOnly 
              value={keys.private} 
              className="w-full h-32 text-xs font-mono p-2 bg-white border border-gray-300 rounded focus:outline-none" 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
