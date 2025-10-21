// /components/StatusBar.tsx

export default function StatusBar() {
  return (
    <div className="status-bar flex justify-between items-center px-4 py-2 text-sm bg-gray-900 text-gray-300 border-t border-gray-700 shadow-inner">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <span className="font-semibold">AI Web Studio</span>
        <span className="text-green-400">netlify.app</span>
      </div>

      {/* Center Section */}
      <div className="font-semibold flex items-center gap-1 text-gray-400">
        STUDIO <span className="text-green-400">&#10085;</span>
        <a
          href="https://studio.jessejesse.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-pink-400 transition-colors"
        >
         JesseJesse.com
        </a>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        <span className="font-semibold">GITHUB</span>
        <span className="text-green-400">@sudo-self</span>
      </div>
    </div>
  );
}


