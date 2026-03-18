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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        
        {/* Premium Hero Slice */}
        <section className="text-center mb-16 mt-4 opacity-0 animate-fade-in-up" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            Client-Side Privacy
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 mb-6 tracking-tight drop-shadow-sm">
            Hide Secrets in Plain Sight
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Military-grade RSA encryption seamlessly merged with advanced image steganography. Keep your sensitive communications completely invisible.
          </p>
        </section>

        {/* Tool Tabs */}
        <div className="w-full">
          <div className="flex justify-center space-x-2 mb-8">
            <button
              onClick={() => setActiveTab('ENCODE')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                activeTab === 'ENCODE' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg relative overflow-hidden' 
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
              }`}
            >
              {activeTab === 'ENCODE' && (
                <span className="absolute inset-0 w-full h-full bg-white/20 blur-md transform -rotate-45 translate-x-[-150%] animate-[shine_3s_ease-out_infinite]"></span>
              )}
              Encrypt & Hide
            </button>
            <button
              onClick={() => setActiveTab('DECODE')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                activeTab === 'DECODE' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg relative overflow-hidden' 
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
              }`}
            >
              {activeTab === 'DECODE' && (
                <span className="absolute inset-0 w-full h-full bg-white/20 blur-md transform -rotate-45 translate-x-[-150%] animate-[shine_3s_ease-out_infinite]"></span>
              )}
              Extract & Reveal
            </button>
          </div>

          {/* Tool Container */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 transition-all duration-300">
            {activeTab === 'ENCODE' ? <Encoder /> : <Decoder />}
          </div>
          
          <div className="mt-16 mb-8 border-t border-gray-200 dark:border-gray-800 pt-10">
            <KeyGenerator />
          </div>
        </div>

      </main>

      <Footer />
      
      {/* Animations via pure Tailwind arbitrarily configured (or standard styles injected) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
