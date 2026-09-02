import { RotateCcw, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f5f1eb] p-6 text-center">
      <div className="max-w-md w-full">
        <h1 className="font-handwriting text-8xl mb-4 text-[#24211e] opacity-20 select-none">404</h1>
        <h2 className="font-sans text-3xl font-extrabold mb-4 tracking-tight text-[#24211e]">Page Not Found</h2>
        <p className="font-body text-lg mb-8 text-[#5a544d] leading-relaxed">
          The page you are looking for has been moved, removed, or never existed in the first place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-[#24211e] text-[#f5f1eb] font-handwriting text-xl rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 py-3 border border-[#d1c7ba] text-[#24211e] font-handwriting text-xl rounded-lg hover:bg-[#dfd7cc] transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
      {/* Decorative elements to match the paper theme */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-5 pointer-events-none rotate-12">
        <svg viewBox="0 0 100 100" fill="currentColor"><path d="M10,10 Q50,0 90,10 Q100,50 90,90 Q50,100 10,90 Q0,50 10,10" /></svg>
      </div>
      <div className="absolute bottom-20 right-20 w-48 h-48 opacity-5 pointer-events-none -rotate-12">
        <svg viewBox="0 0 100 100" fill="currentColor"><path d="M20,10 Q60,10 80,30 Q90,70 60,90 Q20,100 10,60 Q10,20 20,10" /></svg>
      </div>
    </div>
  );
};
