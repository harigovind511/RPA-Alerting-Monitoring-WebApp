import { Component, OnInit } from '@angular/core';
import { BuTabsModule } from 'angular2-bulma';
import { NLPService } from '../Services/nlp.Service';
import { DomSanitizer } from '@angular/platform-browser';

// For Azure Blob Uploads
import { from, Observable } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import { ISasToken } from '../Services/azure-storage/azureStorage';
import { BlobStorageService } from '../Services/azure-storage/blob-storage.service';

interface IUploadProgress {
    filename: string;
    progress: number;
}

@Component({
    providers: [ NLPService ],
    selector: 'nlp',
    templateUrl: 'nlp.html'
})

export class NLPComponent implements OnInit {
    // Sentiment Analysis
    public inputSentimentAnalysis: string;
    public sentimentAnalysisScore: string;
    public sentimentAnalysisLanguage: string;

    // Entity Recognition
    public entityRecogniztionLanguage: string;
    public inputEntityRecogniztion: string;
    public inputEntityResult: string;
    
    // Azure Storage Blob Variables
    uploadProgress$: Observable<IUploadProgress[]>;
    filesSelected = false;
    filesUploadSuccessfull = false;
    isWordCloudGenerated = false;
    isTextSummarizationGenerated = false;

    // Azure Converted File Path
    public filePath: string;

    // Summarized Text <P> Data Variable
    public textSummary:string;

    // Topic Modeling Word Cloud
    public wordCloudBase64;

    constructor(private sanitizer: DomSanitizer, private blobStorage: BlobStorageService, private nlpService: NLPService) {
       
     }

    ngOnInit() {
        
    }

    // Azure Storage Helper Methods
    onFileChange(event: any): void {
        this.filesSelected = true;
        this.isWordCloudGenerated = true;
        this.isTextSummarizationGenerated = true;
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
        container: 'ner',
        filename: file.name,
        storageAccessToken:
        '?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-05-30T21:52:10Z&st=2019-05-21T13:52:10Z&spr=https&sig=NMs4xfMfkE4MhuirZ32dabLCMQ%2FOauLJqh3%2Br0jdzyc%3D',
        storageUri: 'https://nlpcapabilities.blob.core.windows.net/?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-05-30T21:52:10Z&st=2019-05-21T13:52:10Z&spr=https&sig=NMs4xfMfkE4MhuirZ32dabLCMQ%2FOauLJqh3%2Br0jdzyc%3D'
    };

    return this.blobStorage
        .uploadToBlobStorage(accessToken, file)
        .pipe(map(progress => this.mapProgress(file, progress)));
    }

    private mapProgress(file: File, progress: number): IUploadProgress {
        if(progress == 100){
            this.filesSelected = false;
            this.filesUploadSuccessfull = true;
            this.isWordCloudGenerated = true;

            this.getConvertedFilePath(file.name);
        }

        return {
            filename: file.name,
            progress: progress
        };
    }

    public async getConvertedFilePath(fileName: string){
        await this.nlpService
            .convertionUpload(fileName)
            .then(res => {
                this.filePath = res.outputfilepath;

                console.log(this.filePath);
                this.getSumarizedText(this.filePath);
            });
    }

    public async getSumarizedText(filePath: string){
        await this.nlpService
            .summarizeText(filePath)
            .then(res => {
                this.textSummary = res.Summary;
                this.isTextSummarizationGenerated = false;
                this.getTopicModelingResult(filePath);
            });
    }

    public async getTopicModelingResult(filePath: string){
        await this.nlpService
            .getTopics(filePath)
            .then(res => {
                this.wordCloudBase64 = this.sanitizer.bypassSecurityTrustUrl("data:image/jpg;base64," + res.wordcImage.replace("b'", "").replace("'", ""));

                this.isWordCloudGenerated = false;
            });
    }

    public async onClickSentimentAnalysis(){
        var result;
        await this.nlpService
            .getSentimentAnalysis(this.inputSentimentAnalysis)
            .then(res => {
                result = res;
            });

        this.sentimentAnalysisScore = result.documents[0].score;

        await this.nlpService
            .detectLanguage(this.inputSentimentAnalysis)
            .then(res => {
                result = res;
            });

        this.sentimentAnalysisLanguage = result.documents[0].detectedLanguages[0].name;
    }

    public async onClickEntityRecognition(){
        var result;
        await this.nlpService
            .getEntityRecognition(this.inputEntityRecogniztion)
            .then(res => {
                result = res;
            });

        var resultString = "";
        result.documents[0].entities.forEach(element => {
            console.log(element);
            resultString += "<b>" + element.matches[0].text + "</b>"
        });
        this.inputEntityResult = resultString;//JSON.stringify(result.documents[0].entities);

        await this.nlpService
            .detectLanguage(this.inputEntityRecogniztion)
            .then(res => {
                result = res;
            });

        this.entityRecogniztionLanguage = result.documents[0].detectedLanguages[0].name;
    }
}