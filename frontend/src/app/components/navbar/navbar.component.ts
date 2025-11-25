import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  
  // Variable que contiene los datos del usuario autenticado
  // Se actualiza automáticamente cuando el usuario hace login/logout
  public currentUser: UserProfile | null = null;

  constructor(
    location: Location,  
    private element: ElementRef, 
    private router: Router,
    private authService: AuthService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    
    // Nos suscribimos al observable del usuario actual
    // Cada vez que el usuario haga login o logout, este observable emitirá el nuevo valor
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        console.log('👤 Usuario en navbar:', {
          nombre: user.displayName,
          email: user.email,
          foto: user.photoURL
        });
      }
    });
  }

  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  /**
   * Cierra la sesión del usuario
   * Llama al método logout del AuthService que:
   * 1. Cierra la sesión en Firebase
   * 2. Limpia el estado del usuario
   * 3. Redirige al login
   */
  async logout() {
    try {
      await this.authService.logout();
      console.log('👋 Sesión cerrada correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }

}
