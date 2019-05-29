import { Component, OnInit, Pipe, PipeTransform, ViewChild  } from '@angular/core';

// For Azure Blob
import { from, Observable } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import { ISasToken } from './Services/azure-storage/azureStorage';
import { BlobStorageService } from './Services/azure-storage/blob-storage.service';

// For HTTP Requests
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';

// For Data Table
import { DataTable, DataTableTranslations, DataTableResource } from 'angular5-data-table';

// Process Data Sample
export const processMock = [
  { name: "Process A", id: "123", description: "This is the process A", isMissRun: false, isFailed: true, isSuccessful: false},
  { name: "Process B", id: "234", description: "This is the process B", isMissRun: false, isFailed: true, isSuccessful: false},
  { name: "Process C", id: "135434", description: "This is the process C", isMissRun: true, isFailed: false, isSuccessful: false},
  { name: "Process D", id: "15454", description: "This is the process D", isMissRun: true, isFailed: false, isSuccessful: false},
  { name: "Process A", id: "123", description: "This is the process A", isMissRun: false, isFailed: true, isSuccessful: false},
  { name: "Process B", id: "234", description: "This is the process B", isMissRun: false, isFailed: true, isSuccessful: false},
  { name: "Process C", id: "135434", description: "This is the process C", isMissRun: true, isFailed: false, isSuccessful: false},
  { name: "Process D", id: "15454", description: "This is the process D", isMissRun: true, isFailed: false, isSuccessful: false},
  { name: "Process E", id: "1233", description: "This is the process E", isMissRun: false, isFailed: false, isSuccessful: true},
]

// Interface to Map File Upload Progress
interface IUploadProgress {
  filename: string;
  progress: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  // For Last Updated Date
  date = Date.now();

  // For Data Table
  processData = new DataTableResource(processMock);
  inBufferProcess = processMock;
  processCount = 0;

  title = 'RPA Monitoring & Alerting';

  // ADD CHART OPTIONS. 
  chartOptions = {
    responsive: true    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
  }

  labels =  ['Yes', 'No'];

  // STATIC DATA FOR THE CHART IN JSON FORMAT.
  chartData = [
    {
      data: [4, 1] 
    }
  ];

  // CHART COLOR.
  colors = [
    { 
      // backgroundColor: [
      //   'rgba(255, 99, 132, 0.2)',
      //   'rgba(54, 162, 235, 0.2)'
      // ]
    }
  ]
  
  // Miss Run Data
  missRunData = [

  ]

  // Failed Run Data
  failedRunData = [

  ]

  // Successfull Run Data
  successfullRunData = [

  ]

  constructor(private blobStorage: BlobStorageService, private http:HttpClient){
    this.processCount = processMock.length;

    // Counting and Setting Miss Run
    this.missRunData.push({
      data: [this.inBufferProcess.filter(item => item.isMissRun == true).length, this.inBufferProcess.length - this.inBufferProcess.filter(item => item.isMissRun == true).length]
    });

    // Counting and Setting Failed Run
    this.failedRunData.push({
      data: [this.inBufferProcess.filter(item => item.isFailed == true).length, this.inBufferProcess.length - this.inBufferProcess.filter(item => item.isFailed == true).length]
    });

    // Counting and Setting Successfull Run
    this.successfullRunData.push({
      data: [this.inBufferProcess.filter(item => item.isFailed == false && item.isMissRun == false).length, this.inBufferProcess.length - this.inBufferProcess.filter(item => item.isFailed == false && item.isMissRun == false).length]
    });
  }
  
  Ctrl($scope)
  {
      $scope.date = new Date();
  }

  ngOnInit() {
  }

  reloadProcess(params) {
    this.processData.query(params).then(processes => this.inBufferProcess = processes);
  }
  
  // Miss Run Chart CLICK EVENT.
  onMissRunChartClick(event) {
    if(event.active[0]._view.label == "No"){
      this.inBufferProcess = processMock.filter(item => item.isMissRun == false)
    }
    else if(event.active[0]._view.label == "Yes"){
      this.inBufferProcess = processMock.filter(item => item.isMissRun == true)
    }
  }

  // Failed Run Chart CLICK EVENT.
  onFailedRunChartClick(event) {
    if(event.active[0]._view.label == "No"){
      this.inBufferProcess = processMock.filter(item => item.isFailed == false)
    }
    else if(event.active[0]._view.label == "Yes"){
      this.inBufferProcess = processMock.filter(item => item.isFailed == true)
    }
  }

  // Successfull Run Chart CLICK EVENT.
  onSuccessfullRunChartClick(event) {
    if(event.active[0]._view.label == "No"){
      this.inBufferProcess = processMock.filter(item => item.isFailed != true || item.isMissRun != true)
    }
    else if(event.active[0]._view.label == "Yes"){
      this.inBufferProcess = processMock.filter(item => item.isFailed == false && item.isMissRun == false)
    }
  }

  cellColor(car) {
    return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7)/1.3)*100)) + ')';
  };
}

class Result{
  DocumentID: number;
  Language: string;
  Product: string;
  BrandName: string;
  City: string;
  Sequence: number;
}
