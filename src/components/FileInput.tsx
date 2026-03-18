import { useRef } from 'react';

interface FileInputProps {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  selectedFileName?: string;
}

export function FileInput({ label, accept, onChange, selectedFileName }: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">{label}</label>
      
      <div 
        onClick={handleClick}
        className={`relative w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
          selectedFileName 
            ? 'border-blue-400 bg-blue-50/50 dark:border-blue-600 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept={accept} 
          onChange={(e) => onChange(e.target.files?.[0] || null)} 
          className="hidden"
        />
        
        <svg className={`w-10 h-10 mb-3 ${selectedFileName ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        
        {selectedFileName ? (
          <div className="text-center">
            <p className="text-sm font-bold text-blue-700 dark:text-blue-400 truncate max-w-xs">{selectedFileName}</p>
            <p className="text-xs text-blue-500 mt-1">Click to replace file</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Click to upload a file</p>
            <p className="text-xs text-gray-500 mt-1">or drag and drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}
