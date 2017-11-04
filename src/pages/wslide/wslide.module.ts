import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WslidePage } from './wslide';

@NgModule({
  declarations: [
    WslidePage,
  ],
  imports: [
    IonicPageModule.forChild(WslidePage),
  ],
  exports: [
    WslidePage
  ]
})
export class WslidePageModule {}
