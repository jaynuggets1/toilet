




export interface WeatherData{
location: {

name:string
region:string
country:string
}





    current:{
        temp_c:number
    }
}


export interface FavoriteData{

    id:string
    city_name:string
    usesr_id:string
    created_at:string
}