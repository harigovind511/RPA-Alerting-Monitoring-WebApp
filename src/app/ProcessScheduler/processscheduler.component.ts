import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {FullCalendarModule} from 'primeng/fullcalendar';
import { EventSettingsModel, View, EventRenderedArgs, DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService }
from '@syncfusion/ej2-angular-schedule';
import { zooEventsData } from './Data';
import { extend } from '@syncfusion/ej2-base';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';

@Component({
    selector: 'app-processscheduler',
    styles: [ './processscheduler.component.css' ],
    templateUrl: './processscheduler.component.html',
    providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService]
  })
  
  export class ProcessSchedulerComponent implements OnInit {
    mockEvents: any[];
  
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
  
    constructor(public datepipe: DatePipe){
      
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
  }