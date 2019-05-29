import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';

@Injectable()
export class NLPService{
    private _options: RequestOptions = null;
    
    constructor(private http:HttpClient) { }
    
    // Get Sentiment Analysis Result
    public async getSentimentAnalysis(input: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Ocp-Apim-Subscription-Key', '12cd71a3984b45a5b2c98b3895c665ba');  
        
        let options = {
            headers: httpHeaders
        }; 

        // Http Post Body
        const body = {
            'documents': [
                {
                    'id': 1,
                    'text': input
                }
            ]
        };
        
        return this.http.post("https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment", body, options)
            .toPromise();
    }

    // Get Entity Recognition Result
    public async getEntityRecognition(input: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Ocp-Apim-Subscription-Key', '12cd71a3984b45a5b2c98b3895c665ba');  
        
        let options = {
            headers: httpHeaders
        }; 

        // Http Post Body
        const body = {
            'documents': [
                {
                    'id': 1,
                    'text': input
                }
            ]
        };
        
        return this.http.post("https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.1/entities?showStats=1", body, options)
            .toPromise();
    }

    // Get Language Result
    public async detectLanguage(input: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Ocp-Apim-Subscription-Key', '12cd71a3984b45a5b2c98b3895c665ba');  
        
        let options = {
            headers: httpHeaders
        }; 

        // Http Post Body
        const body = {
            'documents': [
                {
                    'id': 1,
                    'text': input
                }
            ]
        };
        
        return this.http.post("https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.1/languages?showStats=1", body, options)
            .toPromise();
    }

    // Get New File Path
    public async convertionUpload(fileName: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json');  
        
        let options = {
            headers: httpHeaders
        }; 
        
        return this.http.get<NLPAPIResponse>("https://ulnlpexperiencezonedev.azurewebsites.net/upload?filename=" + fileName + "&containername=ner", options)
            .toPromise();
    }

    // Get Text Summarization Result
    public async summarizeText(filePath: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json');  
        
        let options = {
            headers: httpHeaders
        }; 
        
        return this.http.get<NLPAPIResponse>("https://ulnlpexperiencezonedev.azurewebsites.net/textsummarizer?filepath=" + filePath, options)
            .toPromise();
    }

    // Get Text Topic Modeling Result
    public async getTopics(filePath: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json');  
        
        let options = {
            headers: httpHeaders
        }; 
        
        return this.http.get<NLPAPIResponse>("https://ulnlpexperiencezonedev.azurewebsites.net/topicGeneration?filepath=" + filePath, options)
            .toPromise();
    }
}

class SentimentAnalysisResponse{
    
}


class NLPAPIResponse{
    public Status: string;
    public outputfilepath: string;
    public Summary: string;
    public wordcImage: string;
}