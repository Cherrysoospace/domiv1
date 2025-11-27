# 🚀 CÓMO INICIAR EL PROYECTO COMPLETO

## ✅ Estado Actual

### **YA IMPLEMENTADO:**
- ✅ Autenticación OAuth2 (Google, GitHub, Microsoft)
- ✅ Login y Register con Email/Password
- ✅ Token JWT de Firebase
- ✅ AuthService completo
- ✅ AuthInterceptor que inyecta token en headers HTTP
- ✅ AuthGuard protegiendo rutas
- ✅ Componentes globales (Alert, Loader, Modal, DataTable)
- ✅ Layout completo (Navbar, Sidebar, Footer)
- ✅ ApiService para conectar con backend
- ✅ Botón de prueba en Dashboard

---

## 📋 PASOS PARA INICIAR

### **PASO 1: Iniciar el Backend (Flask)**

Abre una terminal y ejecuta:

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate       # Activar entorno virtual
python run.py                   # Iniciar Flask
```

**Resultado esperado:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

✅ El backend estará corriendo en: **http://localhost:5000**

---

### **PASO 2: Iniciar el Frontend (Angular)**

Abre OTRA terminal y ejecuta:

```bash
# Terminal 2: Frontend
cd frontend
ng serve
```

**Resultado esperado:**
```
Angular Live Development Server is listening on localhost:4200
✔ Compiled successfully.
```

✅ El frontend estará corriendo en: **http://localhost:4200**

---

### **PASO 3: Abrir la Aplicación**

1. Abre tu navegador en: **http://localhost:4200**
2. Verás la página de Login
3. Haz login con cualquier método:
   - 🔵 Google
   - ⚫ GitHub  
   - 🔷 Microsoft
   - 📧 Email/Password

---

### **PASO 4: Verificar el Token JWT**

Una vez logueado:

1. Serás redirigido al **Dashboard**
2. Verás un panel verde con el botón: **"🧪 PROBAR CONEXIÓN CON BACKEND"**
3. **Abre DevTools** (F12) → Tab **"Console"** y **"Network"**
4. Click en el botón de prueba
5. El sistema hará 3 peticiones al backend:
   - GET `/restaurants`
   - GET `/products`
   - GET `/orders`

---

### **PASO 5: Ver el Token en DevTools**

En la pestaña **Network**:

1. Click en cualquier petición (ej: `restaurants`)
2. Click en la tab **"Headers"**
3. Busca la sección **"Request Headers"**
4. Verás: `Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...`

✅ **Ese es tu token JWT de Firebase!**

---

## 🔍 VERIFICACIÓN COMPLETA

### **En la Consola del Navegador verás:**

```
═══════════════════════════════════════════════════════════════
🧪 INICIANDO PRUEBA DE CONEXIÓN FRONTEND → BACKEND
═══════════════════════════════════════════════════════════════
✅ Usuario autenticado: Tu Nombre
📧 Email: tu@email.com
═══════════════════════════════════════════════════════════════
🔑 TOKEN JWT OBTENIDO
═══════════════════════════════════════════════════════════════
Token completo (primeros 200 caracteres):
eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...
═══════════════════════════════════════════════════════════════
📡 HACIENDO PETICIONES AL BACKEND...
Base URL: http://localhost:5000
═══════════════════════════════════════════════════════════════

📤 Petición 1/3: Restaurantes
   URL: http://localhost:5000/restaurants
   Header: Authorization: Bearer eyJhbGci...
✅ Restaurantes: Respuesta exitosa

📤 Petición 2/3: Productos
   URL: http://localhost:5000/products
   Header: Authorization: Bearer eyJhbGci...
✅ Productos: Respuesta exitosa

📤 Petición 3/3: Pedidos
   URL: http://localhost:5000/orders
   Header: Authorization: Bearer eyJhbGci...
✅ Pedidos: Respuesta exitosa

═══════════════════════════════════════════════════════════════
🎉 PRUEBA COMPLETADA: 3 exitosas, 0 fallidas
═══════════════════════════════════════════════════════════════
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **❌ Error: "Backend no está corriendo"**

**Solución:**
```bash
cd backend
source venv/bin/activate
python run.py
```

Verifica que aparezca:
```
* Running on http://127.0.0.1:5000
```

---

### **❌ Error: "CORS bloqueado"**

**Causa:** El backend no tiene CORS habilitado

**Verificación:** Abre `backend/app/__init__.py` y verifica que tenga:

```python
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # ← Debe existir esta línea
    # ...
```

**Si no existe CORS, instálalo:**
```bash
cd backend
source venv/bin/activate
pip install flask-cors
```

---

### **❌ Error: "Token no aparece en headers"**

**Verificación:**

1. ¿Hiciste login? Verifica que en el Navbar aparezca tu foto y nombre
2. ¿El interceptor está registrado? Verifica `app.module.ts`:

```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
```

3. ¿La petición va a localhost:5000? El interceptor SOLO añade token a URLs de localhost:5000

