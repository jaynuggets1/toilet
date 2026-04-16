"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";












//I want to annotate the mechanics of my site so i can write it from scratch
//and add cooler/more features 
//so where should I start, what's my site built of?
//api , supabase , useState for my ui features, formData , jsx operators,
//function logic

export default function HomePage() {
  const supabase = createClient();

  // --- Auth State ---
  //we do useStates for my users 
  const [user, setUser] = useState<any>(null); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false); // Toggle for guest login
const [showNotification, setShowNotification] = useState(false);
const [savedCityName, setSavedCityName] = useState(""); 



//syntax, directions, reasoning

  // --- Weather State ---
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Load User & Initial Weather
  //we useEffect to check if users are logged in right when site loads
  useEffect(() => {
    //we create an async function to do our supabase authentication logic for users, we grab their user object and give them their saved city with weather if they have one
    const getSession = async () => {
      //always use try on async functions to catch errors and prevent crashes
      try {
        //I get my user object from supabase by doing //const {data: {user}} = await supabase.auth.getUser() and set my user object to state like setUser(user) 
        const { data: { user } } = await supabase.auth.getUser();

        //set the user object we got from supabase to state so we can use 
        setUser(user);

        //if user exists, give them their saved city name by doing .from("profiles").select("home_city").single()
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("home_city")
            .single();


          //if user exists and they've a saved city set, get the weather for that city
          getWeather(profile?.home_city || "chicago");
        } else {
          getWeather("chicago");
        }
      } catch (err) {
        console.error(err);
        getWeather("chicago");
      } finally {
        setAuthLoading(false);
      }
    };
    //remember to call my getSession at end of useEffect logic 
    getSession();

    
  }, []);


  // 1. Load User & Initial Weather
