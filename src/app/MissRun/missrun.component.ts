import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MissRunService } from '../Services/missrun.Service';

// For HTTP Requests
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { count } from 'rxjs/operators';
import * as $ from 'jquery';

// For Data Table
import { DataTable, DataTableTranslations, DataTableResource } from 'angular5-data-table';

// For PrimeNG Calendar Control
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-missrun',
  styles: [ './missrun.component.css' ],
  templateUrl: './missrun.component.html'
})

export class MissRunComponent implements OnInit {
  viewMode = 'tab1';
  missRunCount = 0;
  missRunResults = [];
  rangeDates: Date[];

  ngOnInit() {

  }

  constructor(public datepipe: DatePipe, private missRunService: MissRunService){
    
  }

  getResults(){
    console.log("Start Date: " + this.datepipe.transform(this.rangeDates[0], 'yyyy-MM-dd') + " 00:00:00");
    console.log("End Date: " + this.datepipe.transform(this.rangeDates[1], 'yyyy-MM-dd') + " 00:00:00");

    this.missRunService.getMissRunDetails(this.datepipe.transform(this.rangeDates[0], 'yyyy-MM-dd') + " 00:00:00", this.datepipe.transform(this.rangeDates[1], 'yyyy-MM-dd') + " 00:00:00")
      .then(res => {
        this.missRunCount = res.length;
        this.missRunResults = res;
        console.log(res);
      });
  }
}