import { Response } from "express"
import { errorHandler } from "../utils/errorHandler"

// ERROR HANDLER MIDDLEWARE TO SEND Different RESPONSE DEPENDING UPON THE DEVELOPMENT MODE
export  default (err:any,__:any,res:Response,_:any) : any=>{
    err.statusCode = err.statusCode || 500
    if(process.env.NODE_ENV==='production'){
        let error = {...err}
        error.message = err.message
        if(err.name==='CastError'){
            const message = `Resource not found. Invalid ${err.path}`
            error = new errorHandler(message,400)
        }
        if(err.name ==='ValidationError'){
            
            const message = Object.values(err.errors).map(value=>(value as any).message)
            error = new errorHandler(message as any,400)
        } 
        if(err.name ==='JsonWebTokenError'){
            
            const message = "Invalid JSON WEB TOKEN.Try Again!!"
            error = new errorHandler(message as any,400)
        } 
        if(err.name ==='TokenExpiredError'){
            
            const message = "Expired JSON WEB TOKEN.Try Again!!"
            error = new errorHandler(message as any,400)
        }
        if(err.code===11000 || (err.message && err.message.includes('duplicate key error collection'))){
            const message = `Duplicated ${Object.keys(err.keyValue)} entered. `
            error = new errorHandler(message,400)
        }
        
        return res.status(error.statusCode).json({success:false,message:error.message||"Internal Server Error."})
    }
}