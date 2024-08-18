import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Home01PageRoutingModule } from './home01-routing.module';

import { Home01Page } from './home01.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Home01PageRoutingModule
  ],
  declarations: [Home01Page]
})
export class Home01PageModule {}
