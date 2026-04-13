import "./globals.css";
import { Inter } from 'next/font/google';
import { createClient } from "@/utils/supabase/client"; //i import my supabase client
import { VT323 } from 'next/font/google';

const gameFont = VT323({ 
  weight: '400',
  subsets: ['latin'],
});

const inter = Inter({ subsets: ['latin'] });

//we export default our RootLayout function and write our tailwind at body, div, header
//remmeber to write my children object <body>/<main> because that's how all stuffs rendered
export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        <title>rainysky</title>
      </head>
      {/* Added bg-slate-950 as a fallback color */}
<body className={`${gameFont.className}  text-slate-300 relative min-h-screen bg-slate-950`}>        
      {/* BACKGROUND LAYER */}
<div className="fixed inset-0 -z-10 overflow-hidden">
  {/* 1. Base Image: Covers the entire screen behind everything */}
  <img 
    src="/cloudz.jpg" 
    className="absolute inset-0 w-full h-full object-cover " 
    alt="background"
  />
  
  {/* 2. Middle Pillar: Full height, ~1000px wide, centered */}
  <img 
    src="/cloudySky.jpg" 
     className="absolute max-w-6xl top-0 left-1/2 -translate-x-1/2 h-screen w-full object-cover  pointer-events-none" 
    alt="middle sky pillar"
  />

  {/* 3. Dark Overlay: Helps text contrast */}
  <div className="absolute inset-0 bg-slate-950/20" />
</div>

        {/* CONTENT LAYER */}
        <div className="max-w-5xl mx-auto px-4 relative min-h-screen z-10">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}