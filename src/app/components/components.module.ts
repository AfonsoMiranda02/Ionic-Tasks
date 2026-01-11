import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from './app-header/app-header.component';

@NgModule({
  declarations: [AppHeaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [AppHeaderComponent] // Isto permite que outros módulos o usem
})
export class ComponentsModule { }