import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import {FullCalendarModule} from 'primeng/fullcalendar';
import { EventSettingsModel, View, EventRenderedArgs, DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService }
from '@syncfusion/ej2-angular-schedule';
import { zooEventsData } from './Data';
import { extend } from '@syncfusion/ej2-base';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';

import { AuthService } from '../Services/authenticationHelper';

import { UIElementData } from '../SharedDataService/SharedDataService';

import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
    selector: 'app-processscheduler',
    styles: [ './processscheduler.component.css' ],
    templateUrl: './processscheduler.component.html',
    providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService]
  })
  
  export class ProcessSchedulerComponent implements OnInit {
    mockEvents: any[];
    authButtonName = 'DEFAULT';
    isUserAuthenticated = false;
  
    private dataManger: DataManager = new DataManager({
        url: 'https://js.syncfusion.com/demos/ejservices/api/Schedule/LoadData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });

    public data: object[] = [{
        Id: 1,
        Subject: 'Meeting',
        StartTime: new Date(2018, 1, 15, 10, 0),
        EndTime: new Date(2018, 1, 15, 12, 30)
    },
    {
        Id: 1,
        Subject: 'Meeting',
        StartTime: new Date(2018, 1, 15, 10, 0),
        EndTime: new Date(2018, 1, 15, 12, 30)
    }];

    public selectedDate: Date = new Date(2017, 5, 5);
    public eventSettings: EventSettingsModel = { dataSource: this.data };//{ dataSource: this.dataManger };
    public currentView: View = 'Week';

    ngOnInit() {
        
    }
  
    constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public datepipe: DatePipe, private authService: AuthService, private UIElementData: UIElementData, ){
        if(this.storage.get("IsUserAuthenticated") == null || this.storage.get("IsUserAuthenticated") == false){
            this.UIElementData.currentisUserAuthenticated
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
                this.storage.set("IsUserAuthenticated", status);
                });
        }
        else{
            this.isUserAuthenticated = this.storage.get("IsUserAuthenticated");

            // Setting Login button Name
            this.UIElementData.currentAuthButtonname
                .subscribe(name => {
                this.authButtonName = name;
            });
        }
    }

    oneventRendered(args: EventRenderedArgs): void {
        let categoryColor: string = args.data.CategoryColor as string;
        if (!args.element || !categoryColor) {
            return;
        }
        if (this.currentView === 'Agenda') {
            (args.element.firstChild as HTMLElement).style.borderLeftColor = categoryColor;
        } else {
            args.element.style.backgroundColor = categoryColor;
        }
    }

    authFunction(){
        var authActionName ;
        this.UIElementData.currentAuthButtonname
          .subscribe(name => authActionName = name);
    
        if(authActionName == "Sign In"){
          this.authService.login();
        }
        else if(authActionName == "Sign Out"){
          this.authService.logout();
        }
      }
  }