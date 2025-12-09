import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "lich-am",
    loadChildren: () => import("./modules/lich-am/lich-am.module").then((m) => m.LichAmModule),
  },
  {
    path: "",
    redirectTo: "lich-am",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
