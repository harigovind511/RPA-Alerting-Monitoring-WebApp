import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { UICarouselModule } from 'ui-carousel';
import { LandingPageComponent } from './LandingPage/landingPage';
// Bulma Angular Imports
import { Angular2BulmaModule } from 'angular2-bulma';
//Angular datatable imports
import { DataTablesModule } from 'angular-datatables';
// Azure Blob Service
import { BLOB_STORAGE_TOKEN, IBlobStorage } from './Services/azure-storage/azureStorage';
import { BlobStorageService } from './Services/azure-storage/blob-storage.service';
import { NwbAllModule } from '@wizishop/ng-wizi-bulma';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// For Chats.js
import { ChartsModule } from 'ng2-charts';
// For Data Table
import { DataTableModule } from 'angular5-data-table';
// For VM Data
import { VMDataComponent } from './vmdata/vmdata.component';
// For Miss Run
import { MissRunComponent } from './missrun/missrun.component';
// For Process Scheduler
import { ProcessSchedulerComponent } from './ProcessScheduler/processscheduler.component';
// For Authorization
import { AuthService } from './Services/authenticationHelper';
import { UIElementData } from './SharedDataService/SharedDataService';
// For NG Multiselect Combo Box
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// For Services
import { MissRunService } from './Services/missrun.Service';

import { CalendarModule } from 'primeng/calendar';

import { DatePipe } from '@angular/common'

import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';

import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { MaskedTextBoxModule, UploaderAllModule } from '@syncfusion/ej2-angular-inputs';

import { ToolbarAllModule, ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';

import { ButtonAllModule  } from '@syncfusion/ej2-angular-buttons';

import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';

import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars';

import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';

import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';

export function azureBlobStorageFactory(): IBlobStorage {
    return window['AzureStorage'].Blob;
}
@NgModule({
    declarations: [
        AppComponent,
        LandingPageComponent,
        MissRunComponent,
        ProcessSchedulerComponent,
        VMDataComponent
    ],
    imports: [
        CalendarModule,
        BrowserModule,
        Angular2BulmaModule,
        HttpClientModule,
        UICarouselModule,
        AngularFontAwesomeModule,
        FormsModule,
        NwbAllModule,
        BrowserAnimationsModule,
        ChartsModule,
        DataTablesModule,
        DataTableModule,
        NgMultiSelectDropDownModule,
        ScheduleAllModule, 
        RecurrenceEditorAllModule,   
        NumericTextBoxAllModule, 
        DatePickerAllModule, 
        TimePickerAllModule, 
        DateTimePickerAllModule, 
        CheckBoxAllModule, 
        ToolbarAllModule,   
        DropDownListAllModule, 
        ContextMenuAllModule, 
        MaskedTextBoxModule, 
        UploaderAllModule, 
        MultiSelectAllModule, 
        TreeViewModule, 
        ButtonAllModule,
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: LandingPageComponent
            },
            {
                path: 'vm',
                component: VMDataComponent
            },
            {
                path: 'missrun',
                component: MissRunComponent
            },
            {
                path: 'processscheduler',
                component: ProcessSchedulerComponent
            }
        ])
    ],
    providers: [
        AuthService,
        UIElementData,
        MissRunService,
        DatePipe,
        BlobStorageService,
        {
            provide: BLOB_STORAGE_TOKEN,
            useFactory: azureBlobStorageFactory
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
