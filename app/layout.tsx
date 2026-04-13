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
<div className="fixed inset-0 z-0 overflow-hidden">
  {/* Base Image */}
  <img 
    src="/cloudz.jpg" 
    className="absolute inset-0 w-full h-full " 
    alt="background"
  />
  
  {/* Middle Pillar */}
  <img 
    src="/cloudySky.jpg" 
    className="absolute max-w-6xl top-0 left-1/2 -translate-x-1/2 h-full w-full  opacity-80 pointer-events-none" 
    alt="middle sky pillar"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0  " />
</div>

        {/* CONTENT LAYER */}
        <div className="max-w-5xl mx-auto px-4 relative min-h-screen z-10">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}