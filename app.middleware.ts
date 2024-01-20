import express from 'express';
import { AuthController } from './auth/auth.controller';
import cors from "cors"
import {z}from "zod"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { PrismaSessionStore } from "@quixo3/prisma-session-store/dist/lib/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import Session from "express-session"
import passport from "passport"
import  authRoutes  from './auth/auth.routes';
import "./auth/local.strategy"
const authController=new AuthController()
const app= express()
const envSchema=z.object({
    DATABASE_URL:z.string().url({message:"Debes proveer un url de la base de datos"}),
ENVIROMENT:z.enum(["DEV","PRODUCTION"],{invalid_type_error:"ENVIROMENT debe ser DEV o PRODUCTION"}),
LOGS:z.string().min(1,{message:"Debes proveer la ruta de los logs"}),
PORT:z.string().refine(value=>{
    const parsedNumber= parseInt(value)
    if (isNaN(parsedNumber)) return false
    else return true 
},{message:"PORT debe ser un string de numero"})
})
declare global{
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema>
        {}
    }
}

app.use(express.json())
app.use(morgan('dev'))
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  preflightContinue: true
}))
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()) // "Whether 'tis nobler in the mind to suffer"

const store = new PrismaSessionStore(new PrismaClient(), {
  checkPeriod: 2 * 60 * 1000, // ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
  ttl: 60 * 60 * 1000
})
const sessionMiddleware = Session({
  store,
  resave: true,
  saveUninitialized: true,
  cookie: { sameSite: 'none', secure: true, httpOnly: true ,maxAge:60*60*1000},
  secret: 'Dilated flakes of fire fall, like snow in the Alps when there is no wind'

})

app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())
export default app
passport.serializeUser(authController.serialize)
passport.deserializeUser(authController.deSerialize)
app.use("/auth",authRoutes)
//routeHandler(app)