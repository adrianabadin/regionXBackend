import { Request } from "express";
import { DoneCallback } from "passport";
import { VerifyFunctionWithRequest } from "passport-local";
import { logger } from "../Global.Services/logger";
import { AuthService, prismaClient } from "./auth.service";
import { SignUpType } from "./auth.schema";
import argon from "argon2"

export class AuthVerifyModule {
    protected service=new AuthService()
    protected prisma = prismaClient
    constructor(){
        this.signUpVerify=this.signUpVerify.bind(this)
        this.loginVerify=this.loginVerify.bind(this)
    }
    async signUpVerify(req:Request<any,any,SignUpType>,username:string,_password:string,done:any){
        try{
            let user = await this.prisma.user.findUnique({where:{username}})
            console.log(user,"debe ser undefined")
            if (user !== null){
                throw new Error("username already exists")
            }
            const response = await this.service.SignUpUser(req.body)
            if (response !==undefined) done(null,response)
            else throw new Error ("Error creating user on database")

        }catch(error){logger.error({function:"AuthVerifyModule.signUpVerify",error}
        
        )
        done(error,false)
    }
    }
    async loginVerify(username:string,password:string,done:(...args:any)=>any){
        try{
            const user = await this.prisma.user.findUnique({where:{username}})
            console.log(user)
            if (user !==null) // si el usuario existe
            {
                if (user?.hash !==undefined && await argon.verify(user.hash,password))
                {
                    done(null,user)
                }else throw new Error("Password is incorrect")
            }else throw new Error("User doesnt exists")
        }
        catch(error){
            logger.error({function:"AuthVerifyModule.loginVerify",error})
            done(error,false)
    }
    }
}