useEffect(() => {
  const getSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("home_city")
          .single();

        if (profile?.home_city) {
          // Update the top label and fetch the weather for their home
          setSavedCityName(profile.home_city); 
          getWeather(profile.home_city);
        } else {
          getWeather("chicago");
        }
      } else {
        getWeather("chicago");
      }
    } catch (err) {
      console.error(err);
      getWeather("chicago");
    } finally {
      setAuthLoading(false);
    }
  };
  getSession();
}, []);

  // 2. Weather Fetch
 const getWeather = async (cityName: string) => {
  if (!cityName) return;
  setErrorMessage(null);
  
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${cityName}&days=5&aqi=no&alerts=no`
    );
    const data = await res.json();

    if (data.error) {
      setErrorMessage("City not found.");
    } else {
      setWeather(data);
      setCity(data.location.name);
      setSelectedDayIndex(0); 
    }
  } catch (err) {
    setErrorMessage("Network error.");
  }
};

  // 3. Auth Handlers
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } }
    });
    if (error) alert(error.message);
    else window.location.reload();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // 4. Drag Scroll Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = e.currentTarget as HTMLElement;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };


const handleSetHome = async () => {
  if (!user) {
    setShowAuthModal(true);
    return;
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert({ 
        id: user.id, 
        home_city: city.toLowerCase() 
      });

    if (error) throw error;

    // --- Notification Logic ---
    setSavedCityName(city);
    setShowNotification(true);
    
    // Hide it after 2000ms (2 seconds)
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);

  } catch (err: any) {
    console.error("Error setting home:", err.message);
  }
};






  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold">
        Loading Rainysky...
      </div>
    );
  }

  return (
<div className="text-white">
  {/* NAVIGATION:
      - 'flex justify-between': The "Standard Split" - pushes logo left and profile right.
      - 'items-center': Vertically aligns the text so the small 'Logout' button aligns with the big 'Logo'.
  */}
  <nav className="flex justify-between items-center py-7">
    {/* BRANDING: 
        - 'bg-clip-text text-transparent': The "Stencil Trick" - clips the gradient inside the font.
    */}
    <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
      RAINYSKY
    </div>

    {/* HOME CITY DISPLAY (Desktop Only):
        - 'md:flex': Hidden on mobile to save space, pops in on medium screens.
        - 'tracking-widest': Increases letter spacing for that "Clean/Modern" aesthetic.
    */}
    {savedCityName && (
      <div className="hidden md:flex items-center gap-3">
        <div className="text-[29px] font-bold text-slate-500 uppercase tracking-widest">
          home: <span className="text-blue-500">{savedCityName}</span>
        </div>
        <button 
          onClick={() => {
            getWeather(savedCityName);
            setCity(savedCityName);
          }}
          className="bg-slate-800/50 hover:bg-slate-700 text-blue-300 px-3 py-1 rounded-lg text-xs font-black uppercase transition-all border border-blue-400/20"
        >
          click to see {savedCityName}'s Weather 
        </button>
      </div>
    )}

    {/* AUTH SECTION:
        - Toggles based on 'user' state. 'gap-4' keeps the email and logout button from touching.
    */}
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <span className="text-slate-400 text-md">
            {user.user_metadata?.display_name || user.email}
          </span>
          <button onClick={handleLogout} className="text-md text-red-400 font-bold">Logout</button>
        </>
      ) : (
        <button 
          onClick={() => setShowAuthModal(true)} 
          className="bg-blue-600 px-5 py-2 rounded-2xl font-bold text-sm hover:bg-blue-500 transition"
        >
          Sign In
        </button>
      )}
    </div>
  </nav>

  {/* SEARCH SECTION:
      - 'max-w-md mx-auto': The "Focus Rule" - prevents the search bar from stretching across the whole screen.
      - 'flex-1': Tells the Input to "Eat" all remaining space inside the 12-height bar.
  */}
  <section className="max-w-md w-full mx-auto mb-7 px-2"> 
    <div className="flex items-center gap-1 p-1.5 bg-gray-900/25 border border-white/10 rounded-2xl h-12">
      <input 
        type="text" 
        className="flex-1 min-w-0 bg-transparent px-2 py-1 outline-none text-white text-lg placeholder:text-white" 
        placeholder="City..." 
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && getWeather(city)}
      />
      <div className="flex gap-1">
        <button onClick={() => getWeather(city)} className="bg-slate-800/50 px-3 py-1.5 rounded-xl hover:bg-slate-700 font-bold text-sm">
          search
        </button>
        <button onClick={handleSetHome} className="bg-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-500 font-bold text-sm">
          {user ? "HOME" : "SET AS HOME"}
        </button>
      </div>
    </div>

    {/* LAYOUT STABILITY:
        - 'h-6': We give the notification div a fixed height so the content below doesn't "jump" down when the text appears.
    */}
    <div className="h-6 mt-2 text-center">
      {showNotification && (
        <p className="text-emerald-400 text-sm font-bold animate-pulse">City saved!</p>
      )}
    </div>
  </section>

  {/* 3-DAY FORECAST:
      - 'overflow-x-auto': Enables the swipe gesture on mobile.
      - 'min-w-[170px]': Essential for horizontal scrolling - prevents cards from shrinking to fit.
      - 'backdrop-blur-sm': Creates the "Glassmorphism" effect over the clouds.
  */}
  {weather && (
    <section className="flex w-full gap-4 overflow-x-auto no-scrollbar pb-4 px-4 sm:justify-center">
      {weather.forecast.forecastday
        .filter((day: any) => {
          const now = new Date();
          const offset = now.getTimezoneOffset() * 60000;
          const localDate = new Date(now.getTime() - offset).toISOString().split('T')[0];
          return day.date >= localDate;
        })
        .slice(0, 3)
        .map((day: any, index: number) => (
          <div 
            key={day.date} 
            onClick={() => setSelectedDayIndex(index)}
            className={`min-w-[170px] p-6 rounded-3xl border transition-all cursor-pointer backdrop-blur-sm ${
              selectedDayIndex === index ? 'bg-blue-600/20 border-blue-400' : 'bg-slate-900/40 border-white/5'
            }`}
          >
           <p className="text-blue-200 text-xs font-black uppercase">
  {day.date === new Date().toISOString().split('T')[0] 
    ? "Today" 
    : new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
</p>
            <div className="flex flex-col justify-center items-center">
              <img src={`https:${day.day.condition.icon}`} className="w-12 h-12 my-2" />
              <p className="text-2xl font-bold">{Math.round(day.day.avgtemp_c)}C°</p>
            </div>
            <p className="text-[17px] text-slate-400 truncate">{day.day.condition.text}</p>
          </div>
        ))}
    </section>
  )}

  {/* HOURLY FORECAST:
      - 'cursor-grab': Changes the mouse icon to a hand to suggest "Dragging."
      - 'flex-shrink-0': Prevents the 24 hour blocks from squishing into one screen width.
      - 'snap-center': Aligns items to the center of the screen when swiping on mobile.
  */}
  {weather && (
    <section className="mt-1 w-full overflow-hidden">
      <h3 className="text-white font-bold text-md uppercase tracking-widest mb-6 ml-2">Hourly Forecast</h3>
      <div 
        onMouseDown={handleMouseDown}
        className="w-full flex gap-4 overflow-x-auto pb-4 no-scrollbar cursor-grab active:cursor-grabbing select-none scroll-smooth touch-pan-x "
      >
        {weather.forecast.forecastday[selectedDayIndex].hour.map((hr: any) => (
          <div key={hr.time} className="min-w-[90px] flex-shrink-0 p-4 bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col items-center snap-center">
            <p className="text-[17px] text-white font-bold">{hr.time.split(' ')[1]}</p>
            <img src={`https:${hr.condition.icon}`} className="w-10 h-10 my-1" />
            <p className="text-lg font-bold">{Math.round(hr.temp_c)}°</p>
          </div>
        ))}
      </div>
    </section>
  )}

  {/* AUTH MODAL:
      - 'fixed inset-0': Creates a "Ghost Layer" that blocks clicks to the weather app while open.
      - 'z-50': Places it at the very front of the stacking order.
      - 'backdrop-blur-xs': Adds that professional "Frosted Glass" feel to the background.
  */}
  {showAuthModal && !user && (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-6">
      <div className="w-full max-w-md border border-white/10 bg-gray-900/60 p-10 rounded-[2.5rem] relative">
        <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">✕</button>
        <h2 className="text-3xl font-bold mb-10 text-center">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
       <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
  <input 
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" 
    placeholder="Email" 
  />
  <input 
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" 
    placeholder="Password" 
  />
  <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-2xl transition-all">
    {isSignUp ? "Sign Up" : "Log In"}
  </button>
</form>

{/* The Toggle Button */}
<p className="mt-4 text-center text-sm text-slate-400">
  {isSignUp ? "Already have an account?" : "Don't have an account?"} 
  <button 
    onClick={() => setIsSignUp(!isSignUp)} 
    className="ml-2 text-blue-400 font-bold"
  >
    {isSignUp ? "Log In" : "Sign Up"}
  </button>
</p>
      </div>
    </div>
  )}
</div>
  );
}