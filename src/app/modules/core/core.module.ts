import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BottomNav } from './components/bottom-nav/bottom-nav';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "../../app-routing-module";
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BottomNav
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule
],
  providers: [],
  bootstrap: [],
  exports: [
    BottomNav
  ]
})
export class CoreModule { }
