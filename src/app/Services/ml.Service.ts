import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class MLService{
    constructor(private http:HttpClient) { }
    
    // Get File from Container
    public async getAnomolyDetectionResult(fileName: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json');  
        
        let options = {
            headers: httpHeaders
        }; 
        
        return this.http.get("https://afblobstorage.blob.core.windows.net/experiencezone/" + fileName, options)
            .toPromise()
            .catch(ex => {
                return ex.status;
            });
    }
}