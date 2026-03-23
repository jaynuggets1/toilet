import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RainySky',
};
//we export default our RootLayout function and write our tailwind at body, div, header
//remmeber to write my children object <body>/<main> because that's how all stuffs rendered
export default function RootLayout({  children }: {  children: React.ReactNode;}) {
  return (
    <html lang="en">
      {/*bg = background slate=grayish blue  theres colors 50 - 950 they go by 50's and sometimes don't have colors between//so for exe slate values 
       go 50 100    400 600   800 900 950 if you do   160 it won't render and it defaults to white cuz it's not a css value  
       / is access opacity so if you do bg-slate-900/65 that's 65% opacity text = text  min-h-screen means  min - height 100vh */ }

    
      <body className={`${inter.className} bg-slate-900/95 text-slate-50 min-h-screen`}>

      {/*max-w-5xl is max width 1024   some values for max-w are   lg xl 2x` 3xl  5xl  7xl ...etc  mx-auto is margin auto is to cover 
      all empty space on the screen and split it equally left and right it's good practice because some might have long monitors 
      px-4 and py-8 is  padding-horizontal and padding vertical it has a x4 so px-2 is 8px and pxy-6 is 24px */}
        <div className="max-w-5xl mx-auto px-2 py-8"> 
                                    
              {/*mb is margin bottom 8 remember margin is x4 so mb-8 is margin bottom 32px, so tailwind it just flex no need for display:flex,j
                justify-between is justify content: space between,   align items:center is items-center border-b is bottom border 1px thick, my 
                 border-slate-800 is border color grayish blue and 800 makes it darker,  pb-6 is padding bottom 6 x4 so it's 24px */}
          <header className="mb-8 flex justify-between items-center border-b border-slate-950 pb-6 pt-10 ">

          {/*text-3x1 is text size 30px ,  font-black is font color black, tracking-tight is spacing letters closer together, 
          bg-gradient-to-r creates a linear background gradient that flows from left to right    from-blue-400 sets the gradient start from-
          blue-400 which is bright medium blue and  to-emerald-400 sets end of gradient to a bright medium green, 
          bg-cliptext is so the gradient doesn't block the actual letters, text-transparent because the text has it's own color by
          default it has it's own color so you do text-transparent so the gradidient can cover the text and give the text a gradient effect*/}
            <h1 className=" text-3xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mx-auto">
              RAINYSKY
            </h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}