import {spawn} from "child_process";
import { LocalFileSystem } from "away-file-system/LocalFileSystem";
import { LoggerInterface } from "./LoggerInterface";
import { Expect } from "away-core/Expect";

export class ShellService{
    constructor(private _needs:{
		logger?: LoggerInterface;
		fileSystem: LocalFileSystem;
	}){}
	/**
	 * Only works for one command (can't have multiple lines / use semicolons)
	 * 
	 * As always, be careful when running shell commands.
	 * 
	 * TODO: find a way to nicely return the output
	 */
	runSingleCommandAsync(command:string, argumentsForCommand:string[]){
		return new Promise<void>((accept,reject)=>{
			const childProcess = spawn(command,argumentsForCommand);
			childProcess.stdout.on(
				"data",
				data=>this._needs.logger?.log(data.toString())
			);
			childProcess.stderr.on(
				"data",
				data=>this._needs.logger?.error(data.toString())
			);
			childProcess.on("exit",()=>{
				accept();
			});
		});
	}
	/**
	 * Needs to be an sh (not bash) script. Can be multiple lines / have multiple commands.
	 * 
	 * Avoid using user input in your script when possible.
	 * When necessary, first sanitize the input using the utility function MakeSafeSingleQuoteStringForShell()
	 * Be sure to read all the documentation. Be careful.
	 * 
	 * from child_process.spawn:
	 * DO NOT PASS UNSANITIZED USER INPUT TO THIS FUNCTION. Any input containing shell metacharacters may be used to trigger arbitrary command execution.
	 * 
	 * 
	 * TODO: find a way to nicely return the output
	 */
    runScriptAsync(script:string,areYouSure:"YES"){
		Expect(areYouSure==="YES",`areYouSure!=="YES"`,()=>{});
        return new Promise<void>((accept,reject)=>{
			// the shell:true option allows us to run multiple commands at once
			// however, it comes at the risk of code injection, so don't pass user input into to this function!
			const childProcess = spawn(script,{shell:true});
			childProcess.stdout.on(
				"data",
				data=>this._needs.logger?.log(data.toString())
			);
			childProcess.stderr.on(
				"data",
				data=>this._needs.logger?.error(data.toString())
			);
			childProcess.on("exit",()=>{
				accept();
			});
		});
    }
}