import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Home01Page } from './home01.page';

const routes: Routes = [
  {
    path: '',
    component: Home01Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Home01PageRoutingModule {}
