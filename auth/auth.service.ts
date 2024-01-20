import { Prisma, PrismaClient } from "@prisma/client";
import { SignUpSchema, SignUpType } from "./auth.schema";
import { logger } from "../Global.Services/logger";
import argon2 from "argon2";
import { z } from "zod";
export const prismaClient = new PrismaClient()
export class AuthService{
protected prisma=prismaClient
    constructor(){
    this.SignUpUser=this.SignUpUser.bind(this)
    
}
async SignUpUser (data:SignUpType){
    try{
        const parsedSchema = SignUpSchema.shape.body
        
    const result =parsedSchema.safeParse(data)
    if (!result.success) throw new Error("Los datos enviados no validan SignUpType")
    
    const hash=await argon2.hash(data.password)
     const dataWithHash:Prisma.UserCreateInput ={
        hash,lastname:data.lastname,name:data.name,username:data.username
    }
    const response =await this.prisma.user.create({data:dataWithHash})
    console.log(response)
    return response
    }catch(error){logger.error({function:"AuthService.SignUpUser",error})

}
}
}