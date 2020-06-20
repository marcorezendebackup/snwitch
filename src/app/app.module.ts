import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TwitchLogApiDirective } from './twitch-log-api.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { StalkComponent } from './stalk/stalk.component';

@NgModule({
  declarations: [
    AppComponent,
    TwitchLogApiDirective,
    HomeComponent,
    StalkComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
