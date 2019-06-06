import { Component, OnInit } from '@angular/core';
// For HTTP Requests
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { count } from 'rxjs/operators';
import * as $ from 'jquery';

// For Live Line Chart
import { Chart } from 'chart.js';

// This lets me use jquery
//declare var $: any;

// Process Data Sample
export const processVM = [
  { VMname: "VM 1", id: "123", status: "Active", isSuccessful: false },
  { VMname: "VM 2", id: "234", status: "In-Active", isSuccessful: false },
  { VMname: "VM 3", id: "135434", status: "Active", isSuccessful: false },
  { VMname: "VM 4", id: "15454", status: "Active", isSuccessful: false },
  { VMname: "VM 5", id: "123", status: "Active", isSuccessful: false },
  { VMname: "VM 6", id: "234", status: "Active", isSuccessful: false },
  { VMname: "VM 7", id: "135434", status: "Active", isSuccessful: false },
  { VMname: "VM ", id: "15454", status: "Active", isSuccessful: false },
]

// Interface to Map File Upload Progress
interface IUploadProgress {
  filename: string;
  progress: number;
}

@Component({
  selector: 'app-vmdata',
  templateUrl: './vmdata.component.html',
  styleUrls: ['./vmdata.component.css']
})

export class VMDataComponent implements OnInit {
  // For Last Updated Date
  date = Date.now();

  // For VM Process Data
  VMProcess = processVM;
  dataVM: any = [];
  count: any;
  data: any;

  // For Top Panel
  developmentActiveProcessCount;
  developmentInActiveProcessCount;
  qualityActiveProcessCount;
  qualityInActiveProcessCount;
  productionActiveProcessCount;
  productionInActiveProcessCount;

  // For Doughnut Chart
  devChart:any = [];
  qaChart:any = [];
  prodChart:any = [];

  // For VM Details Modal Pop Up
  isVMDetailsModelClicked = false;
  currentVMName;
  currentEnvironment;
  isBluePrismRunning;
  lastUpdatedDatetime;

  constructor(private httpClient: HttpClient) {
    setInterval(() => {
      this.get_data();       
    }, 20000);
  }

  ngOnInit() { 
    this.get_data();
  }

  ngAfterViewInit(){
    
  }

  //to fetch data from API
  get_data() {
      this.httpClient.get("https://vmprocessmonitoringservice.azurewebsites.net/VMActivity/GetVMStatuses").subscribe((res) => {
      this.data = res;

      // Counting Environment Level Counts
      this.developmentActiveProcessCount = this.data.filter(item => item.Environment == "DEV" && item.IsBluePrismRunning == true).length;
      this.developmentInActiveProcessCount = this.data.filter(item => item.Environment == "DEV" && item.IsBluePrismRunning == false).length;

      this.qualityActiveProcessCount = this.data.filter(item => item.Environment == "QA" && item.IsBluePrismRunning == true).length;
      this.qualityInActiveProcessCount = this.data.filter(item => item.Environment == "QA" && item.IsBluePrismRunning == false).length;

      this.productionActiveProcessCount = this.data.filter(item => item.Environment == "PROD" && item.IsBluePrismRunning == true).length;
      this.productionInActiveProcessCount = this.data.filter(item => item.Environment == "PROD" && item.IsBluePrismRunning == false).length;
      
      var value = $("#mySelect :selected").text();

      if(value == "All"){
        this.dataVM = this.data;
      }
      if(value == "In-Active"){
        this.dataVM = this.data.filter(item => item.IsBluePrismRunning == false)
      }
      if (value == "Active") {

        this.dataVM = this.data.filter(item => item.IsBluePrismRunning == true)
      }      

      // For Last Updated
      this.date = Date.now();

      // For Live Update Stat Live chart - Dev
      this.devChart = new Chart('devCanvas', {
        type: 'doughnut',
        data: {
          labels: [
            "Active",
            "Inactive",
          ],
          datasets: [
            { 
              data: [
                this.developmentActiveProcessCount, this.developmentInActiveProcessCount
              ],
              backgroundColor: [
                'hsl(141, 71%, 48%)',
                'hsl(348, 100%, 61%)'
              ],
              fill: false
            }
          ]
        },
        options: {
          legend: {
            display: true
          }
        }
      });

      // For Live Update Stat Live chart - QA
      this.qaChart = new Chart('qaCanvas', {
        type: 'doughnut',
        data: {
          labels: [
            "Active",
            "Inactive",
          ],
          datasets: [
            { 
              data: [
                this.qualityActiveProcessCount, this.qualityInActiveProcessCount
              ],
              backgroundColor: [
                'hsl(141, 71%, 48%)',
                'hsl(348, 100%, 61%)'
              ],
              fill: false
            }
          ]
        },
        options: {
          legend: {
            display: true
          }
        }
      });

      // For Live Update Stat Live chart - Prod
      this.prodChart = new Chart('prodCanvas', {
        type: 'doughnut',
        data: {
          labels: [
            "Active",
            "Inactive",
          ],
          datasets: [
            { 
              data: [
                this.productionActiveProcessCount, this.productionInActiveProcessCount
              ],
              backgroundColor: [
                'hsl(141, 71%, 48%)',
                'hsl(348, 100%, 61%)'
              ],
              fill: false
            }
          ]
        },
        options: {
          legend: {
            display: true
          }
        }
      });
    });
  }

  onChange(newValue) {
    if (newValue == "Active") {
      this.dataVM = this.data.filter(item => item.IsBluePrismRunning == true)
    }
    if (newValue == "In-Active") {

      this.dataVM = this.data.filter(item => item.IsBluePrismRunning == false)
    }
    if (newValue == "All") {

      this.dataVM = this.data;
    }
  }

  // Method to Handle click on Environments Panel
  onEnvironmentChange(value){
    this.dataVM = this.dataVM.filter(item => item.Environment == value);
  }

  // Model Open/Close Button Action
  isVMDetailsModelClickedEvent(processDetailsInstance){
    this.isVMDetailsModelClicked = this.isVMDetailsModelClicked == true? false : true;

    console.log(processDetailsInstance);
    if(this.isVMDetailsModelClicked){
      this.currentVMName = processDetailsInstance.PartitionKey;
      this.currentEnvironment = processDetailsInstance.Environment;
      this.lastUpdatedDatetime = processDetailsInstance.Timestamp;
      this.isBluePrismRunning = processDetailsInstance.IsBluePrismRunning;
    }
  }

  // For Last Updated
  Ctrl($scope) {
    $scope.date = new Date();
  }
}
