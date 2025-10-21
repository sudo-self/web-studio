// /components/StatusBar.tsx

export default function StatusBar() {
  return (
    <div className="status-bar flex justify-between items-center px-4 py-2 text-sm bg-gray-900 text-gray-300 border-t border-gray-700 shadow-inner">
    
      <a
        href="https://studio.jessejesse.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-green-400 transition-colors cursor-pointer"
      >
        <span className="font-semibold">AI Web Studio</span>
        <span className="text-green-400">studio.jessejesse.com</span>
      </a>

   
      <div className="font-semibold flex items-center gap-1 text-gray-400 hover:text-orange-400 transition-colors cursor-default">
        <img 
          src="./colorado.svg" 
          alt="Colorado" 
          className="w-5 h-5"
        />
      </div>

     
      <a
        href="https://github.com/sudo-self/web-studio"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-green-400 transition-colors cursor-pointer"
      >
        <span className="font-semibold">GITHUB</span>
        <span className="text-green-400">@sudo-self</span>
      </a>
    </div>
  );
}


