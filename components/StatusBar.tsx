// /components/StatusBar.tsx

export default function StatusBar() {
  return (
    <div className="status-bar flex justify-between items-center px-4 py-2 text-sm bg-gray-900 text-gray-300 border-t border-gray-700 shadow-inner">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <span className="font-semibold">AI Website Builder</span>
        <span className="text-green-400">v1.0</span>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-1 text-gray-400">
        <span className="text-green-400">&#10085;</span>
        <a
          href="https://jessejesse.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          JesseJesse.com
        </a>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        <span className="font-medium">Editor:</span>
        <span className="text-green-400">Ready</span>
      </div>
    </div>
  );
}


