
const { leerInput, inquirerMenu, pause, listaCiudad}=require('./helpers/inquirerHelp.js')
const Busqueda = require('./helpers/models/busquedas.js')





const main= async ()=>{

    let opt
    const busqueda= new Busqueda()


    do {

        opt=await inquirerMenu()

        switch(opt) {
            case 1:         
                const lugar=await leerInput('ciudad:')
                const lugares= await busqueda.ciudad(lugar)
                const id=await listaCiudad(lugares)
                if(id==='0') continue
                const ciudadSelec= lugares.find(l=>l.id===id)
                busqueda.agregarHistorial(ciudadSelec.ciudad)
                busqueda.guardarHistorial()
                const clima=await busqueda.clima(ciudadSelec.lat,ciudadSelec.lng)
                
            

                console.log('\n Informacion de la ciudad \n')
                console.log(' Ciudad: '.green , ciudadSelec.ciudad.yellow)
                console.log(' Lat: '.green, ciudadSelec.lat)
                console.log(' Lng: '.green, ciudadSelec.lng)
                console.log(' Temperatura: '.green, clima.temp)
                console.log(' Max: '.green, clima.max)
                console.log(' Min: '.green, clima.min)
                console.log(' Descripcion: '.green, clima.desc)
            break
            case 2:

                busqueda.historialCapitalizado.forEach((ciudad,i)=>{
                    const index=`${i+1}.`.green
                    console.log(`\n ${index} - ${ciudad}` )

                })

            break

        }
        if (opt!==0 ) await pause()
    }

    while (opt!==0)

     

    // const texto= await leerInput(`hola: `);
    // console.log(texto)
    

}

 main()


