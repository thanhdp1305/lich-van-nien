import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraCuu } from './commponents/tra-cuu/tra-cuu';

const routes: Routes = [
  {
    path: 'tra-cuu',
    component: TraCuu
  },
  {
    path: "",
    redirectTo: "tra-cuu",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LichAmRoutingModule { }
