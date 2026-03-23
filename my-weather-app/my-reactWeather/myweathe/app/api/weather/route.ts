import {NextResponse, NextRequest} from 'next/server'
import {WeatherData} from '../../../types/weather'



export  async function GET(request: NextRequest){
const {searchParams} = new URL(request.url)
const city = searchParams.get('city') || 'london'
const apiKey = process.env.WEATHER_API_KEY
if(!apiKey){
return NextResponse.json({error:"api key missing"},{status:500})
}


try{
const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)

if(!res.ok){
return NextResponse.json({error: 'failed to fetch weather data'}, {status:res.status})


}
const data:WeatherData = await res.json()
return NextResponse.json(data)
}catch{


}
}