import { NextFunction, Request,Response } from "express";

// FUNCTION WRAPPER TO CATCH ASYNC ERRORS
export default  (func:any) =>(req:Request,res:Response,next:NextFunction) => 
    Promise.resolve(func(req,res,next)).catch(next)
