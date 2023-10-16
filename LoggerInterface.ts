
/* Often used as an argument to something that might want to log output. */
export interface LoggerInterface{
    log:((message:string)=>any),
    warn:((message:string)=>any),
    error:((message:string)=>any),
}