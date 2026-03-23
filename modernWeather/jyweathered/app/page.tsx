"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; //i import my supabase client
//we import createClient to use our supabase 
import Link from "next/link";  //import link from next/link which is for router 
//link is a clinet side route navigator and is has a thing where it can load the code it's linked to as soon as it renders at users viewage

export default function HomePage() {
  // --- Auth State ---
  const [user, setUser] = useState<any>(null);
 //user for my user data
  const [email, setEmail] = useState("");
  //email input 
  const [password, setPassword] = useState("")
    //password
  const [authLoading, setAuthLoading] = useState(true);
   // i don't  even know fr
  // --- Weather & Favorites State ---
  const [city, setCity] = useState("");
  //city input
  const [weather, setWeather] = useState<any>(null);
  //weather fetch data ,
  const [favorites, setFavorites] = useState<any[]>([]);
  //favorites supabase data
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
   //error message string



  const supabase = createClient();
   //client import

  // 1. Check Auth Status on Load
  useEffect(() => {
    const getSession = async () => { //we do async function because useEffect can't be chnaged to async 
      const { data: { user } } = await supabase.auth.getUser();
      //supabase.auth.getUser() is for securtity since it looks at auth server login values 
      // vs getSession is for speed where it checks cookies/storage for your login values
      setUser(user);//we retrive user and setFunction (user)
      if (user) fetchFavorites(user.id);//once user is retrieved we give that user their favorites with a user.id parameter so it knows 
      setAuthLoading(false);//change loading so it isn't visible 
    };
    getSession(); //don't forget to call the function so it activates 
  }, []);




  const addToFavorites = async () => {
  if (!weather || !user) return; // if user is not log or didn't search a weather don't give function a chance to activate
// we do this because what if button render for second user clicks it and it throws error since my logic saves to account

  const cityName = weather.location.name; //weather.locaiton.name is the city's weather name searched  



  // 1. Check if city is already in the local favorites list
  const isAlreadyFavorite = favorites.some( //.some runs through my favorites it checks my favorites and my city i searched if they match it returns all matching values
    (fav) => fav.city_name.toLowerCase() === cityName.toLowerCase()// we use .LowerCase at both ends so if one is London and other is london they're both converted to london 
  );

  if (isAlreadyFavorite) {  //if isAlready favorites exists that means there's a city that's already added
    setErrorMessage(`${cityName} is already in your favorites!`);//so we say setErrorMessage a string this city is already at your favortites
    setTimeout(() => setErrorMessage(null), 3000);//do setTimeout(()=>setErrorMessage(null)) at the end so it can disappear after a few seconds
    return; //return is because if i don't my code is going to continue to run and add my favorite to list i don't want that i want it to return
  }

  // 2. Insert into Supabase
  const { error } = await supabase
    .from("favorites")
    .insert([{ 
      city_name: cityName, 
      user_id: user.id 
    }]);   //if it does go throgh i save my favorite to my database with .from("").insert([{}])

  if (error) {
    setErrorMessage("Could not save to favorites.");//if error setErrorMessage("could not save to favorites")
  } else {
    // 3. Refresh the local list so it shows up immediately //if success run my fetchFavorites(user.id) to render users favorites
    fetchFavorites(user.id);
  }
};

const deleteFavorite = async (id: string) => { //favorite delete logic my paramter id so i know which id to delete
  const { error } = await supabase
    .from("favorites")   //delete my favorites by doing .from().delete().eq("", )
    .delete()
    .eq("id", id);

  if (error) {
    setErrorMessage("Could not remove favorite.");//if error setErrorMessage 'could not remove favorites'
  } else {
    // Update the local state immediately to remove the item from the screen
    setFavorites(favorites.filter((fav) => fav.id !== id)); //setFavorites
  }
};









  // 2. Fetch Favorites from Supabase
  const fetchFavorites = async (userId: string) => {
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId);
    if (data) setFavorites(data);
  };




// 1. The reusable fetch function
const getWeather = async (cityName: string) => {
  setErrorMessage(null); //we make error message disappear to get out the way so our weather render is visible
  if (!cityName) return; //if no city is typed no action is activated we return
  
  try {          //if there is a city we do a try catch to our weather api to retrieve datas
    const res = await fetch(   // we fetch to our api url and do our api key and cityName from parameter
      `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${cityName}`
    );

    //remember to do await res.json() to parse data receive
    const data = await res.json();

    if (data.error) { //show error we received from our parsed fetch request to catch errors which may return but theres issues with values 
      setErrorMessage("City not found."); //if theres an error received from fetch request we do setErrorMessage("city not found")
      setWeather(null); //if error we do setWeather(null) so weather doesn't render and our error message is shown
    } else {
      setWeather(data);  //if theres no error from our fetch request we setWeather(data) to set our api datas to weather state for usage
      setCity(cityName); // Sync the input field with the clicked city so our input shows the city we searched
    }
  } catch (err) {  //catch if our fetch request fails this is for internet or maybe issues with site im trying to retrieve from is downed j
    setErrorMessage("Network error.");
  }
};



