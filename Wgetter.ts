import { UrlBox } from "away-web/UrlBox";
import { ShellService } from "./ShellService";
import { FilePathBox } from "away-file-system/FilePathBox";
import { LocalFileSystem } from "away-file-system/LocalFileSystem";
import { OnException } from "away-core/OnException";

export class Wgetter{
    constructor(private _needs:{
        shellService:ShellService,
        fileSystem:LocalFileSystem,
    }){}
    /**
     * 
     * If wget downloads an empty file, this usually indicates that the request failed.
     * 
     * TODO: get the exit code from wget
     * 
     * If you don't allow empty file downloads, if an empty file was downloaded, the onDownloadedEmptyFileException is called, and then an error is thrown.
     */
    async wgetAsync({ urlBox, destinationFilePathBox, allowEmptyFileDownload, onDownloadedEmptyFileException }: { urlBox: UrlBox; destinationFilePathBox: FilePathBox; allowEmptyFileDownload?:boolean; onDownloadedEmptyFileException?: OnException; }){
        await this._needs.shellService.runSingleCommandAsync("wget",[urlBox.getData(),"-O",destinationFilePathBox.getData()]);
        if( !allowEmptyFileDownload && this._needs.fileSystem.isEmptyFileSync(destinationFilePathBox) ){
            onDownloadedEmptyFileException?.();
            throw new Error(`Downloaded empty file from: ${urlBox.getData()} to: ${destinationFilePathBox.getData()}. This usually indicates that the request failed.`);
        }
    }

}