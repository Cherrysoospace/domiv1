import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // Variables del formulario de registro
  name: string = '';
  email: string = '';
  password: string = '';
  acceptTerms: boolean = false;
  
  // Estados de la UI
  loading: boolean = false;
  errorMessage: string = '';
  passwordStrength: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * REGISTRO CON GOOGLE
   * NOTA: OAuth2 (Google, GitHub, Microsoft) no diferencia entre registro y login
   * Si la cuenta no existe, Firebase la crea automáticamente
   * Si la cuenta ya existe, simplemente inicia sesión
   */
  async registerWithGoogle() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      // OAuth2 crea la cuenta si no existe, o inicia sesión si existe
      const userProfile = await this.authService.loginWithGoogle();
      console.log('🎉 Autenticación exitosa con Google');
      this.handleSuccessfulRegister(userProfile);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * REGISTRO CON GITHUB
   * OAuth2 crea la cuenta automáticamente si no existe
   */
  async registerWithGithub() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const userProfile = await this.authService.loginWithGithub();
      console.log('🎉 Autenticación exitosa con GitHub');
      this.handleSuccessfulRegister(userProfile);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * REGISTRO CON MICROSOFT
   * OAuth2 crea la cuenta automáticamente si no existe
   */
  async registerWithMicrosoft() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const userProfile = await this.authService.loginWithMicrosoft();
      console.log('🎉 Autenticación exitosa con Microsoft');
      this.handleSuccessfulRegister(userProfile);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * REGISTRO CON EMAIL Y PASSWORD
   * Crea una cuenta nueva en Firebase
   */
  async registerWithEmail() {
    // Validaciones
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Debes aceptar los términos y condiciones';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    try {
      const userProfile = await this.authService.registerWithEmail(
        this.email, 
        this.password,
        this.name
      );
      console.log('🎉 Registro exitoso con Email');
      this.handleSuccessfulRegister(userProfile);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Calcula la fortaleza de la contraseña
   */
  checkPasswordStrength() {
    const password = this.password;
    if (!password) {
      this.passwordStrength = '';
      return;
    }

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) {
      this.passwordStrength = 'weak';
    } else if (strength <= 3) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  /**
   * Maneja el registro exitoso
   */
  private handleSuccessfulRegister(userProfile: UserProfile) {
    console.log('═══════════════════════════════════');
    console.log('✅ REGISTRO COMPLETADO');
    console.log('═══════════════════════════════════');
    console.log('👤 Nombre:', userProfile.displayName);
    console.log('📧 Email:', userProfile.email);
    console.log('🆔 UID:', userProfile.uid);
    console.log('═══════════════════════════════════');

    // Redirigir al dashboard
    this.router.navigate(['/dashboard']);
  }

}
