import { Component, OnInit } from '@angular/core';
import { BuTabsModule } from 'angular2-bulma';

// For Azure Blob Uploads
import { from, Observable } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import { ISasToken } from '../Services/azure-storage/azureStorage';
import { BlobStorageService } from '../Services/azure-storage/blob-storage.service';

// Service Imports
import { MLService } from '../Services/ml.Service';
import { startTimeRange } from '@angular/core/src/profile/wtf_impl';

interface IUploadProgress {
    filename: string;
    progress: number;
}

@Component({
    providers: [  ],
    selector: 'ml',
    templateUrl: 'ml.html'
})

export class MLComponent implements OnInit {
    // Azure Storage Blob Variables
    uploadProgress$: Observable<IUploadProgress[]>;
    filesSelected = false;
    filesUploadSuccessfull = false;
    isResultGenerated = false;
    currentFileName = "";
    anomolyDetectionResultFileUrl;

    constructor(private mlService:MLService, private blobStorage: BlobStorageService) {
        
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
    
        this.uploadProgress$ = from(event.target.files as FileList).pipe(
          map(file => this.uploadFile(file)),
          combineAll()
        );

        this.uploadProgress$.toPromise().then(res => {
            
        });
      }
    
    uploadFile(file: File): Observable<IUploadProgress> {
    const accessToken: ISasToken = {
        container: 'anomalywebinput',
        filename: file.name,
        storageAccessToken:
        '?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-05-24T20:48:53Z&st=2019-05-24T12:48:53Z&spr=https,http&sig=KPumVMiDvUSYJFmV9bUOjqB9VnNpSJbpAOXF0m6kbIA%3D',
        storageUri: 'https://anomlaywebstore.blob.core.windows.net/?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-05-30T20:53:57Z&st=2019-05-24T12:53:57Z&spr=https,http&sig=Kei9o4ZI137UwRxKLE4m7%2BqFbhLeMITSLmZhdRFmxn0%3D'
    };

    return this.blobStorage
        .uploadToBlobStorage(accessToken, file)
        .pipe(map(progress => this.mapProgress(file, progress)));
    }

    // For Timer Code
    // To check if file is generated
    timeLeft: number = 60;
    interval;

    // Method to stop timer
    pauseTimer() {
        clearInterval(this.interval);
    }

    // Method to start timer
    startTimer() {
        this.interval = setInterval(() => {
            this.mlService.getAnomolyDetectionResult(this.currentFileName)
                .then(res => {
                    if(res == 404)
                        console.log("File Not Found.");
                    else{
                        this.isResultGenerated = true;
                        this.filesUploadSuccessfull = false;

                        this.anomolyDetectionResultFileUrl = "https://afblobstorage.blob.core.windows.net/experiencezone/" + this.currentFileName;

                        this.pauseTimer();
                    }
                });
        },10000)
    }

    private mapProgress(file: File, progress: number): IUploadProgress {
        if(progress == 100){
            this.filesSelected = false;
            this.filesUploadSuccessfull = true;

            this.currentFileName = file.name;
            
            this.pauseTimer();
            this.startTimer();
        }

        return {
            filename: file.name,
            progress: progress
        };
    }
}