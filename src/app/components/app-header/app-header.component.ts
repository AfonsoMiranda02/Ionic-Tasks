import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: false // Obrigatório conforme as instruções da Fase 5 [cite: 76]
})
export class AppHeaderComponent {
  @Input() titulo: string = '';

  constructor() { }
}