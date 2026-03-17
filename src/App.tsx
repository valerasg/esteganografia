import { useState, useEffect } from 'react';
import { Encoder } from './components/Encoder';
import { Decoder } from './components/Decoder';
import { KeyGenerator } from './components/KeyGenerator';

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

export default App;
