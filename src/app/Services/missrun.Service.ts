import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';

@Injectable()
export class MissRunService{
    private _options: RequestOptions = null;
    
    constructor(private http:HttpClient) { }
    
    // Get MissRun Details
    public async getMissRunDetails(startDate: string, endDate: string){
        // HttpOptions
        let httpHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json');  
        
        let options = {
            headers: httpHeaders
        }; 

        // Http Post Body
        const body = {
            "startDateTime" : startDate,
            "endDateTime" : endDate
        };

        console.log(body);
        
        return this.http.post<any[]>("http://vmprocessmonitoringservice.azurewebsites.net/BPMissRun/GetBPMissRun", body, options)
            .toPromise();
    }
}

class MissRunEntry{

}