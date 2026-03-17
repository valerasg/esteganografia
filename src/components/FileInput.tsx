interface FileInputProps {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  selectedFileName?: string;
}

export function FileInput({ label, accept, onChange, selectedFileName }: FileInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <input 
        type="file" 
        accept={accept} 
        onChange={(e) => onChange(e.target.files?.[0] || null)} 
        className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
      />
      {selectedFileName && <p className="text-xs text-gray-400 mt-1">Selected: {selectedFileName}</p>}
    </div>
  );
}
