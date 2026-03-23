// types/weather.ts // types folder at root of nextjs creation and store my weather.ts file 
//my interface data doesn't need to be all these properties or objects only what I write at my jsx



//interfaces are objects remember to export interface myInterface{name:string} define property:data type
//syntax is interface define worded, interface name {propery: data type} you do nested divs if wanted
//we've export since I'm sending this to other  files
export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
  };
}
export interface FavoriteCity {
  id: string;      // Supabase UUIDs are strings
  city_name: string;
  user_id: string;
  created_at: string;
}