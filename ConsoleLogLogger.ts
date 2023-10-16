import { LoggerInterface } from "./LoggerInterface";

export class ConsoleLogger implements LoggerInterface{
    log(message: any){
        console.log(message);
    }
    warn(message: any){
        console.warn(message);
    }
    error(message: any){
        console.error(message);
    }
}