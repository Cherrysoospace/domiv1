import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Componentes de layout
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

// Componentes globales reutilizables
import { AlertComponent } from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { ModalComponent } from './modal/modal.component';
import { DataTableComponent } from './data-table/data-table.component';
import { OrderNotificationComponent } from './order-notification/order-notification.component';

// Módulos externos
import { ChatbotModule } from '../pages/chatbot/chatbot.module';

/**
 * MÓDULO DE COMPONENTES GLOBALES
 * 
 * Este módulo contiene todos los componentes reutilizables del sistema:
 * - Componentes de layout (Navbar, Sidebar, Footer)
 * - Componentes de UI (Alert, Loader, Modal, DataTable)
 * 
 * Todos estos componentes están disponibles para usar en cualquier parte
 * del proyecto que importe este módulo.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,      // Necesario para ngModel en data-table
    RouterModule,
    NgbModule,
    ChatbotModule
  ],
  declarations: [
    // Layout
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    
    // Globales reutilizables
    AlertComponent,
    LoaderComponent,
    ModalComponent,
    DataTableComponent,
    OrderNotificationComponent
  ],
  exports: [
    // Layout
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    
    // Globales reutilizables (para usar en otros módulos)
    AlertComponent,
    LoaderComponent,
    ModalComponent,
    DataTableComponent,
    OrderNotificationComponent,
    
    // Módulos externos
    ChatbotModule
  ]
})
export class ComponentsModule { }