---

### **❌ Error: "Cannot GET /api/restaurants"**

**Causa:** Las rutas del backend no tienen prefijo `/api/`

**Solución:** Las rutas del backend son:
- `/restaurants` (sin /api/)
- `/products` (sin /api/)
- `/orders` (sin /api/)

El frontend ya está configurado para usar estas rutas sin `/api/`

---

## 📊 ENDPOINTS DISPONIBLES DEL BACKEND

Según el código del backend, estos son los endpoints disponibles:

### **Restaurantes:**
- `GET /restaurants` - Listar todos
- `GET /restaurants/<id>` - Obtener uno
- `POST /restaurants` - Crear
- `PUT /restaurants/<id>` - Actualizar
- `DELETE /restaurants/<id>` - Eliminar

### **Productos:**
- `GET /products`
- `GET /products/<id>`
- `POST /products`
- `PUT /products/<id>`
- `DELETE /products/<id>`

### **Menús:**
- `GET /menus`
- `GET /menus/<id>`
- `POST /menus`
- `PUT /menus/<id>`
- `DELETE /menus/<id>`

### **Pedidos:**
- `GET /orders`
- `GET /orders/<id>`
- `POST /orders`
- `PUT /orders/<id>`
- `DELETE /orders/<id>`

### **Clientes:**
- `GET /customers`
- `GET /customers/<id>`
- `POST /customers`
- `PUT /customers/<id>`
- `DELETE /customers/<id>`

### **Conductores:**
- `GET /drivers`
- `GET /drivers/<id>`
- `POST /drivers`
- `PUT /drivers/<id>`
- `DELETE /drivers/<id>`

### **Motocicletas:**
- `GET /motorcycles`
- `GET /motorcycles/<id>`
- `POST /motorcycles`
- `PUT /motorcycles/<id>`
- `DELETE /motorcycles/<id>`

### **Turnos:**
- `GET /shifts`
- `GET /shifts/<id>`
- `POST /shifts`
- `PUT /shifts/<id>`
- `DELETE /shifts/<id>`

### **Direcciones:**
- `GET /addresses`
- `GET /addresses/<id>`
- `POST /addresses`
- `PUT /addresses/<id>`
- `DELETE /addresses/<id>`

---

## 🎯 EJEMPLO DE USO EN COMPONENTES

### **Usando ApiService:**

```typescript
import { ApiService } from 'src/app/services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

export class RestaurantesComponent {
  
  restaurantes: any[] = [];
  
  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private loaderService: LoaderService
  ) {}
  
  ngOnInit() {
    this.cargarRestaurantes();
  }
  
  // GET - Listar todos
  cargarRestaurantes() {
    this.loaderService.show();
    
    this.apiService.getRestaurants().subscribe(
      data => {
        this.restaurantes = data;
        this.loaderService.hide();
        this.alertService.success('Restaurantes cargados');
      },
      error => {
        this.loaderService.hide();
        this.alertService.error('Error al cargar restaurantes');
      }
    );
  }
  
  // POST - Crear nuevo
  crearRestaurante(restaurante: any) {
    this.loaderService.show();
    
    this.apiService.createRestaurant(restaurante).subscribe(
      data => {
        this.loaderService.hide();
        this.alertService.success('Restaurante creado');
        this.cargarRestaurantes();
      },
      error => {
        this.loaderService.hide();
        this.alertService.error('Error al crear');
      }
    );
  }
  
  // DELETE - Eliminar
  eliminarRestaurante(id: number) {
    this.modalService.confirm(
      'Confirmar eliminación',
      '¿Estás seguro?',
      () => {
        this.apiService.deleteRestaurant(id).subscribe(
          () => {
            this.alertService.success('Eliminado');
            this.cargarRestaurantes();
          },
          error => {
            this.alertService.error('Error al eliminar');
          }
        );
      }
    );
  }
}
```

---

## ✅ CHECKLIST FINAL

Antes de continuar, verifica que:

- [ ] Backend corriendo en localhost:5000
- [ ] Frontend corriendo en localhost:4200
- [ ] Login funciona (OAuth o Email/Password)
- [ ] Avatar del usuario aparece en Navbar
- [ ] Botón de prueba en Dashboard funciona
- [ ] Token aparece en DevTools → Network → Headers
- [ ] Consola muestra logs del interceptor
- [ ] Peticiones al backend son exitosas

---

**¡Todo listo para desarrollar! 🎉**

Ahora puedes:
1. Crear CRUDs usando `ApiService`
2. Usar `AlertService` para notificaciones
3. Usar `LoaderService` mientras cargas datos
4. Usar `ModalService` para confirmaciones
5. Usar `<app-data-table>` para mostrar datos

---

**Documentación adicional:**
- `DOCUMENTACION_AUTENTICACION.md` - Guía completa de autenticación
- `PLANTILLA_CRUD.md` - Plantilla para crear CRUDs
