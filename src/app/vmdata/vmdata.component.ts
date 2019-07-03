import { Component, OnInit } from '@angular/core';

// For HTTP Requests
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { count } from 'rxjs/operators';
import * as $ from 'jquery';

// For Live Line Chart
import { Chart } from 'chart.js';

import { AuthService } from '../Services/authenticationHelper';

import { UIElementData } from '../SharedDataService/SharedDataService';
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
  // For Multiselect Tags
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  tags = [];

  title = 'Unilever Brand Measures';
  authButtonName = 'DEFAULT';
  isUserAuthenticated = false;

  // For Last Updated Date
  date = Date.now();

  // For VM Process Data
  VMProcess = processVM;
  newArray:any = [];
  distinctteams:any = [];
  dataVM: any = [];
  inactivedata: any = [];
  count: any;
  data: any;

  // For Top Panel
  developmentActiveProcessCount;
  developmentUIActiveProcessCount;
  developmentAutomationActiveProcessCount;

  developmentInActiveProcessCount;
  developmentUIInActiveProcessCount;
  developmentAutomationInActiveProcessCount;

  qualityActiveProcessCount;
  qualityUIActiveProcessCount;
  qualityAutomationActiveProcessCount;

  qualityInActiveProcessCount;
  qualityUIInActiveProcessCount;
  qualityAutomationInActiveProcessCount;

  productionActiveProcessCount;
  productionUIActiveProcessCount
  productionAutomationActiveProcessCount

  productionInActiveProcessCount;
  productionUIInActiveProcessCount;
  productionAutomationInActiveProcessCount;

  currentVMProcesses:any = [];

  // For Doughnut Chart for Blue Prism
  devChart: any = [];
  qaChart: any = [];
  prodChart: any = [];

  // For Doughnut Chart for UI Path
  UIdevChart: any = [];
  UIqaChart: any = [];
  UIprodChart: any = [];

  // For Doughnut Chart for Automation Anywhere
  AutodevChart: any = [];
  AutoqaChart: any = [];
  AutoprodChart: any = [];


  // For VM Details Modal Pop Up
  isVMDetailsModelClicked = false;
  currentVMName;
  currentEnvironment;
  isBluePrismRunning;
  lastUpdatedDatetime;
  Tags;

  constructor(private authService: AuthService, private UIElementData: UIElementData, private httpClient: HttpClient) {
    setInterval(() => {
      this.get_data();
    }, 5000);
  }

  ngOnInit() {
    this.dropdownSettings = {
      "singleSelection": false,
      "idField": "id",
      "textField": "itemName",
      "allowSearchFilter": true,
      "enableCheckAll": false
    };            

    // Initiating Object Reference for SSO Authentication
    this.authService.initAuth();

    // Setting Login button Name
    this.UIElementData.currentAuthButtonname
      .subscribe(name => {
        this.authButtonName = name;
      });

    this.UIElementData.currentisUserAuthenticated
      .subscribe(status => {
        this.isUserAuthenticated = status;
      });
  }

  onItemSelect(item: any) {
    var value = $("#mySelect :selected").text();

    if (value == "All") {
      this.dataVM = this.data.filter(itm => itm.Tags != null && itm.Tags != "" && itm.Tags != undefined && itm.Tags.split(';').filter(tag => tag == item.itemName).length > 0);
    }
    if (value == "In-Active") {
      this.dataVM = this.data.filter(itm => itm.IsBluePrismRunning == false && itm.Tags != null && itm.Tags != "" && itm.Tags != undefined && itm.Tags.split(';').filter(tag => tag == item.itemName).length > 0);
    }
    if (value == "Active") {
      this.dataVM = this.data.filter(itm => itm.IsBluePrismRunning == true && itm.Tags != null && itm.Tags != "" && itm.Tags != undefined && itm.Tags.split(';').filter(tag => tag == item.itemName).length > 0);
    }
  }

  onItemDeSelect(item: any){
    this.selectedItems = this.arrayRemove(this.selectedItems, item);
    
    if(this.selectedItems.length > 0){
      this.data = this.data.filter(item => item.Tags != "" && item.Tags != null && item.Tags != undefined && item.Tags.split(';').filter(tg => this.selectedItems.filter(stag => stag == tg).length > 0));
    }

    var value = $("#mySelect :selected").text();

    if (value == "All") {
      this.dataVM = this.data.filter(itm => itm.Tags != null && itm.Tags != "" && itm.Tags != undefined && itm.Tags.split(';').filter(tg => this.selectedItems.filter(stag => stag == tg).length > 0));
    }
    if (value == "In-Active") {
      this.dataVM = this.data.filter(itm => itm.IsBluePrismRunning == false && itm.Tags != null && itm.Tags != "" && itm.Tags != undefined && itm.Tags.split(';').filter(tg => this.selectedItems.filter(stag => stag == tg).length > 0));
    }
    if (value == "Active") {
      this.dataVM = this.data.filter(itm => itm.IsBluePrismRunning == true && itm.Tags != null && itm.Tags != "" && itm.Tags != undefined && itm.Tags.split(';').filter(tg => this.selectedItems.filter(stag => stag == tg).length > 0));
    }
  }

  arrayRemove(arr, value) {
    return arr.filter(function(ele){
        return ele != value;
    });
 }

  onSelectAll(items: any) {
    console.log(items);
  }

  authFunction(){
    var authActionName ;
    this.UIElementData.currentAuthButtonname
      .subscribe(name => authActionName = name);

    if(authActionName == "Sign In"){
      this.authService.login();

      // Loading data after Successfull Login
      this.get_data();
    }
    else if(authActionName == "Sign Out"){
      this.authService.logout();
    }
  }

  ngAfterViewInit() {

  }

  areProcessRunning(input){

  }

  tagIndex = 1;
  //to fetch data from API
  get_data() {
    this.httpClient.get("https://vmprocessmonitoringservice.azurewebsites.net/VMActivity/GetVMStatuses").subscribe((res) => {
      this.data = res;

      var tempTagsData = [];
      var tempTags = this.data.filter(item => item.Tags != "" && item.Tags != null && item.Tags != undefined);
      for(var j = 0; j < tempTags.length; j++){
        for(var x = 0; x < tempTags[j].Tags.split(';').length; x++){
          if(this.tags.filter(tag => tag == tempTags[j].Tags.split(';')[x]).length == 0){
            this.tags.push(tempTags[j].Tags.split(';')[x]);
            
            tempTagsData.push({
              "id":this.tagIndex,"itemName": tempTags[j].Tags.split(';')[x]
            });
            this.tagIndex = this.tagIndex + 1;
            this.dropdownList = tempTagsData;
          }
        }
      }

      const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
      }
    
      this.newArray = res;
      var teamNameArr = this.newArray.map(a => a.TeamName);
      this.distinctteams = teamNameArr.filter(distinct);
      
      this.inactivedata = this.data.filter(item => JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0);
      
      for(var i = 0; i < this.inactivedata.length; i++ ){
        for(var j = 0; j < this.data.length; j++){
          if(this.inactivedata[i].PartitionKey == this.data[j].PartitionKey){
            this.data[j].IsBluePrismRunning = false;
          }
          else{
            this.data[j].IsBluePrismRunning = true;
          }
        }
      }

      if(this.selectedItems.length > 0){
        this.data = this.data.filter(item => item.Tags != "" && item.Tags != null && item.Tags != undefined && item.Tags.split(';').filter(tg => this.selectedItems.filter(stag => stag == tg).length > 0));
      }

      // Counting Environment Level Counts - For BluePrism
      this.developmentActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Development" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "BluePrism").length;
      this.developmentInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Development" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "BluePrism").length;

      this.qualityActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Quality" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "BluePrism").length;
      this.qualityInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Quality" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "BluePrism").length;

      this.productionActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Production" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "BluePrism").length;
      this.productionInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Production" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "BluePrism").length;

      // Counting Environment Level Counts - For UI Path
      this.developmentUIActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Development" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "UI Path").length;
      this.developmentUIInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Development" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "UI Path").length;

      this.qualityUIActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Quality" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "UI Path").length;
      this.qualityUIInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Quality" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "UI Path").length;

      this.productionUIActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Production" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "UI Path").length;
      this.productionUIInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Production" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "UI Path").length;

      // Counting Environment Level Counts - For Automation Anywhere
      this.developmentAutomationActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Development" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "Automation Anywhere").length;
      this.developmentAutomationInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Development" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "Automation Anywhere").length;
      
      this.qualityAutomationActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Quality" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "Automation Anywhere").length;
      this.qualityAutomationInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Quality" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "Automation Anywhere").length;

      this.productionAutomationActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Production" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0 && item.ApplicationName == "Automation Anywhere").length;
      this.productionAutomationInActiveProcessCount = this.data.filter(item => item.Environment != null && item.Environment == "Production" && JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0 && item.ApplicationName == "Automation Anywhere").length;

      var value = $("#mySelect :selected").text();

      if (value == "All") {
        this.dataVM = this.data;
      }
      if (value == "In-Active") {
        this.dataVM = this.data.filter(item => item.IsBluePrismRunning == false)
      }
      if (value == "Active") {
        this.dataVM = this.data.filter(item => item.IsBluePrismRunning == true)
      }

      // For Last Updated
      this.date = Date.now();

      // <-------------------- BLUEPRISM START ----------------------->
      // For Live Update Stat Live chart - Dev for Blue prism
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


      // For Live Update Stat Live chart - QA for Blue Prism
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


      // For Live Update Stat Live chart - Prod for Blue Prism
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
      // <-------------------- BLUEPRISM END ----------------------->

      // <-------------------- UI PATH START ----------------------->
      this.UIdevChart = new Chart('devUICanvas', {
        type: 'doughnut',
        data: {
          labels: [
            "Active",
            "Inactive",
          ],
          datasets: [
            {
              data: [
                this.developmentUIActiveProcessCount, this.developmentUIInActiveProcessCount
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


      // For Live Update Stat Live chart - QA for Blue Prism
      this.UIqaChart = new Chart('qaUICanvas', {
        type: 'doughnut',
        data: {
          labels: [
            "Active",
            "Inactive",
          ],
          datasets: [
            {
              data: [
                this.qualityUIActiveProcessCount, this.qualityUIInActiveProcessCount
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


      // For Live Update Stat Live chart - Prod for Blue Prism
      this.UIprodChart = new Chart('uiProdCanvas', {
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
      // <-------------------- UI PATH END ----------------------->

      // <-------------------- Automation Anywhere START ----------------------->
      this.AutodevChart = new Chart('devAutoCanvas', {
        type: 'doughnut',
        data: {
          labels: [
            "Active",
            "Inactive",
          ],
          datasets: [
            {
              data: [
                this.developmentAutomationActiveProcessCount, this.developmentAutomationInActiveProcessCount
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

      // For Live Update Stat Live chart - QA for Blue Prism
      this.AutoqaChart = new Chart('qaAutoCanvas', {
        type: 'doughnut',
        data: {
          labels: [
            "Active",
            "Inactive",
          ],
          datasets: [
            {
              data: [
                this.qualityAutomationActiveProcessCount, this.qualityAutomationInActiveProcessCount
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

      // For Live Update Stat Live chart - Prod for Blue Prism
      this.AutoprodChart = new Chart('prodAutoCanvas', {
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
      // <-------------------- Automation Anywhere END ----------------------->
    });
  }

  // Method to check if Tag exist in VM Item
  ifTagsExist(tag: string){
    if(this.selectedItems.length > 0){
      this.selectedItems.filter(item => item == tag).length > 0 ? true : false;
    }
    else{
      return false;
    }
  }

  onChange(newValue) {
    if (newValue == "Active") {
      this.dataVM = this.data.filter(item => JSON.parse(item.Processes).filter(item => !item.IsRunning).length == 0)
    }
    if (newValue == "In-Active") {

      this.dataVM = this.data.filter(item => JSON.parse(item.Processes).filter(item => !item.IsRunning).length > 0)
    }
    if (newValue == "All") {

      this.dataVM = this.data;
    }
  }

  onChangeSite(newValue) {
    debugger;
    if (newValue == "Development") {
      this.dataVM = this.data.filter(item => item.Environment == "Development")
    }
    if (newValue == "Quality") {
      this.dataVM = this.data.filter(item => item.Environment == "Quality")
    }
    if (newValue == "Production") {
      this.dataVM = this.data.filter(item => item.Environment == "Production");
    }
    if(newValue == "All"){
      this.dataVM = this.data;
    }
  }


  // Method to Handle click on Environments Panel
  onEnvironmentChange(value) {
    this.dataVM = this.dataVM.filter(item => item.Environment == value);
  }

  // Model Open/Close Button Action
  isVMDetailsModelClickedEvent(processDetailsInstance) {
    this.isVMDetailsModelClicked = this.isVMDetailsModelClicked == true ? false : true;
    if (this.isVMDetailsModelClicked) {
      this.currentVMName = processDetailsInstance.PartitionKey;
      this.currentEnvironment = processDetailsInstance.Environment;
      this.lastUpdatedDatetime = processDetailsInstance.Timestamp;
      this.currentVMProcesses = JSON.parse(processDetailsInstance.Processes);
      this.isBluePrismRunning = JSON.parse(processDetailsInstance.Processes).filter(item => !item.IsRunning).length > 0 ? false : true;
      if(processDetailsInstance.Tags != "" && processDetailsInstance.Tags != null && processDetailsInstance.Tags != undefined){
        this.tags = processDetailsInstance.Tags.split(';');
      }
      else{
        this.tags = [];
      }
      
    }
  }

  // For Last Updated
  Ctrl($scope) {
    $scope.date = new Date();
  }
}
