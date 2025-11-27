import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AuthGuard } from '../../guards/auth.guard';

// 🏍️ RUTAS DE LA PLATAFORMA DE DELIVERY - PROTEGIDAS CON AUTH GUARD
export const AdminLayoutRoutes: Routes = [
    // Dashboard Principal
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    
    // 🍔 Módulos de Negocio (Lazy Loaded)
    { 
        path: 'restaurants', 
        loadChildren: () => import('../../pages/restaurants/restaurants.module').then(m => m.RestaurantsModule),
        canActivate: [AuthGuard]
    },
    { 
        path: 'products', 
        loadChildren: () => import('../../pages/products/products.module').then(m => m.ProductsModule),
        canActivate: [AuthGuard]
    },
    { 
        path: 'menus', 
        loadChildren: () => import('../../pages/menus/menus.module').then(m => m.MenusModule),
        canActivate: [AuthGuard]
    },
    
    // 📦 Gestión de Pedidos
    { 
        path: 'orders', 
        loadChildren: () => import('../../pages/orders/orders.module').then(m => m.OrdersModule),
        canActivate: [AuthGuard]
    },
    
    // 👥 Gestión de Personas
    { 
        path: 'customers', 
        loadChildren: () => import('../../pages/customers/customers.module').then(m => m.CustomersModule),
        canActivate: [AuthGuard]
    },
    { 
        path: 'drivers', 
        loadChildren: () => import('../../pages/drivers/drivers.module').then(m => m.DriversModule),
        canActivate: [AuthGuard]
    },
    
    // 🏍️ Gestión de Recursos
    { 
        path: 'motorcycles', 
        loadChildren: () => import('../../pages/motorcycles/motorcycles.module').then(m => m.MotorcyclesModule),
        canActivate: [AuthGuard]
    },
    { 
        path: 'shifts', 
        loadChildren: () => import('../../pages/shifts/shifts.module').then(m => m.ShiftsModule),
        canActivate: [AuthGuard]
    },
    
    // 📍 Logística
    { 
        path: 'addresses', 
        loadChildren: () => import('../../pages/addresses/addresses.module').then(m => m.AddressesModule),
        canActivate: [AuthGuard]
    },
    
    // ⚠️ Gestión de Incidentes
    { 
        path: 'issues', 
        loadChildren: () => import('../../pages/issues/issues.module').then(m => m.IssuesModule),
        canActivate: [AuthGuard]
    },
    
    // 📸 Fotos
    { 
        path: 'photos', 
        loadChildren: () => import('../../pages/photos/photos.module').then(m => m.PhotosModule),
        canActivate: [AuthGuard]
    }
];
