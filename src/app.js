import express from "express"
import { health, weather } from "./routes"
import redis from "redis"

// create and connect redis client to local instance.
const client = redis.createClient(6379)
 
// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
})
 // key to store results in Redis store
 const dataRedisKey = 'latitude:coord:'

 client.get(dataRedisKey, (err, data) => {
    // If that key exists in Redis store
    if (data) {
            console.log({ source: 'cache', data: JSON.parse(data) })
    } else { 
       // Initial data load
        let latitudeData = [
          { 
            name: "Santiago (CL)",
            coord: "-33.4489, -70.6693"
          },
          {
            name: "Zurich (CH)",
            coord: "47.36667, 8.55"
          },
          {
            name: "Auckland (NZ)",
            coord: "-36.86667, 174.76667"
          },  
          {
            name: "Sydney (AU)",
            coord: "-33.86785, 151.20732"
          },
          {
            name: "Londres (UK),",
            coord: "51.509865, -0.118092"
          },
          {
            name: "Georgia, USA",
            coord: "33.247875, -83.441162"
          }
        ]
        
        client.setex(dataRedisKey, 3600, JSON.stringify(latitudeData))      
    }
})

 
const app = express()
app.use(express.json())

// Log each request to the console
app.use(async (req, res, next) => {
  // if (new Math.rand(0, 1) < 0.1) throw new Error('How unfortunate! The API Request Failed')
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${req.method} ${req.url} - ${ms}`)
})

// Cors
// app.use(async (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   )
//   next()
// })

// Log percolated errors to the console
app.on("error", err => {
  console.error("Server Error", err)
});

// Routes Path
app.use("/health", health);
app.get("/seidor", (req, res) => {
  return res
    .status(200)
    .send({ message: "Seidor endpoint is working" });
})

app.use("/weather", weather)
// Reset data load in redis
app.use("/resetdataredis", (req, res) => {
  client.del(dataRedisKey,async (err, response) => {
  if (response == 1) {
     console.log("Deleted Successfully!") 
     res.status(200).send({ message: "Deleted Successfully" })
  } else{
   console.log("Cannot delete")
   res.status(500).send({ message: "Cannot delete" })
  }})
})
export default app
