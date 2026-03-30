'use client';

import React from 'react';
import Script from 'next/script';

export default function InstagramCarousel() {
  return (
    <div className="w-full h-full relative bg-gray-50 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
      {/* Elfsight Instagram Feed Script loaded efficiently to avoid blocking Next.js */}
      <Script 
        src="https://elfsightcdn.com/platform.js" 
        strategy="lazyOnload" 
      />
      {/* Contenedor oficial del Widget */}
      <div 
        className="elfsight-app-5457c1ac-5c91-46c5-b240-b66c77c232df w-full h-full" 
        data-elfsight-app-lazy
      ></div>
    </div>
  );
}
