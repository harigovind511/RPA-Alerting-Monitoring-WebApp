import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {WebcamModule} from 'ngx-webcam';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { Observable } from 'rxjs-compat';

// Vision Service Import
import { VisionService } from '../Services/vision.Service';

interface IUploadProgress {
    filename: string;
    progress: number;
}

@Component({
    providers: [  ],
    selector: 'vision',
    templateUrl: 'vision.html'
})

export class VisionComponent implements OnInit {
    isProductRecommendationActive = false;
    isTruckNumberPlateDetectionRunning = false;
    numberPlate;
    processingTime;
    currentImageBase64;
    currentProductRecommendationImageBase64;
    gender;
    age;
    currentAction;
    products = [
        {
            name: 'Google',
            link: "Http://www.google.com"
        },
        {
            name: 'Bing',
            link: "Http://www.bing.com"
        }
    ];
    constructor(private visionService:VisionService) {
    }
    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
    };
    public errors: WebcamInitError[] = [];

    // latest snapshot
    public webcamImage: WebcamImage = null;

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

    public ngOnInit(): void {
        WebcamUtil.getAvailableVideoInputs()
            .then((mediaDevices: MediaDeviceInfo[]) => {
            this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
            });
    }

    public triggerSnapshot(): void {     
        this.currentAction = "TruckLicensePlateDetection";   
        this.trigger.next();
    }

    public triggerSnapshotProductRecommendation(): void {   
        this.currentAction = "ProductRecommendation";     
        this.trigger.next();
    }

    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
    }

    public showNextWebcam(directionOrDeviceId: boolean|string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
    }

    public async handleImage(webcamImage: WebcamImage) {
        this.webcamImage = webcamImage;

        if(this.currentAction == "TruckLicensePlateDetection"){
            this.isTruckNumberPlateDetectionRunning = true;

            this.currentImageBase64 = "data:image/png;base64," + webcamImage.imageAsBase64;
            await this.visionService.getTruckEntry(webcamImage.imageAsBase64)
                    .then(res => {
                        this.numberPlate = res['License Plate Number'];
                        this.processingTime = res['Processing time'];

                        this.isTruckNumberPlateDetectionRunning = false;
                    });
        }
        else{
            this.isProductRecommendationActive = true;

            this.currentProductRecommendationImageBase64 = "data:image/png;base64," + webcamImage.imageAsBase64;
            await this.visionService.getProductRecommendation(webcamImage.imageAsBase64)
                    .then(res => {
                        this.numberPlate = res['License Plate Number'];
                        this.processingTime = res['Processing time'];

                        this.isProductRecommendationActive = false;
                    });
        }

        
    }

    public cameraWasSwitched(deviceId: string): void {
        console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public get nextWebcamObservable(): Observable<boolean|string> {
        return this.nextWebcam.asObservable();
    }

    // Model Open/Close Button Action
    isProductionRecommendationModelClicked(){
        this.toggleWebcam();

        this.isProductRecommendationActive = this.isProductRecommendationActive == true? false : true;
    }

    // Method to make API call to get Product Recommendation Data
    public async getProductRecommendation(imageData: string){
        await this.visionService
            .getProductRecommendation(imageData)
            .then(res => {
                console.log(res);
            });
    }

    // Method to make API call to get Truck Number Plate Data
    public async getTruckEntry(imageData: string){
        await this.visionService
            .getTruckEntry(imageData)
            .then(res => {
                console.log(res);
            });
    }
}