import WeatherException from "../exceptions/weather.exception"
import { EventEmitter } from "events"
import chalk from "chalk";
import http from 'http'
import axios from "axios"
import redis from "redis"

class Weather extends EventEmitter {
  constructor() {
    super()
    this._logger = chalk;
    this._started = false
    this._timer = null
    this._agentId = null
    this._socket = null
    this._client = redis.createClient(6379)
    console.log(`${this._logger.green('[ Weather Socket Server ] ')} constructor`)
  }
  
  async getData(list) {
    return Promise.all(list.map(item => this.checkLatitudeData(item.coord)))
  }

  async getWeather(req, res) {
      console.log(`${this._logger.red("[ getWeather controller ]")} ->`)
      try {
        const dataRedisKey = 'latitude:coord:'
        this._client.get(dataRedisKey,async (err, data) => {
             let response = await this.getData(JSON.parse(data))
             response = response.map((i) => {
              // return { "time" : i.time , "temperature" : i.temperature, "timezone": i.timezone }
               return { "time" : i.currently.time , "temperature" : i.currently.temperature, "timezone": i.timezone }
             })
             res.send(response)
      })}
      catch(e) {
        console.log(`${this._logger.red('[ Disconnect ] ')} result: ${e}`)
        return res.status(500).send(e)
      }
  }

  async getWeatherBySocket() {
    console.log(`${this._logger.green("[ getWeatherBySocket controller ]")}`)
    try {
      console.log(Math.random(0, 1))
     if (Math.random(0, 1) < 0.1) throw new Error('9999')
     const dataRedisKey = 'latitude:coord:'
     this._client.get(dataRedisKey, async (err, data) => {
           let response = await this.getData(JSON.parse(data))
           response = response.map((i) => {
            //return { "time" : i.time , "temperature" : i.temperature, "timezone": i.timezone }
            return { "time" : i.currently.time , "temperature" : i.currently.temperature, "timezone": i.timezone }
           })
           this.emit('messagecb',JSON.stringify(response))
           return false
      })
    }
    catch(e) {
      console.log(`${this._logger.red('[ Disconnect ] ')} result: ${e}`)
      if(e === "Error: 9999") {
       await this.saveRedis(e);
      }
      return {}
    }
}
async checkLatitudeData(latitude) {
   console.log(`${this._logger.green('[ Init checkLatitudeData ] ')} latitude: ${latitude}`)
    const options = {
      method: "GET",
      url: `https://api.darksky.net/forecast/388618f7e4a94de1cc1058ef30f6e167/${latitude}`
    }
    try {
      return await this.callRest(options)    
    }
    catch(e) {
      console.log(`${this._logger.red('[ Error checkLatitudeData ] ')} -> : ${e}`)
      return { "time" : "i.currently.time" , "temperature" : "i.currently.temperature", "timezone":" i.timezone" }
      
    }
}

async saveRedis(message) {
  const dataRedisKey = 'api.errors'
  client.setex(dataRedisKey, 3600, JSON.stringify(message))
}
async callRest(options) {
    return await new Promise((resolve, reject) => {
      options.httpAgent = new http.Agent({
        rejectUnauthorized: false
      })
      axios(options)
        .then(response => {
          let respuesta = response.data;
          if (respuesta.Error == null) {
          //  console.log(`${this._logger.green('[ callRest ] ')} result: ${JSON.stringify(respuesta)}`)
            return resolve(respuesta)
          } else {
            console.log(`${this._logger.red('[ callRest ] ')} result: 400`)
            return reject(new Error("400"))
          }
        })
        .catch(error => {
          console.log( error.response.status === 401 ? `${this._logger.green('[ callRest ] ')} result: ${error.response.data}` : `${this._logger.red('[ Error ] ')} result-: ${error.response.status}`)
          return  error.response.status === 401 ? resolve( { code: error.response.status, message: error.response.data } ) : reject(new Error("500"))
        })
  })
}
}

const weatherController = new Weather()
export default weatherController


