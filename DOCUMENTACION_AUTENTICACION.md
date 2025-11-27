# 🚀 Documentación de Autenticación y Componentes Globales

## 📁 Estructura del Proyecto

```
src/app/
├── services/
│   ├── auth/
│   │   └── auth.service.ts          ✅ Autenticación OAuth2 y Email/Password
│   ├── alert/
│   │   └── alert.service.ts         ✅ Servicio de notificaciones toast
│   ├── loader/
│   │   └── loader.service.ts        ✅ Servicio de spinner global
│   └── modal/
│       └── modal.service.ts         ✅ Servicio de modales
│
├── interceptors/
│   └── auth.interceptor.ts          ✅ Inyecta token JWT en HTTP headers
│
├── guards/
│   └── auth.guard.ts                ✅ Protege rutas privadas
│
├── components/
│   ├── navbar/                      ✅ Barra superior con avatar de usuario
│   ├── sidebar/                     ✅ Menú lateral de navegación
│   ├── footer/                      ✅ Pie de página
│   ├── alert/                       ✅ Componente de notificaciones
│   ├── loader/                      ✅ Componente de spinner
│   ├── modal/                       ✅ Componente modal genérico
│   └── data-table/                  ✅ Tabla con paginación y búsqueda
│
└── layouts/
    ├── admin-layout/                ✅ Layout principal (Navbar + Sidebar + Footer + Content)
    └── auth-layout/                 ✅ Layout para login/register
```

---

## 🔐 1. AUTENTICACIÓN

### **AuthService** (`services/auth/auth.service.ts`)

#### **Métodos OAuth2:**

```typescript
// Login con Google
const userProfile = await this.authService.loginWithGoogle();

// Login con GitHub
const userProfile = await this.authService.loginWithGithub();

// Login con Microsoft
const userProfile = await this.authService.loginWithMicrosoft();
```

#### **Métodos Email/Password:**

```typescript
// REGISTRO (crea una cuenta nueva)
const userProfile = await this.authService.registerWithEmail(
  'usuario@mail.com',
  'password123',
  'Nombre Completo'
);

// LOGIN (accede a cuenta existente)
const userProfile = await this.authService.loginWithEmail(
  'usuario@mail.com',
  'password123'
);
```

#### **Obtener Token JWT:**

```typescript
// Obtener token para peticiones HTTP
const token = await this.authService.getIdToken();
// Resultado: "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
```

#### **Verificar Autenticación:**

```typescript
// Verificar si hay usuario autenticado
if (this.authService.isAuthenticated()) {
  console.log('Usuario autenticado');
}
```

#### **Obtener Usuario Actual:**

```typescript
// Suscribirse a cambios del usuario (reactivo)
this.authService.currentUser$.subscribe(user => {
  if (user) {
    console.log('Nombre:', user.displayName);
    console.log('Email:', user.email);
    console.log('Foto:', user.photoURL);
  }
});
```

#### **Logout:**

```typescript
// Cerrar sesión
await this.authService.logout();
```

---

## 🔒 2. INTERCEPTOR HTTP

### **AuthInterceptor** (`interceptors/auth.interceptor.ts`)

**¿Qué hace?**
- Intercepta **TODAS** las peticiones HTTP automáticamente
- Añade el header `Authorization: Bearer [token]` a peticiones hacia tu API
- No añade token a peticiones externas (Google, Firebase, etc.)

**Configuración:** Ya está registrado en `app.module.ts`:
```typescript
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
]
```

**Ver el token en DevTools:**
1. Abre DevTools → Network
2. Haz una petición HTTP a tu backend
3. Click en la petición → Headers
4. Busca: `Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...`

---

## 🛡️ 3. GUARD DE RUTAS

### **AuthGuard** (`guards/auth.guard.ts`)

**Protege rutas privadas del sistema**

#### **Uso en `app-routing.module.ts`:**

```typescript
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Ruta pública (sin protección)
  { path: 'login', component: LoginComponent },
  
  // Ruta protegida (solo usuarios autenticados)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]  // ← Protección
  },
  
  // Layout completo protegido
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],  // ← Protege todo el layout
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'productos', component: ProductosComponent }
    ]
  }
];
```

**¿Qué hace?**
- Si el usuario **está autenticado** → permite el acceso
- Si **NO está autenticado** → redirige a `/login`
- Guarda la URL a la que intentó acceder para redirigir después del login

