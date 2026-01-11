import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';

/**
 * Componente raiz da aplicação
 * Inicializa controlos do dispositivo via Capacitor
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {}

  async ngOnInit() {
    // Bloquear orientação em modo portrait (vertical) quando em dispositivo móvel
    if (this.platform.is('capacitor')) {
      try {
        await ScreenOrientation.lock({ orientation: 'portrait' });
      } catch (error) {
        console.log('Erro ao bloquear orientação:', error);
      }
    }
  }
}