// 2. The form submission handler
const handleSearch = (e: React.FormEvent) => { //we created this function to handle form submissions
  
  e.preventDefault(); //.preventDefault so form doesn't refesh site
  getWeather(city); //activate getWeather function with a parameter of my city form is submitted we activate our function
};



  // 4. Auth Logic
  const handleLogin = async (e: React.FormEvent) => {  //our login function
    e.preventDefault(); //it's a form so we need .preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password });//remember it's const {}=await supabase.auth.signInWithPassword({}) 
     if (error) alert(error.message); //if there's an error with login we alert(error.message)
    else window.location.reload(); //if no error we do else window.location.reload() which refreshes site so my auth logic can render without manual refresh to render
  };

  if (authLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;


  // --- VIEW 1: AUTHENTICATED DASHBOARD ---
  if (user) {
    //if u user is logged in return a weather search and their favorites list 
    // min-h-screen is min-height 100vh so it fills the screen, bg-slate-950 is really dark blue/gray background, p-6 is padding 24px on all sides
    return (
      <main className="min-h-screen bg-slate-950  p-6">


        {/* Navigation Bar - flex makes it horizontal, justify-between spaces items apart (logo on left user on right), mb-10 is margin 40px below */}
        <nav className="flex justify-between mb-10">
          {/* text-2xl=28px font, font-black=super thick, tracking-tighter=letters closer, text-blue-500=blue */}
          <h1 className="text-2xl font-black tracking-tighter text-blue-500">:{`${" ]"}`}</h1>
          {/* flex=horiz layout, items-center=vert center, gap-4=16px spacing */}
          <div className="flex items-center gap-4">
            {/* text-sm=14px, text-slate-500=gray/blue */}
            <span className="text-sm text-slate-500">{user.email}</span>
            {/* px-4 py-2=padding, bg-slate-900=dark bg, border=1px dark, rounded-xl=12px corners, text-xs=12px,
                hover:bg-slate-500/10=gray 10% opacity on hover, hover:text-blue-500=blue on hover, transition-all=smooth 150ms */}
            <button 
              onClick={() => supabase.auth.signOut().then(() => setUser(null))}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-500/10 hover:text-blue-500 transition-all"
            >
              Sign Out
            </button>
          </div>
        </nav>
        {/* max-w-3xl=max 768px width, mx-auto=center horizontally, space-y-8=32px margin between elements */}
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Search Section */}
          <section>
            {/* relative=position relative to parent, group=style children on hover */}
            <form onSubmit={handleSearch} className="relative group">
              {/* Input: w-full=100%, p-5=20px padding, bg-slate-900=dark bg, border=1px dark,
                  rounded-3xl=24px corners, outline-none=no browser outline, focus:ring-2 focus:ring-blue-600=2px blue ring on click, transition-all=smooth */}
              <input 
                type="text"
                placeholder="Search for a city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-5 bg-slate-900 border border-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-lg"
              />
              {/* Button: absolute=rel to parent, right-3 top-3=12px from right/top, bg-blue-600=bright blue,
                  hover:bg-blue-700=darker on hover, px-6 py-2=24px horiz 8px vert padding, rounded-2xl=16px corners, font-bold=thick, transition-all=smooth */}
              <button className="absolute right-3 top-3 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-2xl font-bold transition-all">
                Search
              </button>
            </form>
            {errorMessage && <p className="text-red-500 text-sm mt-3 ml-2">⚠️ {errorMessage}</p>}
          </section>

          {/* Weather card: p-8=32px padding, bg-gradient-to-br=diagonal gradient top-left to bottom-right,
              from-blue-600 to-blue-800=bright blue to dark blue, rounded-[2.5rem]=40px corners, shadow-2xl=big shadow,
              shadow-blue-900=dark blue shadow, animate-in fade-in zoom-in=fade&zoom appear, duration-300=300ms animation */}
          {weather && (
            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] shadow-2xl shadow-blue-900 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-start">
                <div>
                  {/* text-4xl=36px big font, font-bold=thick, tracking-tight=letters closer */}
                  <h2 className="text-4xl font-bold tracking-tight">{weather.location.name}</h2>
                  {/* text-blue-100=light blue, opacity-80=80% opaque so slightly transparent */}
                  <p className="text-blue-100 opacity-80">{weather.location.region}, {weather.location.country}</p>
                </div>
                {/* flex=horz layout, items-center=vert center, gap-2=8px gap, bg-white/20=white 20% opacity,
                    hover:bg-white/30=more opaque on hover, backdrop-blur-md=frosted glass blur, px-4 py-2=padding,
                    rounded-xl=12px corners, text-sm=14px, font-bold=thick, transition-all=smooth */}
                <button 
                  onClick={addToFavorites}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  <span>+</span> Add to Favorites
                </button>
                <div className="text-right">
                  {/* text-7xl=48px huge font, font-light=thin, tracking-tighter=letters closer */}
                  <p className="text-7xl font-light tracking-tighter">{Math.round(weather.current.temp_c)}°C</p>
                  {/* text-blue-100=light blue, font-medium=medium weight */}
                  <p className="text-blue-100 font-medium">skies: {weather.current.condition.text}</p>
                </div>
              </div>
              {/* mt-8=32px margin-top, pt-6=24px padding-top, border-t=top border,
                  border-white/10=white 10% opacity, flex items-center gap-6=horiz centered 24px gap */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-6">
                {/* w-16 h-16=64x64px weather icon */}
                <img src={`https:${weather.current.condition.icon}`} className="w-16 h-16" alt="weather-icon" />
                {/* flex gap-8=horiz layout 32px gap between sections, text-sm=14px */}
                <div className="flex gap-8 text-sm">
                  <div>
                    {/* text-blue-200=light blue, uppercase=all caps, text-[10px]=custom 10px,
                        font-black=super thick, tracking-widest=letters far apart */}
                    <p className="text-blue-200 uppercase text-[10px] font-black tracking-widest">Humidity</p>
                    {/* text-xl=20px, font-bold=thick */}
                    <p className="text-xl font-bold">{weather.current.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-blue-200 uppercase text-[10px] font-black tracking-widest">Wind</p>
                    <p className="text-xl font-bold">{weather.current.wind_kph} <span className="text-xs">kph</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Favorites Section */}
          <section className="pt-4">
            {/* text-slate-500=medium gray, font-bold=thick, text-xs=12px, uppercase=all caps,
                tracking-widest=letters far apart, mb-4=16px margin-bottom */}
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">Saved Locations</h3>
            {/* grid=grid layout, grid-cols-1=1 col mobile, sm:grid-cols-2=2 cols at small screens, gap-4=16px gap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.length > 0 ? (
                // p-5=20px padding, bg-slate-900=dark bg, border=1px dark,
                // rounded-2xl=16px corners, flex justify-between items-center=horz space between,
                // hover:border-slate-600=lighter gray on hover, transition-all=smooth, cursor-pointer=hand cursor
                favorites.map((fav) => (
                  <div key={fav.id} 
                  onClick={() => {
      getWeather(fav.city_name);
    }}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center hover:border-slate-600 transition-all cursor-pointer"
                  >
                    {/* font-bold=thick, text-lg=18px */}
                    <span className="font-bold text-lg">{fav.city_name}</span>
                    {/* p-2=8px padding, text-slate-500=medium gray, hover:text-red-500=red on hover,
                        hover:bg-red-500/10=red 10% opacity on hover, rounded-lg=8px corners, transition-colors=smooth */}
                    <button
      onClick={(e) => {
        e.stopPropagation();
        deleteFavorite(fav.id);
      }}
      className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
      title="Delete"
    >
      {/* Small Trash Icon or X */}
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
      </svg>
    </button>                  </div>
                ))
              ) : (
                // col-span-full=all columns, py-10=40px vert padding,
                // border-2 border-dashed=2px dashed, border-slate-900=dark border,
                // rounded-3xl=24px corners, text-center=center text, text-slate-600=medium gray
                <div className="col-span-full py-10 border-2 border-dashed border-slate-900 rounded-3xl text-center text-slate-600">
                  Your favorite cities will appear here.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // --- VIEW 2: LOGIN PAGE ---
  // min-h-screen=100vh height, flex items-center justify-center=center both ways on screen, bg-slate-950=really dark, p-6=24px padding
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      {/* w-full=100%, max-w-md=max 448px width, bg-slate-900=dark bg, border=1px dark,
          p-10=40px padding, rounded-[2rem]=32px corners, shadow-2xl=big shadow */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2rem] shadow-2xl">
        {/* mb-10=40px margin-bottom, text-center=center text */}
        <div className="mb-10 text-center">
          {/* w-16 h-16=64x64px, bg-blue-600=bright blue,
              rounded-2xl=16px corners, mx-auto=horiz center,
              mb-6=24px margin-bottom, flex items-center justify-center=center emoji, text-3xl=30px */}
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl">☁️</div>
          {/* text-3xl=30px, font-bold=thick, text-white=white */}
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          {/* text-slate-400=lighter gray, mt-2=8px margin-top */}
          <p className="text-slate-400 mt-2">Log in to check the skies.</p>
        </div>

        {/* space-y-4=16px margin-bottom between inputs */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* w-full=100%, p-4=16px padding, bg-slate-800=darker gray,
              border=1px lighter, rounded-2xl=16px corners, text-white=white,
              outline-none=no outline, focus:ring-2 focus:ring-blue-600=2px blue on focus */}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          {/* w-full=100%, py-4=16px vert padding, bg-blue-600=bright blue,
              hover:bg-blue-700=darker on hover, text-white=white, font-bold=thick,
              rounded-2xl=16px corners, transition-all=smooth, shadow-lg shadow-blue-900/20=big shadow dark tint */}
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20">
            Log In
          </button>
        </form>

        {/* mt-8=32px margin-top, text-center=center, text-slate-500=medium gray, text-sm=14px */}
        <p className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account?{" "}
          {/* text-blue-500=blue, font-bold=thick, hover:underline=underline on hover */}
          <Link href="/signup" className="text-blue-500 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </main>
  );
}