import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';

@Injectable()
export class VisionService{
    private _options: RequestOptions = null;
    
    constructor(private http:HttpClient) { }

    // Get Product Recommendation
    public async getProductRecommendation(inputImage: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json');
        
        let options = {
            headers: httpHeaders
        }; 

        // Http Post Body
        const body = {
            'name': inputImage
        };
        
        return this.http.post("https://prod-72.westeurope.logic.azure.com:443/workflows/203b20d6b5d14fadbb09098b70bb8b57/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=JdxTYDw0O6eCu6QzPnVNzu_iKT2bYtwl0XTHJDAk-A0", body, options)
            .toPromise();
    }

    // Get Truck Entry
    public async getTruckEntry(inputImage: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('x-api-key', 'CCnw1yLMru1LO54bTo9dB9fvtINBEL9CbcHJU1bf');
        
        let options = {
            headers: httpHeaders
        }; 

        // Http Post Body
        const body = {
            'image': inputImage
        };
        
        return this.http.post<NumberPlateDetection>("https://prod-60.westeurope.logic.azure.com:443/workflows/a20f8a0abd7747a99ec30ca5403e05c2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WD8HusrCLReraEyPwh9JPZ--DyISnwqQPpeQX-GuFmM", body, options)
            .toPromise();
    }
}

class NumberPlateDetection{
    NumberPlate: string;
    ProcessingTime: string;
}