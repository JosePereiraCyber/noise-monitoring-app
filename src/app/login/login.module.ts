import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from '../pages/login/login.component'; // Importa a página de login
import { LoginComponent } from '../components/login/login.component'; // Importa o componente de login
import { SecureApiComponent } from '../components/secure-api/secure-api.component'; // Importa o componente de secure-api
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    // Outros módulos necessários
  ],
  declarations: [
    // Não declare os componentes standalone aqui
  ],
  exports: [] // Exporte apenas a página ou outro componente que você deseja compartilhar
})
export class LoginModule {}

