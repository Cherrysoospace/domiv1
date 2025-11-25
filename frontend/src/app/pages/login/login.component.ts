import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Variables para el formulario de email/password
  email: string = '';
  password: string = '';
  
  // Estados de la UI
  loading: boolean = false;        // Muestra spinner durante login
  errorMessage: string = '';       // Mensaje de error si algo falla

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy() {
  }

  /**
   * LOGIN CON GOOGLE
   * Abre popup de Google para autenticación OAuth2
   */
  async loginWithGoogle() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const userProfile = await this.authService.loginWithGoogle();
      console.log('🎉 Login exitoso con Google');
      this.handleSuccessfulLogin(userProfile);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * LOGIN CON GITHUB
   * Abre popup de GitHub para autenticación OAuth2
   */
  async loginWithGithub() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const userProfile = await this.authService.loginWithGithub();
      console.log('🎉 Login exitoso con GitHub');
      this.handleSuccessfulLogin(userProfile);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * LOGIN CON MICROSOFT
   * Abre popup de Microsoft para autenticación OAuth2
   */
  async loginWithMicrosoft() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const userProfile = await this.authService.loginWithMicrosoft();
      console.log('🎉 Login exitoso con Microsoft');
      this.handleSuccessfulLogin(userProfile);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * LOGIN CON EMAIL Y PASSWORD
   * Método tradicional de autenticación
   */
  async loginWithEmail() {
    // Validación básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingrese email y contraseña';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    try {
      const userProfile = await this.authService.loginWithEmail(this.email, this.password);
      console.log('🎉 Login exitoso con Email');
      this.handleSuccessfulLogin(userProfile);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Maneja el login exitoso
   * Muestra los datos en consola y redirige al dashboard
   */
  private handleSuccessfulLogin(userProfile: UserProfile) {
    console.log('═══════════════════════════════════');
    console.log('📋 DATOS DEL USUARIO AUTENTICADO');
    console.log('═══════════════════════════════════');
    console.log('👤 Nombre:', userProfile.displayName);
    console.log('📧 Email:', userProfile.email);
    console.log('📷 Foto:', userProfile.photoURL);
    console.log('🆔 UID:', userProfile.uid);
    console.log('🔑 Token:', userProfile.token);
    console.log('═══════════════════════════════════');
    console.log('💡 Ahora abre DevTools → Network y haz una petición HTTP');
    console.log('   Verás el token en Request Headers → Authorization');
    console.log('═══════════════════════════════════');

    // Redirigir al dashboard después del login
    this.router.navigate(['/dashboard']);
  }

}
