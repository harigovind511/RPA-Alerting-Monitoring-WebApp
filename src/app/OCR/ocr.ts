import { Component, OnInit } from '@angular/core';
import { BuTabsModule } from 'angular2-bulma';

// For Azure Blob Uploads
import { from, Observable } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import { ISasToken } from '../Services/azure-storage/azureStorage';
import { BlobStorageService } from '../Services/azure-storage/blob-storage.service';

// To Create ZIP
import * as JSZip from 'jszip';

// For Zip File Save
import { saveAs } from 'node_modules/file-saver';

interface IUploadProgress {
    filename: string;
    progress: number;
}

@Component({
    providers: [  ],
    selector: 'ocr',
    templateUrl: 'ocr.html'
})

export class OCRComponent implements OnInit {
    // Azure Storage Blob Variables
    uploadProgress$: Observable<IUploadProgress[]>;
    filesSelected = false;
    isResultGenerated = false;
    filesUploadSuccessfull = false;

    // Current Image Base64 string from the selected Images
    currentbase64textString = "";

    // JSZip Instance
    zip = new JSZip();

    constructor(private blobStorage: BlobStorageService) {
       
    }

    ngOnInit() {
        
    }

    // Method to Generate GUID
    NewGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    filesCount = 0;

    // Azure Storage Helper Methods
    onFileChange(event: any): void {
        this.filesSelected = true;
        this.filesUploadSuccessfull = false;
    
        this.filesCount = event.target.files.length;

        for(var item in event.target.files){
            var file = event.target.files[item];
            
            if(file != null && file != undefined && file != NaN){
                // Reading File as Base64
                var reader = new FileReader();
                reader.onload = this._handleReaderLoaded.bind(this, file.name, file.type);
                try{
                    reader.readAsDataURL(new Blob([file], { type: file.type }));
                }
                catch(ex){
                    console.log(ex);
                }

            }
        }

        
    }

    addFileToZip(fileName: string, imageData: any){
        // Generating Zip File
        this.zip.file(fileName, imageData);
    }

    dataURItoBlob(dataURI) {
        // Convert Base64 to raw binary data held in a string.
    
        var byteString = atob(dataURI.split(',')[1]);
    
        // Separate the MIME component.
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    
        // Write the bytes of the string to an ArrayBuffer.
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        // Write the ArrayBuffer to a BLOB and you're done.
        var bb = new Blob([ab]);
    
        return bb;
    }

    processedFilesCount = 0;
    _handleReaderLoaded(fileName, fileType, readerEvt) {
        if(fileName != "item" && fileName != undefined){
            this.addFileToZip(fileName, this.dataURItoBlob(readerEvt.target.result));
            this.processedFilesCount++;

            if(this.processedFilesCount == this.filesCount){
                // Removing Item & Undefined File from Zip
                this.zip.remove("item");
                this.zip.remove("undefined");

                var guid = this.NewGuid();
                var blob;
                this.zip.generateAsync(
                    { type:'blob' }
                    ).then((content) => {
                        //saveAs(content, "test.zip");
                        blob = content;
                        var file = new File([blob], guid + "-Input.zip")
                        var filesTemp = new Array();
                        filesTemp.push(file);
                        
                        this.uploadProgress$ = from(filesTemp).pipe(
                        map(file => this.UploadFile(file)),
                        combineAll()
                        );

                        this.uploadProgress$.toPromise().then(res => {
                        
                        });
                });   
            }
        }
    }
    
    UploadFile(file: File): Observable<IUploadProgress> {
    const accessToken: ISasToken = {
        container: 'experiencezone',
        filename: file.name,
        storageAccessToken:
        '?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-05-31T18:01:41Z&st=2019-05-18T10:01:41Z&spr=https,http&sig=ppRci%2F6rZFIaxiD4ldB3fLpbFvCCUfnK45elncmQIeA%3D',
        storageUri: 'https://afblobstorage.blob.core.windows.net/?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-05-31T18:01:41Z&st=2019-05-18T10:01:41Z&spr=https,http&sig=ppRci%2F6rZFIaxiD4ldB3fLpbFvCCUfnK45elncmQIeA%3D'
    };

    return this.blobStorage
        .uploadToBlobStorage(accessToken, file)
        .pipe(map(progress => this.mapProgress(file, progress)));
    }

    private mapProgress(file: File, progress: number): IUploadProgress {
        if(progress == 100){
            this.filesSelected = false;
            this.filesUploadSuccessfull = true;
        }

        return {
            filename: file.name,
            progress: progress
        };
    }
}