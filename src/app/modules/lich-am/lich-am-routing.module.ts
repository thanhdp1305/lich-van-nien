import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraCuu } from './commponents/tra-cuu/tra-cuu';
import { LichAmThang } from './commponents/lich-am-thang/lich-am-thang';

const routes: Routes = [
  {
    path: 'tra-cuu',
    component: TraCuu
  },
  {
    path: 'tra-cuu/thang',
    component: LichAmThang
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
