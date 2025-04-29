
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-pawmatch-purple rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.96 15.26a1 1 0 00-1.41 0l-1.5 1.5a1 1 0 001.41 1.41l1.5-1.5a1 1 0 000-1.41z"/>
              <path d="M12.06 12.16a1 1 0 00-1.41 0l-1.5 1.5a1 1 0 001.41 1.41l1.5-1.5a1 1 0 000-1.41z"/>
              <path d="M15.16 9.06a1 1 0 00-1.41 0l-1.5 1.5a1 1 0 001.41 1.41l1.5-1.5a1 1 0 000-1.41z"/>
              <path d="M18.26 5.96a1 1 0 00-1.41 0l-1.5 1.5a1 1 0 101.41 1.41l1.5-1.5a1 1 0 000-1.41z"/>
              <path d="M12 16a4 4 0 100 8 4 4 0 000-8zm0 6a2 2 0 110-4 2 2 0 010 4z"/>
              <path d="M19 7a4 4 0 100-8 4 4 0 000 8zm0-6a2 2 0 110 4 2 2 0 010-4z"/>
              <path d="M5 7a4 4 0 100-8 4 4 0 000 8zm0-6a2 2 0 110 4 2 2 0 010-4z"/>
              <path d="M5 24a4 4 0 100-8 4 4 0 000 8zm0-6a2 2 0 110 4 2 2 0 010-4z"/>
              <path d="M19 24a4 4 0 100-8 4 4 0 000 8zm0-6a2 2 0 110 4 2 2 0 010-4z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-pawmatch-purple">PawMatch</h1>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <a href="#" className="text-gray-700 hover:text-pawmatch-purple transition">Home</a>
          <a href="#" className="text-gray-700 hover:text-pawmatch-purple transition">How It Works</a>
          <a href="#" className="text-gray-700 hover:text-pawmatch-purple transition">Success Stories</a>
          <Button variant="outline" className="border-pawmatch-purple text-pawmatch-purple hover:bg-pawmatch-purple hover:text-white">
            Contact Us
          </Button>
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4">
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-gray-700 hover:text-pawmatch-purple transition">Home</a>
            <a href="#" className="text-gray-700 hover:text-pawmatch-purple transition">How It Works</a>
            <a href="#" className="text-gray-700 hover:text-pawmatch-purple transition">Success Stories</a>
            <Button variant="outline" className="border-pawmatch-purple text-pawmatch-purple hover:bg-pawmatch-purple hover:text-white">
              Contact Us
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
