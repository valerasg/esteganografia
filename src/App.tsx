import { useState, useEffect } from 'react';
import { encryptMessage, decryptMessage, generateKeyPair } from './utils/crypto';
import { embedDataInImage, extractDataFromImage } from './utils/stegano';

function App() {
  const [activeTab, setActiveTab] = useState<'ENCODE' | 'DECODE'>('ENCODE');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans p-6 flex justify-center transition-colors duration-300">
      <div className="w-full max-w-3xl">
        <header className="mb-8 relative text-center">
          <button
            onClick={toggleTheme}
            className="absolute right-0 top-0 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:ring-2 ring-blue-400 transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 18v1m9-9h1M3 9h1m17.364 1.636l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
          <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">Secure Steganography</h1>
          <p className="text-gray-500 dark:text-gray-400">Hide encrypted messages inside your images seamlessly.</p>
        </header>

        <div className="flex justify-center space-x-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <button
            onClick={() => setActiveTab('ENCODE')}
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${
              activeTab === 'ENCODE' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400'
            }`}
          >
            Hide Message (Encode)
          </button>
          <button
            onClick={() => setActiveTab('DECODE')}
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${
              activeTab === 'DECODE' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400'
            }`}
          >
            Reveal Message (Decode)
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error encoding the image.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b dark:border-gray-800 pb-2">Hide a Message</h2>
      
      <div>
        <label className="block text-sm font-semibold mb-2">1. Select Target Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImage(e.target.files?.[0] || null)} 
          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
        />
        {image && <p className="text-xs text-gray-400 mt-1">Selected: {image.name}</p>}
      </div>

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
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Decryption failed. The private key doesn't match or no hidden message exists.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b dark:border-gray-800 pb-2">Reveal a Message</h2>
      
      <div>
        <label className="block text-sm font-semibold mb-2">1. Upload Encoded Image (PNG)</label>
        <input 
          type="file" 
          accept="image/png" 
          onChange={(e) => setImage(e.target.files?.[0] || null)} 
          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
        />
        {image && <p className="text-xs text-gray-400 mt-1">Selected: {image.name}</p>}
      </div>

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

export default App;

