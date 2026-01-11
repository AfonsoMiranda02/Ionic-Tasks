import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { TarefaPageRoutingModule } from './tarefa-routing.module';
import { TarefaPage } from './tarefa.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    TarefaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TarefaPage]
})
export class TarefaPageModule {}