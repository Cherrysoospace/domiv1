import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
// Importamos las funciones de Firebase Authentication
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  Auth,
  User
} from 'firebase/auth';
import { environment } from '../../../environments/environment';

/**
 * Interface que define la estructura de los datos del usuario autenticado
 * Incluye los datos básicos del perfil y el token de acceso
 */
export interface UserProfile {
  uid: string;              // ID único del usuario en Firebase
  email: string | null;     // Email del usuario
  displayName: string | null; // Nombre para mostrar
  photoURL: string | null;  // URL de la foto de perfil
  token: string;            // Token JWT de Firebase (lo verás en Network → Headers)
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Instancia de Firebase Auth
  private auth: Auth;
  
  // BehaviorSubject que mantiene el estado del usuario actual
  // Permite que otros componentes se suscriban y reciban actualizaciones
  private currentUserSubject: BehaviorSubject<UserProfile | null>;
  
  // Observable público para que los componentes se suscriban
  public currentUser$: Observable<UserProfile | null>;

  constructor(private router: Router) {
    // Inicializamos Firebase con la configuración del environment
    const app = initializeApp(environment.firebase);
    this.auth = getAuth(app);

    // Inicializamos el subject con null (sin usuario autenticado)
    this.currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Listener que detecta cambios en el estado de autenticación
    // Se ejecuta cuando el usuario hace login o logout
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Usuario autenticado: obtenemos su token y datos
        const token = await user.getIdToken();
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          token: token
        };
        this.currentUserSubject.next(userProfile);
        console.log('✅ Usuario autenticado:', userProfile);
        console.log('🔑 Token JWT:', token);
      } else {
        // Sin usuario autenticado
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Login con Google OAuth2
   * Abre popup de Google para autenticación
   */
  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const provider = new GoogleAuthProvider();
      // Añadimos los permisos (scopes) que necesitamos
      provider.addScope('profile');
      provider.addScope('email');
      
      // Abrimos el popup de autenticación de Google
      const result = await signInWithPopup(this.auth, provider);
      return await this.extractUserProfile(result.user);
    } catch (error: any) {
      console.error('❌ Error en login con Google:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login con GitHub OAuth2
   * Abre popup de GitHub para autenticación
   */
  async loginWithGithub(): Promise<UserProfile> {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('user:email'); // Permiso para leer el email
      
      const result = await signInWithPopup(this.auth, provider);
      return await this.extractUserProfile(result.user);
    } catch (error: any) {
      console.error('❌ Error en login con GitHub:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login con Microsoft OAuth2
   * Abre popup de Microsoft para autenticación
   */
  async loginWithMicrosoft(): Promise<UserProfile> {
    try {
      const provider = new OAuthProvider('microsoft.com');
      provider.addScope('user.read');
      
      const result = await signInWithPopup(this.auth, provider);
      return await this.extractUserProfile(result.user);
    } catch (error: any) {
      console.error('❌ Error en login con Microsoft:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login con Email y Contraseña
   * Método tradicional de autenticación
   */
  async loginWithEmail(email: string, password: string): Promise<UserProfile> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return await this.extractUserProfile(result.user);
    } catch (error: any) {
      console.error('❌ Error en login con Email:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Registro de nuevo usuario con Email y Contraseña
   * Crea una cuenta nueva en Firebase Authentication
   */
  async registerWithEmail(email: string, password: string, displayName?: string): Promise<UserProfile> {
    try {
      // Importamos createUserWithEmailAndPassword dinámicamente
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      
      // Creamos el usuario en Firebase
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Si se proporcionó un nombre, actualizamos el perfil
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
        // Recargamos el usuario para obtener los datos actualizados
        await result.user.reload();
      }
      
      console.log('✅ Usuario registrado exitosamente');
      return await this.extractUserProfile(result.user);
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Extrae los datos del usuario y obtiene el token JWT
   * Este token es el que verás en Network → Headers → Authorization
   */
  private async extractUserProfile(user: User): Promise<UserProfile> {
    // Obtenemos el token JWT (ID Token) de Firebase
    const token = await user.getIdToken();
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      token: token
    };

    console.log('📋 Perfil extraído:', {
      nombre: userProfile.displayName,
      email: userProfile.email,
      foto: userProfile.photoURL,
      uid: userProfile.uid
    });
    console.log('🔐 Token para headers:', token);

    return userProfile;
  }

  /**
   * Obtiene el token actual del usuario autenticado
   * El interceptor HTTP usará este método para añadir el token a las peticiones
   * @param forceRefresh Si es true, solicita un nuevo token a Firebase
   */
  async getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken(forceRefresh);
    }
    return null;
  }

  /**
   * Obtiene el usuario actual desde el BehaviorSubject
   */
  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Cierra la sesión del usuario
   * Limpia el estado y redirige al login
   */
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      console.log('👋 Sesión cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Maneja y traduce los errores de Firebase a mensajes amigables
   */
  private handleAuthError(error: any): Error {
    let message = 'Error de autenticación';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'auth/email-already-in-use':
        message = 'El email ya está en uso';
        break;
      case 'auth/weak-password':
        message = 'La contraseña es muy débil';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Ventana de autenticación cerrada';
        break;
      case 'auth/cancelled-popup-request':
        message = 'Solicitud cancelada';
        break;
      case 'auth/account-exists-with-different-credential':
        message = 'Esta cuenta ya existe con otro proveedor. Usa el método de login original.';
        break;
      default:
        message = error.message || 'Error desconocido';
    }
    
    return new Error(message);
  }
}
