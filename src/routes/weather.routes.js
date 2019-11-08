import express from "express"
const router = express.Router()
import weatherController from "../controllers/weather.controller"

router.get("/getWeather", (req, res) => {
  return weatherController.getWeather(req, res)
})


export default router