---

## 🔔 4. COMPONENTE ALERT (Notificaciones)

### **AlertService** (`services/alert/alert.service.ts`)

#### **Tipos de alertas:**

```typescript
// Inyectar en cualquier componente
constructor(private alertService: AlertService) {}

// 1. Alerta de ÉXITO (verde)
this.alertService.success('Usuario creado correctamente');

// 2. Alerta de ERROR (roja)
this.alertService.error('No se pudo conectar con el servidor');

// 3. Alerta de ADVERTENCIA (amarilla)
this.alertService.warning('El token expirará en 5 minutos');

// 4. Alerta de INFORMACIÓN (azul)
this.alertService.info('Nueva actualización disponible');
```

#### **Ejemplo real en un CRUD:**

```typescript
guardarUsuario() {
  this.http.post('/api/usuarios', this.usuario).subscribe(
    response => {
      this.alertService.success('Usuario guardado correctamente');
    },
    error => {
      this.alertService.error('Error al guardar usuario');
    }
  );
}
```

**Características:**
- Se muestran en la **esquina superior derecha**
- Se cierran automáticamente después de **5 segundos**
- Puedes cerrarlas manualmente con el botón **×**
- Puedes tener **múltiples alertas** simultáneas

---

## ⏳ 5. COMPONENTE LOADER (Spinner)

### **LoaderService** (`services/loader/loader.service.ts`)

#### **Mostrar/ocultar loader:**

```typescript
// Inyectar en cualquier componente
constructor(private loaderService: LoaderService) {}

// Mostrar loader
this.loaderService.show();

// Ocultar loader
this.loaderService.hide();
```

#### **Ejemplo con async/await:**

```typescript
async cargarDatos() {
  this.loaderService.show();
  
  try {
    const datos = await this.http.get('/api/datos').toPromise();
    // Procesar datos
  } catch (error) {
    this.alertService.error('Error al cargar datos');
  } finally {
    this.loaderService.hide();  // ← Siempre ocultar en finally
  }
}
```

#### **Ejemplo con Observables:**

```typescript
guardarDatos() {
  this.loaderService.show();
  
  this.http.post('/api/datos', this.datos).subscribe(
    response => {
      this.loaderService.hide();
      this.alertService.success('Guardado correctamente');
    },
    error => {
      this.loaderService.hide();
      this.alertService.error('Error al guardar');
    }
  );
}
```

**Características:**
- Cubre **toda la pantalla** con un overlay oscuro
- Muestra un **spinner animado** en el centro
- **Bloquea la interacción** del usuario mientras carga

---

## 💬 6. COMPONENTE MODAL (Ventanas emergentes)

### **ModalService** (`services/modal/modal.service.ts`)

#### **Modal de Confirmación:**

```typescript
// Inyectar en cualquier componente
constructor(
  private modalService: ModalService,
  private http: HttpClient
) {}

eliminarUsuario(id: number) {
  this.modalService.confirm(
    'Confirmar eliminación',
    '¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.',
    () => {
      // Callback cuando confirma
      this.http.delete(`/api/usuarios/${id}`).subscribe(
        () => this.alertService.success('Usuario eliminado'),
        () => this.alertService.error('Error al eliminar')
      );
    },
    () => {
      // Callback cuando cancela (opcional)
      console.log('Cancelado');
    }
  );
}
```

#### **Modal Informativo:**

```typescript
this.modalService.info(
  'Bienvenido',
  'Esta es tu primera vez en el sistema. Te recomendamos configurar tu perfil.'
);
```

#### **Modal de Advertencia:**

```typescript
this.modalService.warning(
  'Sesión por expirar',
  'Tu sesión expirará en 5 minutos. Por favor guarda tus cambios.'
);
```

#### **Modal Personalizado:**

```typescript
this.modalService.show({
  title: 'Título personalizado',
  message: 'Contenido del modal',
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  showCancel: true,
  onConfirm: () => console.log('Confirmado'),
  onCancel: () => console.log('Cancelado')
});
```

**Características:**
- **Fondo oscuro** que cubre la pantalla
- Se puede cerrar con **ESC** o click fuera
- Botones personalizables
- Callbacks para confirmar/cancelar

---

## 📊 7. COMPONENTE DATA TABLE (Tabla con paginación)

