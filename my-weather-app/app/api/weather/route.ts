// app/api/weather/route.js 
import {NextRequest, NextResponse } from 'next/server';// nextResponse used to send back the response from the api route 
import {WeatherData} from '../../../types/weather'


export async function GET(request: NextRequest) {//GET method to handle the incoming request 
  const { searchParams } = new URL(request.url);//whataevers at the end of the url after ?  is called searchParams we access it using the url object
  const city:string = searchParams.get('city') || 'London';//we get my city name from the searchParams if nameis not provided we defualt it to london
  const apiKey = process.env.WEATHER_API_KEY;//my environment api key is assigned to my variable

  if(!apiKey){
    return NextResponse.json({error:'api key missing'},{status:500})
  }

  try{
  const res = await fetch(//we fetch my data from the weather api using city name and my api key 
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)


    //catch statements only notice server or internet issues, not actual url errors like
    //not found errors or unauthorized error for example if I fetched a city that didn't
    //exists at my weather api, even if it returned an error it would bypass my try
    //statement and go through which we wouldnt want because my data would be undefined
    //res.ok catches any url errors which if my api returns errors !res.ok catches it j
    //is not a requirement typescript but it is safe logic to use if fetch requsts
    if(!res.ok){//
          return NextResponse.json({error:'failed to fetch weather data'},{status:res.status})

    }
    //my logic here is type assertion casting, when fetching data from an api its unknown what returns
    //so typescript has no idea what its defined as and typescript treats anything unknown as dangerous
    //so we add data:WeatherData to define what is going to come out of our api 
    //
    const data:WeatherData = await res.json();//we convert the response to json format and assign it to data variable

    return NextResponse.json(data)
}catch(error){

  return NextResponse.json({error:'internal server error '}, {status:500})
}
}








