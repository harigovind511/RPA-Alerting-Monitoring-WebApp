import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { UICarouselModule } from "ui-carousel";
import { LandingPageComponent } from "./LandingPage/landingPage";

// Bulma Angular Imports
import { Angular2BulmaModule } from 'angular2-bulma';

//Angular datatable imports
import { DataTablesModule } from 'angular-datatables';

// Azure Blob Service
import { BLOB_STORAGE_TOKEN, IBlobStorage } from './Services/azure-storage/azureStorage';
import { BlobStorageService } from './Services/azure-storage/blob-storage.service';

import {NwbAllModule} from '@wizishop/ng-wizi-bulma';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// For Chats.js
import { ChartsModule } from 'ng2-charts'

// For Data Table
import { DataTableModule } from 'angular5-data-table';

//for VM Data
import { VMDataComponent } from './vmdata/vmdata.component';

export function azureBlobStorageFactory(): IBlobStorage {
  return window['AzureStorage'].Blob;
}


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    VMDataComponent
  ],
  imports: [
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
        path: 'VM',
        component: VMDataComponent
      }
    ])
  ],
  providers: [ 
    BlobStorageService,
    {
      provide: BLOB_STORAGE_TOKEN,
      useFactory: azureBlobStorageFactory
    } 
  ],
  bootstrap: [ VMDataComponent ]
})
export class AppModule { }
