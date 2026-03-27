import { useState, useEffect } from 'react';
import { Encoder } from './components/Encoder';
import { Decoder } from './components/Decoder';
import { KeyGenerator } from './components/KeyGenerator';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 selection:bg-blue-100 selection:dark:bg-blue-900/40">
      
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        
        {/* Minimalist Hero Section */}
        <section className="text-center mb-16 mt-4">
          <div className="inline-block mb-6 px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-widest border border-gray-200 dark:border-gray-800">
            Client-Side Privacy
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Hide Secrets in Plain Sight
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Military-grade RSA encryption seamlessly merged with advanced image steganography. Keep your sensitive communications completely invisible.
          </p>
        </section>

        {/* Tool Tabs */}
        <div className="w-full">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('ENCODE')}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === 'ENCODE' 
                  ? 'bg-black text-white dark:bg-white dark:text-black border border-transparent' 
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Encrypt & Hide
            </button>
            <button
              onClick={() => setActiveTab('DECODE')}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === 'DECODE' 
                  ? 'bg-black text-white dark:bg-white dark:text-black border border-transparent' 
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Extract & Reveal
            </button>
          </div>

          {/* Tool Container */}
          <div className="bg-white dark:bg-gray-950 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
            {activeTab === 'ENCODE' ? <Encoder /> : <Decoder />}
          </div>
          
          <div className="mt-16 mb-8 border-t border-gray-200 dark:border-gray-800 pt-10">
            <KeyGenerator />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default App;
