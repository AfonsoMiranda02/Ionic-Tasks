import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaPageRoutingModule } from './lista-routing.module';
import { ListaPage } from './lista.page';
import { TarefaCardComponent } from '../../components/tarefa-card/tarefa-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ListaPageRoutingModule
  ],
  declarations: [
    ListaPage, 
    TarefaCardComponent
  ]
})
export class ListaPageModule {}
