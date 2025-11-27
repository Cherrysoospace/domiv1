# 🎨 DOCUMENTACIÓN DE PERSONALIZACIÓN DE ESTILOS - DELIVERY PLATFORM

## 📋 Índice
1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografía](#tipografía)
3. [Componentes Personalizados](#componentes-personalizados)
4. [Animaciones](#animaciones)
5. [Responsive Design](#responsive-design)
6. [Guía de Uso](#guía-de-uso)

---

## 🎨 Paleta de Colores

### Colores Principales
```scss
$primary: #FF4B3A;    // Rojo Delivery (color principal de la marca)
$secondary: #FF8C42;  // Naranja (color secundario)
$success: #00B894;    // Verde (pedidos entregados)
$info: #0984E3;       // Azul (pedidos en camino)
$warning: #FDCB6E;    // Amarillo (pedidos pendientes)
$danger: #D63031;     // Rojo Oscuro (pedidos cancelados)
$dark: #2D3436;       // Gris Oscuro (texto y fondos)
$darker: #1E272E;     // Gris Más Oscuro (sidebar)
$light: #F8F9FA;      // Gris Claro (fondos)
```

### Uso Recomendado
- **#FF4B3A (Rojo)**: Botones principales, enlaces importantes, iconos activos
- **#FF8C42 (Naranja)**: Botones secundarios, hover states, iconos de navegación
- **#00B894 (Verde)**: Estados exitosos, pedidos entregados, confirmaciones
- **#D63031 (Rojo Oscuro)**: Errores, eliminaciones, pedidos cancelados
- **#0984E3 (Azul)**: Información, pedidos en camino, notificaciones
- **#FDCB6E (Amarillo)**: Advertencias, pedidos pendientes

---

## 📝 Tipografía

### Fuentes Utilizadas
```css
/* Encabezados */
font-family: 'Poppins', sans-serif;
font-weight: 600-700;

/* Texto de Cuerpo */
font-family: 'Inter', sans-serif;
font-weight: 400-600;

/* Código y Monospace */
font-family: 'Roboto Mono', monospace;
```

### Jerarquía Tipográfica
- **h1**: 2.5rem (40px) - Títulos principales
- **h2**: 2rem (32px) - Subtítulos de sección
- **h3**: 1.75rem (28px) - Títulos de tarjetas
- **h4**: 1.5rem (24px) - Subtítulos de contenido
- **h5**: 1.25rem (20px) - Encabezados pequeños
- **h6**: 1rem (16px) - Etiquetas y texto destacado
- **body**: 0.875rem (14px) - Texto normal

---

## 🧩 Componentes Personalizados

### 1. SIDEBAR (Barra Lateral)
**Archivo**: `sidebar.component.scss`

#### Características:
- Fondo con degradado oscuro (#2D3436 → #1E272E)
- Iconos naranja (#FF8C42)
- Estado activo con gradiente rojo-naranja
- Borde izquierdo de 4px en elemento activo
- Animación de hover con fondo semitransparente

#### Ejemplo de Uso:
```html
<nav class="navbar navbar-vertical">
  <div class="navbar-inner">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link active">
          <i class="ni ni-tv-2"></i>
          <span>Dashboard</span>
        </a>
      </li>
    </ul>
  </div>
</nav>
```

---

### 2. NAVBAR (Barra Superior)
**Archivo**: `navbar.component.scss`

#### Características:
- Fondo blanco con sombra sutil
- Avatar de usuario con borde rojo de 3px
- Badge de notificaciones con animación pulse
- Dropdown con bordes redondeados de 12px
- Menú hamburguesa para móvil

#### Ejemplo de Uso:
```html
<nav class="navbar navbar-top">
  <div class="navbar-user">
    <img src="avatar.jpg" class="user-avatar">
    <span class="badge-notification">5</span>
  </div>
</nav>
```

---

### 3. CARDS (Tarjetas)
**Archivo**: `custom/_card.scss`

#### Características:
- Border-radius de 12px
- Efecto hover con elevación (translateY: -5px)
- Encabezado con degradado rojo-naranja
- Tarjetas de estadísticas con iconos temáticos
- Sombra suave en hover

#### Ejemplo de Uso:
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Pedidos del Día</h3>
  </div>
  <div class="card-body">
    <div class="card-stats">
      <div class="stat-icon bg-primary">
        <i class="ni ni-cart"></i>
      </div>
      <div class="stat-info">
        <span class="stat-number">156</span>
        <span class="stat-label">Pedidos</span>
      </div>
    </div>
  </div>
</div>
```

---

### 4. BUTTONS (Botones)
**Archivo**: `custom/_buttons.scss`

#### Características:
- Border-radius de 8px
- Efecto hover con escala (scale: 1.05)
- Gradientes para botones principales
- Iconos con margen derecho de 8px
- Efecto ripple en click

#### Tipos de Botones:
```html
<!-- Botón Primario -->
<button class="btn btn-primary">
  <i class="ni ni-check-bold"></i>
  Confirmar Pedido
</button>

<!-- Botón Secundario (Outline) -->
<button class="btn btn-secondary">
  <i class="ni ni-cart"></i>
  Ver Carrito
</button>

<!-- Botón de Éxito -->
<button class="btn btn-success">
  <i class="ni ni-delivery-fast"></i>
  Marcar Entregado
</button>

<!-- Botón de Peligro -->
<button class="btn btn-danger">
  <i class="ni ni-fat-remove"></i>
  Cancelar Pedido
</button>

<!-- Botón Flotante (FAB) -->
<button class="btn btn-primary btn-fab">
  <i class="ni ni-plus"></i>
</button>
```

---

### 5. TABLES (Tablas)
**Archivo**: `custom/_tables.scss`

#### Características:
- Encabezado con fondo degradado oscuro
- Hover con fondo rojo claro
- Badges de estado para pedidos
- Botones de acción con colores temáticos
- Paginación personalizada

#### Ejemplo de Uso:
```html
<div class="table-responsive">
  <table class="table table-orders">
    <thead>
      <tr>
        <th>ID Pedido</th>
        <th>Cliente</th>
        <th>Estado</th>
        <th>Total</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="order-id">#12345</td>
        <td>Juan Pérez</td>
        <td>
          <span class="order-status en-camino">En Camino</span>
        </td>
        <td class="order-price">$45.000</td>
        <td>
          <div class="table-actions">
            <button class="btn-action btn-view">
              <i class="ni ni-zoom-split-in"></i>
            </button>
            <button class="btn-action btn-edit">
              <i class="ni ni-ruler-pencil"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### 6. FORMS (Formularios)
**Archivo**: `custom/_forms.scss`

#### Características:
- Inputs con borde de 2px
- Focus con borde rojo y sombra exterior
- Validación visual (verde/rojo)
- Select personalizado con flecha roja
- Switches animados

#### Ejemplo de Uso:
```html
<form>
  <div class="form-group">
    <label>
      <i class="ni ni-circle-08"></i>
      Nombre del Cliente
      <span class="required">*</span>
    </label>
    <input type="text" class="form-control" placeholder="Ingrese el nombre">
    <div class="invalid-feedback">
      <i class="ni ni-fat-remove"></i>
      Este campo es obligatorio
    </div>
  </div>

  <div class="form-group">
    <label>Estado del Pedido</label>
    <select class="form-control">
      <option>Seleccione...</option>
      <option>Pendiente</option>
      <option>En Camino</option>
      <option>Entregado</option>
    </select>
  </div>

  <div class="custom-control custom-switch">
    <input type="checkbox" class="custom-control-input" id="notifications">
    <label class="custom-control-label" for="notifications">
      Notificaciones Activas
    </label>
  </div>

  <button type="submit" class="btn btn-primary">
    <i class="ni ni-send"></i>
    Guardar Pedido
  </button>
</form>
```

---

### 7. BADGES (Insignias)
**Archivo**: `custom/_badge.scss`

#### Características:
- Border-radius de 20px (pill shape)
- Degradados de colores
- Iconos emoji para estados
- Variantes dot y circle
- Animación pulse para estados activos

#### Tipos de Badges:
```html
<!-- Badges de Estado de Pedidos -->
<span class="badge badge-en-camino">En Camino</span>
<span class="badge badge-entregado">Entregado</span>
<span class="badge badge-cancelado">Cancelado</span>
<span class="badge badge-pendiente">Pendiente</span>

<!-- Badges de Colores -->
<span class="badge badge-primary">Destacado</span>
<span class="badge badge-success">Activo</span>
<span class="badge badge-danger">Urgente</span>

<!-- Badge con Dot -->
<span class="badge badge-dot badge-dot-success">En Línea</span>

<!-- Badge Circular -->
<span class="badge badge-circle badge-primary">5</span>

<!-- Badge de Notificación -->
<div style="position: relative;">
  <i class="ni ni-bell"></i>
  <span class="badge-notification">12</span>
</div>

<!-- Badges Outline -->
<span class="badge badge-outline-primary">Nuevo</span>
<span class="badge badge-outline-success">Verificado</span>
```

---

## 🎭 Animaciones

### Animaciones Globales
**Archivo**: `styles.scss`

#### 1. Card Hover
```scss
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

#### 2. Button Hover
```scss
.btn:hover {
  transform: scale(1.05);
}
```

#### 3. Pulse Status
```scss
@keyframes pulse-status {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(9, 132, 227, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(9, 132, 227, 0);
  }
}
```

#### 4. Loader Animation
```scss
.delivery-loader {
  animation: bounce 1.5s infinite;
}
```

#### 5. Float Animation (Sidebar Brand)
```scss
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

---

## 📱 Responsive Design

### Breakpoints
```scss
// Mobile
@media (max-width: 767px) {
  .sidebar { transform: translateX(-100%); }
  .navbar-hamburger { display: block; }
  .card { margin-bottom: 1rem; }
}

// Tablet
@media (min-width: 768px) and (max-width: 991px) {
  .sidebar { width: 250px; }
  .table { font-size: 0.875rem; }
}

// Desktop
@media (min-width: 992px) {
  .sidebar { width: 280px; }
  .main-content { margin-left: 280px; }
}
```

### Clases Responsive Útiles
```html
<!-- Visibilidad -->
<div class="d-none d-md-block">Visible solo en tablet/desktop</div>
<div class="d-md-none">Visible solo en móvil</div>

<!-- Columnas Responsive -->
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">
    <!-- 1 columna móvil, 2 tablet, 3 desktop -->
  </div>
</div>
```

---

## 🚀 Guía de Uso Rápido

### 1. Importar Estilos
Los estilos ya están importados en `styles.scss`, pero puedes verificar:
```scss
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&family=Roboto+Mono&display=swap');
```

### 2. Estructura Básica de Página
```html
<div class="main-content">
  <nav class="navbar navbar-top">
    <!-- Navbar content -->
  </nav>
  
  <div class="header bg-gradient-primary">
    <div class="container-fluid">
      <h1>Título de la Página</h1>
    </div>
  </div>
  
  <div class="container-fluid mt--7">
    <div class="row">
      <div class="col-xl-8">
        <div class="card">
          <!-- Card content -->
        </div>
      </div>
    </div>
  </div>
</div>
```

### 3. Tarjeta de Estadísticas
```html
<div class="card card-stats">
  <div class="card-body">
    <div class="row">
      <div class="col">
        <h5 class="card-title text-uppercase text-muted mb-0">
          Pedidos Hoy
        </h5>
        <span class="h2 font-weight-bold mb-0">156</span>
      </div>
      <div class="col-auto">
        <div class="icon icon-shape bg-primary text-white rounded-circle shadow">
          <i class="ni ni-cart"></i>
        </div>
      </div>
    </div>
    <p class="mt-3 mb-0 text-muted text-sm">
      <span class="text-success mr-2">
        <i class="ni ni-bold-up"></i> 12%
      </span>
      <span class="text-nowrap">Desde ayer</span>
    </p>
  </div>
</div>
```

### 4. Modal de Confirmación
```html
<div class="modal fade" id="confirmModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Confirmar Acción</h5>
        <button type="button" class="close" data-dismiss="modal">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ¿Está seguro que desea continuar?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## 📊 Clases de Utilidad Personalizadas

### Espaciado
```html
<div class="mt-4">Margin Top 1.5rem</div>
<div class="mb-5">Margin Bottom 3rem</div>
<div class="p-3">Padding 1rem</div>
```

### Texto
```html
<p class="text-primary">Texto rojo</p>
<p class="text-success">Texto verde</p>
<p class="font-weight-bold">Texto en negrita</p>
<p class="text-uppercase">Texto en mayúsculas</p>
```

### Fondos
```html
<div class="bg-primary text-white p-3">Fondo rojo</div>
<div class="bg-gradient-primary p-3">Fondo degradado</div>
<div class="bg-light p-3">Fondo claro</div>
```

### Sombras
```html
<div class="shadow-sm">Sombra pequeña</div>
<div class="shadow">Sombra normal</div>
<div class="shadow-lg">Sombra grande</div>
```

---

## 🎨 Paleta Completa de Colores HEX

```
#FF4B3A - Primary Red (Rojo Delivery)
#FF8C42 - Secondary Orange (Naranja)
#00B894 - Success Green (Verde)
#0984E3 - Info Blue (Azul)
#FDCB6E - Warning Yellow (Amarillo)
#D63031 - Danger Red (Rojo Oscuro)
#2D3436 - Dark Gray (Gris Oscuro)
#1E272E - Darker Gray (Gris Más Oscuro)
#F8F9FA - Light Gray (Gris Claro)
#636e72 - Medium Gray (Gris Medio)
#dfe6e9 - Border Gray (Gris Bordes)
#b2bec3 - Placeholder Gray (Gris Placeholders)
```

---

## 📦 Archivos Modificados

1. ✅ `frontend/src/styles.scss` - Estilos globales y fuentes
2. ✅ `frontend/src/assets/scss/custom/_variables.scss` - Variables de colores
3. ✅ `frontend/src/assets/scss/custom/_buttons.scss` - Botones personalizados
4. ✅ `frontend/src/assets/scss/custom/_tables.scss` - Tablas personalizadas
5. ✅ `frontend/src/assets/scss/custom/_forms.scss` - Formularios personalizados
6. ✅ `frontend/src/assets/scss/custom/_badge.scss` - Badges personalizados
7. ✅ `frontend/src/assets/scss/custom/_card.scss` - Tarjetas personalizadas
8. ✅ `frontend/src/app/components/sidebar/sidebar.component.scss` - Sidebar
9. ✅ `frontend/src/app/components/navbar/navbar.component.scss` - Navbar

---

## 🔧 Comandos de Compilación

```bash
# Compilar proyecto
cd frontend
npm run build

# Modo desarrollo
ng serve

# Ver en navegador
http://localhost:4200
```

---

## 📝 Notas Importantes

1. **Consistencia Visual**: Todos los componentes utilizan la misma paleta de colores
2. **Accesibilidad**: Los contrastes de color cumplen con WCAG 2.1 AA
3. **Performance**: Las animaciones usan `transform` y `opacity` para mejor rendimiento
4. **Responsive**: Diseño mobile-first con breakpoints en 768px, 992px, 1200px
5. **Iconos**: Se utiliza la librería Nucleo Icons incluida en Argon Dashboard

---

## 🎯 Próximos Pasos

- [ ] Probar en diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Verificar responsive en dispositivos reales
- [ ] Optimizar imágenes y assets
- [ ] Implementar tema oscuro (opcional)
- [ ] Añadir más animaciones personalizadas

---

**Documentación creada por**: Persona 1 (Autenticación y Estructura Base)  
**Fecha**: 2024  
**Proyecto**: Delivery Platform - DomiV1
