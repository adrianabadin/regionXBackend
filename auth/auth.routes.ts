import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import passport from "passport";
import { LoginSchema, SignUpSchema, validateSchemaMiddleware } from "./auth.schema";
export const authRoutes=Router()
const authController= new AuthController();
authRoutes.post("/signup",validateSchemaMiddleware(SignUpSchema),passport.authenticate("register",{failureRedirect:"/login"}),(req:Request,res:Response)=>{console.log(req.user);res.status(200).send(req.user)})
authRoutes.post("/login",validateSchemaMiddleware(LoginSchema),passport.authenticate("login",{failureRedirect:"/login"}),(req:Request,res:Response)=>{console.log(req.user);res.status(200).send(req.user)})
authRoutes.post("/logout",(req:Request,res:Response,next:NextFunction)=>{
    req.logout((error)=>{if (error) next(error)
        res.status(200).send("Loged out")})
    })
    
export default authRoutes
//(req:Request,res:Response,next:NextFunction)=>{res.status(200).send(req.body)},