### **DataTableComponent** (`components/data-table/data-table.component.ts`)

#### **Uso básico:**

**1. En tu componente TypeScript:**

```typescript
import { TableColumn } from 'src/app/components/data-table/data-table.component';

export class UsuariosComponent {
  
  // Array de datos
  usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@mail.com', rol: 'Admin' },
    { id: 2, nombre: 'María García', email: 'maria@mail.com', rol: 'User' },
    { id: 3, nombre: 'Pedro López', email: 'pedro@mail.com', rol: 'User' }
  ];
  
  // Definición de columnas
  columnas: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'nombre', header: 'Nombre Completo', sortable: true },
    { field: 'email', header: 'Correo Electrónico', sortable: true },
    { field: 'rol', header: 'Rol', sortable: false }
  ];
  
  constructor(
    private http: HttpClient,
    private modalService: ModalService,
    private alertService: AlertService
  ) {}
  
  // Maneja el click en Editar
  editarUsuario(usuario: any) {
    console.log('Editar:', usuario);
    // Abrir formulario de edición
  }
  
  // Maneja el click en Eliminar
  eliminarUsuario(usuario: any) {
    this.modalService.confirm(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar a ${usuario.nombre}?`,
      () => {
        this.http.delete(`/api/usuarios/${usuario.id}`).subscribe(
          () => {
            this.alertService.success('Usuario eliminado');
            this.cargarUsuarios();  // Recargar tabla
          },
          () => this.alertService.error('Error al eliminar')
        );
      }
    );
  }
}
```

**2. En tu componente HTML:**

```html
<app-data-table
  [data]="usuarios"
  [columns]="columnas"
  [itemsPerPage]="10"
  [searchPlaceholder]="'Buscar usuarios...'"
  (onEdit)="editarUsuario($event)"
  (onDelete)="eliminarUsuario($event)">
</app-data-table>
```

#### **Propiedades del componente:**

| Propiedad | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `data` | `any[]` | Array de datos a mostrar | `[]` |
| `columns` | `TableColumn[]` | Definición de columnas | `[]` |
| `itemsPerPage` | `number` | Registros por página | `10` |
| `searchPlaceholder` | `string` | Texto del input de búsqueda | `'Buscar...'` |
| `showActions` | `boolean` | Mostrar columna de acciones | `true` |

#### **Eventos del componente:**

| Evento | Parámetro | Descripción |
|--------|-----------|-------------|
| `onEdit` | `any` | Se dispara al hacer click en Editar |
| `onDelete` | `any` | Se dispara al hacer click en Eliminar |

#### **Características:**

- ✅ **Búsqueda**: Busca en todas las columnas definidas
- ✅ **Ordenamiento**: Click en header para ordenar (asc/desc)
- ✅ **Paginación**: Navega entre páginas con flechas o números
- ✅ **Acciones**: Botones de Editar y Eliminar en cada fila
- ✅ **Responsivo**: Se adapta a móviles y tablets

---

## 📐 8. LAYOUT PRINCIPAL

### **AdminLayoutComponent** (`layouts/admin-layout/`)

**Estructura:**

```
┌─────────────────────────────────────────┐
│          NAVBAR (arriba)                │
├──────┬──────────────────────────────────┤
│      │                                  │
│ SIDE │         CONTENIDO                │
│ BAR  │      (router-outlet)             │
│      │                                  │
├──────┴──────────────────────────────────┤
│          FOOTER (abajo)                 │
└─────────────────────────────────────────┘

