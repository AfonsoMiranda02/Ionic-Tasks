import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProjetosRoutingModule } from './projetos-routing-module';
import { ProjetosPage } from './projetos.page';

@NgModule({
  declarations: [ProjetosPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjetosRoutingModule
  ]
})
export class ProjetosPageModule { }
