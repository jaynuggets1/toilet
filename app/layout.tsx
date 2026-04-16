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
      {/**/}
<body className={`${gameFont.className}  text-white `}>     

   {/* THE STAGE (Fixed Parent):
          - 'fixed inset-0' creates a viewport-sized "glass box" that ignores scrolling.
          - CRITICAL REASONING: Because this div is now "positioned" (not static), 
            it acts as the COORDINATE SYSTEM for every absolute child inside it. 
            (0,0) is now the top-left of this box, not the whole page.
        */}
        <div className="fixed inset-0  ">
          
          {/* THE CANVAS (Absolute Child):
            - REASONING: We use 'absolute' here because an image is normally an "inline" element 
              that wants to sit on a line like text. 'absolute' rips it out of that 
              logic and tells it: "Ignore text lines; look at your parent (the fixed div) 
              and pin yourself to its edges."
            - 'inset-0' works here because the parent is fixed. It stretches the image 
              to match the parent's boundaries exactly.
          */} 
          <img 
            src="/cloudz.jpg" 
            className="absolute inset-0 w-full h-full" 
            alt="background"
          />
          
          {/* THE OVERLAY (Stacking Dynamic):
            - REASONING: In CSS, if two things are 'absolute' inside the same parent, 
              the one written LATER in the code sits on TOP. 
            - Because this image comes after the Base Image, it naturally stacks 
              in front of it without needing a z-index.
            - '-translate-x-1/2' REASONING: 'left-1/2' moves the image's LEFT EDGE to the center. 
              Translate then shifts the image's own mass leftward by 50% of its width. 
              It's a tug-of-war that results in a perfect center.
          */}
          <img 
            src="/cloudySky.jpg" 
            className="absolute max-w-4xl top-0 left-1/2 -translate-x-1/2 h-full w-full  pointer-events-none" 
            alt="middle sky pillar"
          />

          {/* THE TINT (Empty Absolute):
            - REASONING: This is a "ghost layer." It has no content, but 'absolute inset-0' 
              forces it to have the exact same dimensions as the parent 'fixed' div.  
              It acts as a colored filter sitting on top of the images.
          */}
          <div className="absolute inset-0 " />
        </div>

        {/* THE FOREGROUND (Z-Index Logic):
          - REASONING: 'relative' is used here specifically to "unlock" the z-index property. 
            By default, your 'fixed' background and this 'relative' content are on the same 
            stacking level. 
          - 'z-10' REASONING: This manually forces this div to a "higher floor" than the 
            fixed background, ensuring your text is never buried behind your background images.
        */}
        <div className="max-w-4xl mx-auto relative  z-10">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}