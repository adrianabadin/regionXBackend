import { Request, Response } from "express";
import { AuthService, prismaClient } from "./auth.service";
import { SignUpType } from "./auth.schema";
import { logger } from "../Global.Services/logger";
import { PrismaClient } from "@prisma/client";
import { DoneCallback } from "passport";
//NO SIRVE
export class AuthController{
    protected service = new AuthService()
    constructor(protected prisma:PrismaClient=prismaClient){}
   async SignUp(req:Request<any,any,SignUpType>,res:Response){
        try{
            const response = await this.service.SignUpUser(req.body)
            res.status(200).send(response)
        }catch(error){
            logger.error({function:"AuthController.SignUp",error})
            res.status(400).send(error)
        }
    }
     serialize = (user: any, done: DoneCallback) => {
        done(null, user.id)
      }
       deSerialize = async (userId: string, done: DoneCallback) => {
        try{
        const response = await this.prisma.user.findUnique({where:{id:userId}}) 
            if (response !==null){
            return done(null, response)}
          }
          catch(error){
            logger.error({ function: 'AuthService.deSerialize', error })
          }
      }

}