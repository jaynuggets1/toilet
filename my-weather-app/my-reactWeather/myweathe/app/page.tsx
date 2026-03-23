'use client'
import {useState, useEffect} from 'react'
import {supabase} from '@/lib/supabase'
import Auth from '@/components/Auth'
import {User} from '@supabase/supabase-js'
import {WeatherData, FavoriteData} from '@/types/weather'


export default function myHome(){

const [user, setUser]=useState<User | null>(null)
const [weather, setWeather]=useState<WeatherData | null>(null)
const [favorites, setFavorites] =useState<FavoriteData[]>([])
const [city, setCity] =useState<string>("Chicago")


useEffect(()=>{
  supabase.auth.getSession().then(({data: {session}})=>{
    setUser (session?.user ?? null)
  })
const {data: {subscription }} = supabase.auth.onAuthStateChange((_event, session)=>{
    setUser (session?.user ?? null)
 })
 return ()=>subscription.unsubscribe()
},[])





useEffect(()=>{
  if(user){
    fetchFavorites()
  }else(setFavorites([]))
},[user])





async function retrieveWeather(cityName?:string){

const target = cityName || city
const res = await fetch(`/api/weather/?city=${target}`)
const data: WeatherData = await res.json()
console.log(data) 
setWeather(data)

}



async function fetchFavorites(){
const {data, error } = await supabase.from('favorites').select("*")

if(!error)setFavorites(data)
}


async function saveFavorite(){
  if(!user) return
const {data,error} = await supabase.from('favorites').insert([{city_name:weather.location.name, user_id:user.id}])
if(!error) fetchFavorites()
}




async function deleteWeather(id:string){
const {error} = await supabase.from('favorites').delete().eq("id" , id)


if(!error) fetchFavorites()


}



  return(
    <div>
      Jaydenw
      <Auth user={user}/>



<div>
  which city:

  <input value={city} placeholder="enter," 
  onChange={(e)=>setCity(e.target.value)}/>


  <button onClick={()=>retrieveWeather()}>wk</button>
</div>





{weather && (
<div> 


  {weather.location?.name}
  {weather.current?.temp_c}
{user &&(

<button onClick={saveFavorite}>add favorite</button>
)    
}


</div>


)}

{user && favorites.length > 0 && (
<div>

  my favorites:

  {favorites.map((J)=><div onClick ={()=>retrieveWeather(J.city_name)} key={J.id}>{J.city_name}
<button onClick={()=>deleteWeather(J.id)}>delete</button>
  </div>
  
  )
  }
</div>
)}






    </div>
  )
}