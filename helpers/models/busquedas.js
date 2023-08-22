const fs=require('fs')

const axios = require("axios")
require("dotenv").config();

class Busqueda {
    
    historial=[]
    path='./db/historial.json'
   
    

    constructor(){

        this.leerDb()

    }

    get historialCapitalizado(){
        return this.historial.map(ciudad=>{

            let palabras=ciudad.split(' ');

            palabras=palabras.map(p=>p[0].toUpperCase() + p.substring(1) );
            
            return palabras.join(' ')
        } )
    }

    get paramsMapBox(){
        return {
            limit:5,
            language:'es',
            access_token: process.env.MAPBOX_TOKEN
            
        }
        
    }

    async ciudad(termino=''){

        try {
            const instance=axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${termino}.json`,
                params:this.paramsMapBox
            })
            
            const resp= await instance.get()
            const lugares=resp.data.features.map(termino=>({
                id:termino.id,
                ciudad:termino.text,
                lat:termino.center[1],
                lng:termino.center[0]

            })
            )
            //console.log(lugares)
            return lugares
            
        } catch (error) {
            return []
            
        }
    }


    get paramWheather() {

        return {
            appid:process.env.OPEN_WHEATHER_KEY,
            units:'metric',
            lang:'es'
        }
    }
    async clima(lat,lon){




        try {
            const instance=axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params:{...this.paramWheather,lat,lon}

            })

            const resp= await instance.get()
            const {main, weather}=resp.data
          
           
            return {
                temp:main.temp,
                min:main.temp_min,
                max:main.temp_max,
                desc:weather[0].description
            }

            
        } catch (error) {
            console.log(error)
            
        }
    }

    agregarHistorial(ciudad){
        if(this.historial.includes(ciudad.toLowerCase())) return

        this.historial=this.historial.splice(0,5)

        this.historial.unshift(ciudad.toLowerCase())

    }

    guardarHistorial(){
        
        const payload={historial:this.historial}
        fs.writeFileSync(this.path,JSON.stringify(payload))
    }


    leerDb(){
       
        if(!fs.existsSync(this.path)) return
        const info=fs.readFileSync(this.path,{encofing:'utf-8'})
        this.historial=JSON.parse(info).historial
    }
}

module.exports=Busqueda