+ Alert (esquina superior derecha)
+ Loader (overlay completo)
+ Modal (centrado)
+ Chatbot (flotante)
```

**Componentes incluidos:**
- `<app-navbar>` - Avatar del usuario, logout
- `<app-sidebar>` - Menú de navegación
- `<app-footer>` - Información del sistema
- `<app-alert>` - Notificaciones toast
- `<app-loader>` - Spinner global
- `<app-modal>` - Modales
- `<app-chatbot>` - Chatbot flotante

---

## 🎓 9. GUÍA PARA TU COMPAÑERO (Persona 2 - CRUDs)

### **Pasos para crear un nuevo CRUD:**

#### **1. Generar componente:**
```bash
ng generate component pages/productos
```

#### **2. En `productos.component.ts`:**

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableColumn } from 'src/app/components/data-table/data-table.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  
  productos: any[] = [];
  
  columnas: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'nombre', header: 'Producto', sortable: true },
    { field: 'precio', header: 'Precio', sortable: true },
    { field: 'stock', header: 'Stock', sortable: true }
  ];

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loaderService.show();
    
    this.http.get<any[]>('/api/productos').subscribe(
      response => {
        this.productos = response;
        this.loaderService.hide();
      },
      error => {
        this.loaderService.hide();
        this.alertService.error('Error al cargar productos');
      }
    );
  }

  editarProducto(producto: any): void {
    console.log('Editar:', producto);
    // Implementar edición
  }

  eliminarProducto(producto: any): void {
    this.modalService.confirm(
      'Confirmar eliminación',
      `¿Eliminar producto "${producto.nombre}"?`,
      () => {
        this.loaderService.show();
        
        this.http.delete(`/api/productos/${producto.id}`).subscribe(
          () => {
            this.loaderService.hide();
            this.alertService.success('Producto eliminado');
            this.cargarProductos();
          },
          () => {
            this.loaderService.hide();
            this.alertService.error('Error al eliminar');
          }
        );
      }
    );
  }
}
```

#### **3. En `productos.component.html`:**

```html
<div class="header bg-gradient-primary pb-8 pt-5 pt-md-8">
  <div class="container-fluid">
    <div class="header-body">
      <h1 class="text-white">Gestión de Productos</h1>
    </div>
  </div>
</div>

<div class="container-fluid mt--7">
  <div class="row">
    <div class="col">
      <app-data-table
        [data]="productos"
        [columns]="columnas"
        [itemsPerPage]="10"
        [searchPlaceholder]="'Buscar productos...'"
        (onEdit)="editarProducto($event)"
        (onDelete)="eliminarProducto($event)">
      </app-data-table>
    </div>
  </div>
</div>
```

#### **4. Agregar ruta en `admin-layout.routing.ts`:**

```typescript
{ path: 'productos', component: ProductosComponent }
```

---

## ✅ 10. CHECKLIST DE ENTREGABLES

### **Autenticación:**
- ✅ OAuth2 (Google, Microsoft, GitHub) implementado
- ✅ Login/Register con Email/Password
- ✅ Token JWT extraído y disponible
- ✅ Token visible en HTTP headers (DevTools → Network)
- ✅ Información del usuario (foto, nombre, email) en Navbar
- ✅ Logout funcional

### **Seguridad:**
- ✅ AuthInterceptor inyectando token automáticamente
- ✅ AuthGuard protegiendo rutas privadas
- ✅ Redirección a /login si no está autenticado

### **Layout:**
- ✅ AdminLayout completo (Navbar + Sidebar + Footer)
- ✅ Avatar del usuario en Navbar
- ✅ Menú lateral de navegación
- ✅ Pie de página

### **Componentes Globales:**
- ✅ AlertComponent (notificaciones toast)
- ✅ LoaderComponent (spinner global)
- ✅ ModalComponent (ventanas emergentes)
- ✅ DataTableComponent (tabla con paginación)

### **Documentación:**
- ✅ Código completamente comentado en español
- ✅ Ejemplos de uso en cada servicio
- ✅ Guía para el compañero que hará los CRUDs

---

## 🚀 11. COMANDOS IMPORTANTES

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

# Compilar para producción
ng build --prod

# Generar nuevo componente
ng generate component pages/mi-componente

# Generar nuevo servicio
ng generate service services/mi-servicio

# Generar nuevo guard
ng generate guard guards/mi-guard

# Generar nuevo interceptor
ng generate interceptor interceptors/mi-interceptor
```

---

## 📞 12. SOPORTE

Si encuentras problemas o necesitas ayuda:

1. **Revisa la consola del navegador** (F12 → Console)
2. **Verifica el Network** (F12 → Network) para ver peticiones HTTP
3. **Revisa los logs** en la terminal donde corre `ng serve`

---

## 🎯 13. PRÓXIMOS PASOS

Para tu compañero (Persona 2):

1. Crear CRUDs usando `<app-data-table>`
2. Usar `AlertService` para notificaciones
3. Usar `LoaderService` mientras carga datos
4. Usar `ModalService` para confirmaciones
5. Todas las rutas deben usar `canActivate: [AuthGuard]`

---

**¡Todo listo para comenzar a desarrollar! 🎉**
