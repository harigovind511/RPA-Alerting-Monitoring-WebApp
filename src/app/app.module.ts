import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CustomDotsComponent } from "./landingCarousel/landingCarousel";
import { UICarouselModule } from "ui-carousel";
import { LandingPageComponent } from "./LandingPage/landingPage";

// Bulma Angular Imports
import { Angular2BulmaModule } from 'angular2-bulma';

// Webcam Imports
import {WebcamModule} from 'ngx-webcam';

// Custom Components for Teams
import { ChatbotComponent } from "./ChatBot/chatbot";
import { NLPComponent } from "./NLP/nlp";
import { VisionComponent } from "./Vision/vision";
import { OCRComponent } from "./OCR/ocr";
import { MLComponent } from "./ML/ml"; 

// Service imports for Team based Experience Demos
import { NLPService } from "./Services/nlp.Service";
import { MLService } from "./Services/ml.Service";
import { VisionService } from "./Services/vision.Service";

// Carousels for Team based Experience Demos
import { ChatbotCarouselComponent } from './ChatBot/Carousels/chatbot.carousels';

// Azure Blob Service
import { BLOB_STORAGE_TOKEN, IBlobStorage } from './Services/azure-storage/azureStorage';
import { BlobStorageService } from './Services/azure-storage/blob-storage.service';

import {NwbAllModule} from '@wizishop/ng-wizi-bulma';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// For Chats.js
import { ChartsModule } from 'ng2-charts'

// For Data Table
import { DataTableModule } from 'angular5-data-table';

export function azureBlobStorageFactory(): IBlobStorage {
  return window['AzureStorage'].Blob;
}

@NgModule({
  declarations: [
    AppComponent,
    CustomDotsComponent,
    LandingPageComponent,
    ChatbotComponent,
    NLPComponent,
    MLComponent,
    VisionComponent,
    OCRComponent,
    ChatbotCarouselComponent
  ],
  imports: [
    BrowserModule,
    Angular2BulmaModule,
    HttpClientModule,
    UICarouselModule,
    AngularFontAwesomeModule,
    FormsModule,
    WebcamModule,
    NwbAllModule,
    BrowserAnimationsModule,
    ChartsModule,
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
        path: 'chatbot',
        component: ChatbotComponent
      },
      {
        path: 'ocr',
        component: OCRComponent
      },
      {
        path: 'nlp',
        component: NLPComponent
      },
      {
        path: 'ml',
        component: MLComponent
      },
      {
        path: 'vision',
        component: VisionComponent
      }
    ])
  ],
  providers: [ 
    NLPService, 
    MLService,
    VisionService,
    BlobStorageService,
    {
      provide: BLOB_STORAGE_TOKEN,
      useFactory: azureBlobStorageFactory
    } 
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
