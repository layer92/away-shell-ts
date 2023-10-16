import { OnException } from "away-core/OnException";
import { FilePathBox } from "away-file-system/FilePathBox";
import { LocalFileSystem } from "away-file-system/LocalFileSystem";
import { Strings } from "away-strings/Strings";
import { ShellService } from "./ShellService";
import { MakeSafeSingleQuoteStringForShell } from "./ShellUtilities";

export class Sha256SumMaker{

    constructor(private _needs:{
        fileSystem:LocalFileSystem,
        shellService:ShellService,
    }){}

    async makeSumFromFileAsync({
        filePathBox,
        onFileDoesNotExist
    }:{
        filePathBox:FilePathBox,
        onFileDoesNotExist:OnException
    }){
        const {fileSystem,shellService} = this._needs;
        fileSystem.expectFileExistsSync(filePathBox,onFileDoesNotExist);

        let tempSumFilePathBox = new FilePathBox(
            `temp__sha256sum__${filePathBox.getData()}.temp`.split("/").join("_"),
            ()=>{}
        );
        while(fileSystem.pathExistsSync(tempSumFilePathBox)){
            tempSumFilePathBox = tempSumFilePathBox.append( Strings.MakeRandom(1), ()=>{} );
        }
        
        const filePathForShell = MakeSafeSingleQuoteStringForShell(filePathBox.getData());
        const tempSumFilePathForShell = MakeSafeSingleQuoteStringForShell(tempSumFilePathBox.getData());
        await shellService.runScriptAsync(
            `sha256sum ${filePathForShell} | awk '{print $1}' >> ${tempSumFilePathForShell},
            "YES"
        );

        fileSystem.expectFileExistsSync(tempSumFilePathBox,()=>{});

        const sha256sumFileText = fileSystem.readStringSync({
            filePathBox:tempSumFilePathBox,
            options:{encoding:"utf-8"}
        });
        const sha256sum = sha256sumFileText.split("\n").join("");
        
        fileSystem.deleteFileSync({filePathBox:tempSumFilePathBox,areYouSure:"YES",onFileDoesNotExist:()=>{}});

        return sha256sum;
    }

    async makeSumsFromFilesAsync({
        filePaths,
        onFileDoesNotExist,
    }: {
        filePaths: FilePathBox[];
        onFileDoesNotExist:OnException;
    }){
        const sums = [];
        for(const filePathBox of filePaths){
            const sum = await this.makeSumFromFileAsync({filePathBox,onFileDoesNotExist});
            sums.push(sum);
        }
        return sums;
    }
    
}