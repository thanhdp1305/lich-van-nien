import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LichAmThang } from './components/lich-am-thang/lich-am-thang';
import { TraCuu } from './components/tra-cuu/tra-cuu';
import { LichAmRoutingModule } from './lich-am-routing.module';
import { LaBan } from './components/la-ban/la-ban';

@NgModule({
  declarations: [
    LichAmThang,
    TraCuu,
    LaBan
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LichAmRoutingModule
  ],
  providers: [],
  bootstrap: []
})
export class LichAmModule { }
