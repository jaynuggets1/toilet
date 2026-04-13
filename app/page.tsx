"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function HomePage() {
  const supabase = createClient();

  // --- Auth State ---
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false); // Toggle for guest login

  // --- Weather State ---
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    getSession();
  }, []);

  // 2. Weather Fetch
  const getWeather = async (cityName: string) => {
    if (!cityName) return;
    setErrorMessage(null);
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${cityName}&days=3`
      );
      const data = await res.json();

      if (data.error) {
        setErrorMessage("City not found.");
      } else {
        setWeather(data);
        setCity(data.location.name);
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold">
        Loading Rainysky...
      </div>
    );
  }

  return (
    <div className="z-10 min-h-screen text-white ">
      <main className="max-w-6xl mx-auto px-6">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center py-7">
          <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            RAINYSKY
          </div>
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

        {/* Search & Set Home Section */}
       <section className="max-w-md mx-auto mb-12 px-2"> {/* Added small padding for mobile edges */}
  <div className="flex flex-wrap sm:flex-nowrap gap-2 p-2 bg-gray-700/42 border border-white/10 rounded-3xl min-w-[370px]">
    <input 
      type="text" 
      placeholder="Search city :]" 
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && getWeather(city)}
      className="flex-1 min-w-[66px]  px-3 py-2 outline-none text-white ring-blue" 
    />
    <div className="flex gap-2  min-w-[70px]"> {/* Group buttons so they wrap together if needed */}
      <button 
        onClick={() => getWeather(city)}
        className="flex-1 sm:flex-none bg-slate-800/25 px-4 py-1 rounded-2xl hover:bg-slate-700 transition font-bold text-md"
      >
        Search
      </button>
      
      {user ? (
        <button 
          onClick={async () => { /* ... existing logic ... */ }}
          className=" min-w-[170px] sm:flex-none bg-blue-600 px-3 py-2 rounded-2xl hover:bg-blue-500 transition font-bold text-md whitespace-nowrap"
        >
          Set as Home
        </button>
      ) : (
        <button 
          onClick={() => setShowAuthModal(true)}
          className="text-white px-3 text-sm font-bold hover:text-white transition max-w-[140px] "
        >
          Sign in to set home
        </button>
      )}
    </div>
  </div>
</section>

        {/* 3-Day Forecast Cards */}
        {weather && (
          <section className="flex gap-4 justify-center overflow-x-auto no-scrollbar pb-4">
            {weather.forecast.forecastday.map((day: any, index: number) => {
              const date = new Date(day.date + 'T00:00:00');
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div 
                  key={day.date} 
                  onClick={() => setSelectedDayIndex(index)}
                  className={`min-w-[190px] p-6 rounded-3xl border transition-all cursor-pointer backdrop-blur-sm ${
                    selectedDayIndex === index ? 'bg-blue-600/20 border-blue-400' : 'bg-slate-900/40 border-white/5'
                  }`}
                >
                  <p className="text-blue-200 text-xs font-black uppercase tracking-tighter">
                    {index === 0 ? "Today" : dayName}
                  </p>
                  
                  <div className="flex flex-col justify-center items-center">
                  <img src={`https:${day.day.condition.icon}`} className="w-12 h-12 my-2" alt="icon" />
                  <p className="text-2xl w-15 font-bold">{Math.round(day.day.avgtemp_c)}C°</p>
                  </div>
                
                  <p className="text-[17px] text-slate-400 truncate">{day.day.condition.text}</p>
                </div>
              );
            })}
          </section>
        )}

       
{/* Hourly Forecast */}
{weather && (
  <section className="mt-12 w-full overflow-hidden">
    <h3 className="text-white font-bold text-md uppercase tracking-widest mb-6 ml-2">
      Hourly Forecast
    </h3>
   <div 
  onMouseDown={handleMouseDown}
  className="w-full flex gap-4 overflow-x-auto pb-4 no-scrollbar cursor-grab active:cursor-grabbing select-none scroll-smooth touch-pan-x snap-x snap-proximity md:snap-none"
>
      {weather.forecast.forecastday[selectedDayIndex].hour
        .filter((hr: any) => {
          if (selectedDayIndex !== 0) return true;
          return new Date(hr.time).getTime() > new Date().getTime() - 3600000;
        })
        .map((hr: any) => (
          <div 
            key={hr.time} 
            className="min-w-[90px] flex-shrink-0 p-4 bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col items-center pointer-events-none backdrop-blur-md snap-center"
          >
            <p className="text-[17px] text-blue-200 font-bold">
              {hr.time.split(' ')[1]}
            </p>
            <img 
              src={`https:${hr.condition.icon}`} 
              className="w-10 h-10 my-1" 
              alt="icon" 
            />
            <p className="text-lg font-bold">
              {Math.round(hr.temp_c)}°
            </p>
          </div>
        ))}
    </div>
  </section>
)}

        {/* Login Modal Overlay (Only shows if guest clicks Sign In) */}
        {showAuthModal && !user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center     backdrop-blur-xs p-6">
            <div className="w-full max-w-md  border border-white/10 bg-gray-900/60 p-10 rounded-[2.5rem] relative">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white"
              >
                ✕
              </button>
              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl">☁️</div>
                <h2 className="text-3xl font-bold">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
              </div>

              <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                {isSignUp && (
                  <input 
                    type="text" placeholder="Username" required
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                )}
                <input 
                  type="email" placeholder="Email" required
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                  type="password" placeholder="Password" required
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-2xl transition-all">
                  {isSignUp ? "Sign Up" : "Log In"}
                </button>
              </form>
              <p className="mt-8 text-center text-slate-400 text-sm">
                {isSignUp ? "Already have an account?" : "New to Rainysky?"}{" "}
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-400 font-bold">
                  {isSignUp ? "Log In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}