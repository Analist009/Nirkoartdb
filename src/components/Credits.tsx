import React from 'react';
import { Phone, Mail, Globe } from 'lucide-react';

export function Credits() {
  return (
    <footer className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center">
        <div className="text-sm text-gray-600">
          <h3 className="font-semibold mb-1">מיכאל נירקו</h3>
          <p className="text-gray-500">אמן AI ומפתח תוכנה</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 md:mt-0">
          <a 
            href="tel:0528277544" 
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span dir="ltr">052-827-7544</span>
          </a>
          
          <a 
            href="mailto:contact@nirkoart.com" 
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>contact@nirkoart.com</span>
          </a>
          
          <a 
            href="https://nirkoart.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>nirkoart.com</span>
          </a>
        </div>
        
        <div className="text-sm text-gray-500 mt-2 md:mt-0">
          © {new Date().getFullYear()} NirkoArt - כל הזכויות שמורות
        </div>
      </div>
    </footer>
  );
}