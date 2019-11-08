

import weatherController from '../controllers/weather.controller'

const socketServerConfig = (io) => {
/********************************/
/* Socket                       */
//********************************/
io.on('connection', (socket) => {
    console.log('a user connected, id ' + socket.id);

    socket.once('disconnect', () => {
      console.log('user disconnected')
    })
    
    socket.on('new-message', (msg) => {
      console.log(`Mensaje: ${msg}`)
      io.emit('new-message', msg)
      if (msg === "server") io.emit('new-message', 'Shuutt!! Server habla')
    })
    socket.on('getWeather', async ({ message }) => {
         console.log('called getWeather')
         try {
          await weatherController.getWeatherBySocket()
         }
         catch (e) {
           console.log(`Error: ${e}`)
           io.emit('disconect', "error")
         }
    })
    weatherController.on('messagecb', async (msg) => {
      console.log(`Menssage: ${msg}`)
      io.emit('weather', msg)
     })

})
}

const handler = (payload) => {
  console.log(`weatherController: ${payload}`)
}

export default socketServerConfig 
