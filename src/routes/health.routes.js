import express from 'express'
import pkg from '../../package.json'
import moment from 'moment'

const router = express.Router()
const initialDate = Date.now()
router.get("/", (req, res) => {
  let body = {
    name: pkg.name,
    version: pkg.version,
    date: new Date(initialDate),
    ago: moment(initialDate).fromNow(),
    uptime: (Date.now() - initialDate) / 1000,
    environment: process.env.NODE_ENV || "!NODE_ENV",
    build: process.env.BUILD_NUMBER || "development"
  }
  return res.send(body)
})

export default router
