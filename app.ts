import express from "express"
import dotenv from "dotenv"
import app from "./app.middleware"
import { logger } from "./Global.Services/logger"
dotenv.config()
const port = process.env.PORT ||8080

export const server =app.listen(port,()=>{logger.info({message:`Listening on port ${port}`}) })
