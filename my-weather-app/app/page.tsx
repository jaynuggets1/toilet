// app/page.js my main logic for user sessions, fetching weather data, create my buttons, fetching favorited cities, render jsx
'use client'; //'use client' shows nextjs that this is a client component so we can use hooks and other client side features such as useState, useEffect
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import {User} from '@supabase/supabase-js'
import {WeatherData, FavoriteCity} from '@/types/weather'




export default function Home() {
  //I don't need a interface for User since User is built from supbase so no typscript needed
  const [user, setUser] = useState<User | null >(null);//state user tracks currecnt logged in user initialized to null of state
  //weatherData is object I'm going to set function some api data to my weather state I want c_temp_c and c_location.name so that's what I define at my WeatherData interfaced
  const [weather, setWeather] = useState<WeatherData | null >(null);//weather state track our weather data initialize to null of state
// I don't use my objects here I'm just doing a string and there no need to interface if initial state of string so I'm good with this j
  const [city, setCity] = useState<string>('chicago');//city tracks my city name at my input inisialize to string 'new york'
  //favorites is array a interface is needed since objects are going here same as my weather I want .id city_name etc so I do that at my interface
  const [favorites, setFavorites] = useState<FavoriteCity[]> ([]); //favorites state tracks my list of favorites initialized to empty arrray

  // Check user on load
  useEffect(() => {//useEffect runs after everything else renders 
    supabase.auth.getSession().then(({ data: { session } }) => { //checks user browser to see if a session is active if there is we retrieve the session data
      setUser(session?.user ?? null);//if session.user exists we function setter to user state 
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);//if theres an auth state change we update our user state with the new session data
    });

    return () => subscription.unsubscribe();//we return a .unsubscribe function which cleans up the subscription when the component unmounts preventing memory leaks and unnecessary updates
  }, []);

  // Fetch favorites when user is logged in
  useEffect(() => {//runs whenever theres a change at user state so sign up login logout 
    if (user) fetchFavorites();//if user exists we activated fetchFavorites()
    else setFavorites([]);//if no user we clear favorites state to empty array
  }, [user]);//if user state changes this useEffect activates

  const fetchFavorites = async () => {//fetchFavorites my function to fetch my favrited cities from my database
    const { data, error } = await supabase 
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setFavorites(data);//if no error when retrieving data we store favorited data to favorites state using setter function
  };

  //I want define my cityName a string because my input I want string I also want where I show a city on start of site cityName? cityName || newyork it activates newyork at statej 
  const fetchWeather = async (cityName?: string) => {//fetchWeather function to fetch weather data from my api route
    const target = cityName || city;   //if cityName is provided we use it otherwise set it to initial city state 

    const res = await fetch(`/api/weather?city=${target}`);//fetch city that we typed/or my initial city from my api route
    
    //interfaces arent needed for fetch request the y are for my data of those requests though  I want location.name current.c so I define my received data to that interfac
    const data:WeatherData = await res.json();//we parse my data response to json format

    setWeather(data);//we store my  weather data to weather state using setter function
  };
  

  const saveFavorite = async () => {
    if (!user) return; //if no user return early avoid error of trying to save without being logged in
    const { error } = await supabase 
      .from('favorites')
      .insert([{ city_name: weather.location.name, user_id: user.id }]);//we insert a favorite city database
    if (!error) fetchFavorites();//we activate my fetchFavorites function to render my new list of favorited cities 
  };

  // NEW: Delete Favorite Logic
  //id easy logic I want it to be a string and thats it no interface or ? logic needed
  const deleteFavorite = async (id: string) => {//delete function to delete a favorited city we need id as tracker to delete clicked city of favorited
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);
    if (!error) fetchFavorites();
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl text-slate-800">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-600">WeatherCloud</h1>
      
      <Auth user={user} /> {/*Auth component from out auth.jsx it's jsx to signup or login, if logged in it shows a sign out button*/}

      <div className="mt-8 flex gap-2">
        <input 
          value={city} 
          onChange={(e) => setCity(e.target.value)} //this is where we type our city we send whatever we type to city state 
          placeholder="Enter city..."
          className="border-2 p-3 rounded-lg flex-grow focus:outline-none focus:border-blue-400"
        />
        <button onClick={() => fetchWeather()} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">
          Search
        </button> {/*we also add a button to this div if clicked it activated fetchWeather which fetches whatever we typed*/}
      </div>

        {/*if weather datas exists show weather details */}
      {weather && (   
        <div className="mt-6 p-6 bg-blue-500 text-white rounded-xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{weather.location?.name}</h2>
            <p className="text-4xl font-black">{weather.current?.temp_c}°C</p>
          </div>
          {user && ( 
            <button onClick={saveFavorite} className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow-md">
              + Favorite
            </button>
          )}
        </div>
      )}

{/*if user is logged in and has favorited cities return jsx of data favorited */ }
      {user && favorites.length > 0 && (
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-3">Saved Locations</h3>
          <div className="space-y-2">
            {/*we favorites.map favorites state we give each favorited object an id,button to show weather stats, and delete button*/ }
            {favorites.map((fav) => (
              <div key={fav.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 group">
                <button onClick={() => fetchWeather(fav.city_name)} className="flex-grow text-left font-medium">
                  {fav.city_name}
                </button>
                <button 
                  onClick={() => deleteFavorite(fav.id)} 
                  className="text-red-400 hover:text-red-600 text-sm font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}