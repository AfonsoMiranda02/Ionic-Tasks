import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CategoriasRoutingModule } from './categorias-routing-module';
import { CategoriasPage } from './categorias.page';

@NgModule({
  declarations: [CategoriasPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriasRoutingModule
  ]
})
export class CategoriasPageModule { }
