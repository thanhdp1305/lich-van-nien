import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraCuu } from './components/tra-cuu/tra-cuu';
import { LaBan } from './components/la-ban/la-ban';
import { LichAmThang } from './components/lich-am-thang/lich-am-thang';

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
    path: 'la-ban',
    component: LaBan
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
