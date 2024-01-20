import { NextFunction, Request, Response } from "express"
import {AnyZodObject, z} from "zod"

export function validateSchemaMiddleware(schema:AnyZodObject) {
    return (req:Request,res:Response,next:NextFunction)=>{
        const response = schema.safeParse(req)
        if (response.success) next()        
        else {
    let errors:{field:string,message:string,complete:string}[]=[]
    response.error.issues.forEach(error=>{
        errors.push({field:error.path[0] as string,message:error.message,complete:`El campo ${error.path[0]} ${error.message}`})

    })
    res.status(400).send(errors)
    return
        }
    
        }
}
/**
 * SCHEMAS
 */
export const SignUpSchema = z.object({
   body:z.object({
    username:z.string().email({message:"Debes proveer un email valido"}),
    password:z.string().min(6,{message:"La contraseña debe contener al menos 6 caracteres"}),
    name:z.string().min(3,{message:"El nombre debe contener al menos 3 caracteres"}),
    lastname:z.string().min(3,{message:"El apellido debe contener al menos 3 caracteres"}),

   })
})

export const LoginSchema = z.object({
    body:z.object({
        username:z.string().email({message:"debes proveer un email valido"}),
        password:z.string().min(6,{message:"La contraseña debe contener al menos 6 caracteres"})
        
    })
})



/**
 * TYPES
 */

export type SignUpType = z.infer<typeof SignUpSchema>["body"]
export type LoginType=z.infer<typeof LoginSchema>["body"]