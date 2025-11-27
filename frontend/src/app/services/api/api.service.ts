import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * SERVICIO API BASE
 * 
 * Propósito: Centralizar todas las peticiones HTTP al backend Flask
 * Incluye métodos para GET, POST, PUT, DELETE
 * 
 * El interceptor AuthInterceptor añadirá automáticamente el token
 * de Firebase a todas las peticiones que usen este servicio
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // URL base del backend (configurada en environment.ts)
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET - Obtener recursos
   * @param endpoint Ruta del endpoint (ej: '/restaurants', '/products')
   */
  get<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    console.log(`📡 GET: ${url}`);
    return this.http.get<T>(url);
  }

  /**
   * GET BY ID - Obtener un recurso específico
   * @param endpoint Ruta del endpoint (ej: '/restaurants', '/products')
   * @param id ID del recurso
   */
  getById<T>(endpoint: string, id: number | string): Observable<T> {
    const url = `${this.apiUrl}${endpoint}/${id}`;
    console.log(`📡 GET BY ID: ${url}`);
    return this.http.get<T>(url);
  }

  /**
   * POST - Crear nuevo recurso
   * @param endpoint Ruta del endpoint
   * @param data Datos a enviar
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    console.log(`📡 POST: ${url}`, data);
    return this.http.post<T>(url, data);
  }

  /**
   * PUT - Actualizar recurso existente
   * @param endpoint Ruta del endpoint
   * @param id ID del recurso
   * @param data Datos actualizados
   */
  put<T>(endpoint: string, id: number | string, data: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}/${id}`;
    console.log(`📡 PUT: ${url}`, data);
    return this.http.put<T>(url, data);
  }

  /**
   * DELETE - Eliminar recurso
   * @param endpoint Ruta del endpoint
   * @param id ID del recurso
   */
  delete<T>(endpoint: string, id: number | string): Observable<T> {
    const url = `${this.apiUrl}${endpoint}/${id}`;
    console.log(`📡 DELETE: ${url}`);
    return this.http.delete<T>(url);
  }

  /**
   * Métodos específicos para los endpoints del backend
   */

  // RESTAURANTS
  getRestaurants(): Observable<any[]> {
    return this.get('/restaurants');
  }

  getRestaurant(id: number): Observable<any> {
    return this.getById('/restaurants', id);
  }

  createRestaurant(data: any): Observable<any> {
    return this.post('/restaurants', data);
  }

  updateRestaurant(id: number, data: any): Observable<any> {
    return this.put('/restaurants', id, data);
  }

  deleteRestaurant(id: number): Observable<any> {
    return this.delete('/restaurants', id);
  }

  // PRODUCTS
  getProducts(): Observable<any[]> {
    return this.get('/products');
  }

  getProduct(id: number): Observable<any> {
    return this.getById('/products', id);
  }

  createProduct(data: any): Observable<any> {
    return this.post('/products', data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.put('/products', id, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.delete('/products', id);
  }

  // CUSTOMERS
  getCustomers(): Observable<any[]> {
    return this.get('/customers');
  }

  getCustomer(id: number): Observable<any> {
    return this.getById('/customers', id);
  }

  createCustomer(data: any): Observable<any> {
    return this.post('/customers', data);
  }

  updateCustomer(id: number, data: any): Observable<any> {
    return this.put('/customers', id, data);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.delete('/customers', id);
  }

  // MENUS
  getMenus(): Observable<any[]> {
    return this.get('/menus');
  }

  getMenu(id: number): Observable<any> {
    return this.getById('/menus', id);
  }

  createMenu(data: any): Observable<any> {
    return this.post('/menus', data);
  }

  updateMenu(id: number, data: any): Observable<any> {
    return this.put('/menus', id, data);
  }

  deleteMenu(id: number): Observable<any> {
    return this.delete('/menus', id);
  }

  // ORDERS
  getOrders(): Observable<any[]> {
    return this.get('/orders');
  }

  getOrder(id: number): Observable<any> {
    return this.getById('/orders', id);
  }

  createOrder(data: any): Observable<any> {
    return this.post('/orders', data);
  }

  updateOrder(id: number, data: any): Observable<any> {
    return this.put('/orders', id, data);
  }

  deleteOrder(id: number): Observable<any> {
    return this.delete('/orders', id);
  }

  // DRIVERS
  getDrivers(): Observable<any[]> {
    return this.get('/drivers');
  }

  getDriver(id: number): Observable<any> {
    return this.getById('/drivers', id);
  }

  createDriver(data: any): Observable<any> {
    return this.post('/drivers', data);
  }

  updateDriver(id: number, data: any): Observable<any> {
    return this.put('/drivers', id, data);
  }

  deleteDriver(id: number): Observable<any> {
    return this.delete('/drivers', id);
  }

  // MOTORCYCLES
  getMotorcycles(): Observable<any[]> {
    return this.get('/motorcycles');
  }

  getMotorcycle(id: number): Observable<any> {
    return this.getById('/motorcycles', id);
  }

  createMotorcycle(data: any): Observable<any> {
    return this.post('/motorcycles', data);
  }

  updateMotorcycle(id: number, data: any): Observable<any> {
    return this.put('/motorcycles', id, data);
  }

  deleteMotorcycle(id: number): Observable<any> {
    return this.delete('/motorcycles', id);
  }

  // SHIFTS
  getShifts(): Observable<any[]> {
    return this.get('/shifts');
  }

  getShift(id: number): Observable<any> {
    return this.getById('/shifts', id);
  }

  createShift(data: any): Observable<any> {
    return this.post('/shifts', data);
  }

  updateShift(id: number, data: any): Observable<any> {
    return this.put('/shifts', id, data);
  }

  deleteShift(id: number): Observable<any> {
    return this.delete('/shifts', id);
  }

  // ADDRESSES
  getAddresses(): Observable<any[]> {
    return this.get('/addresses');
  }

  getAddress(id: number): Observable<any> {
    return this.getById('/addresses', id);
  }

  createAddress(data: any): Observable<any> {
    return this.post('/addresses', data);
  }

  updateAddress(id: number, data: any): Observable<any> {
    return this.put('/addresses', id, data);
  }

  deleteAddress(id: number): Observable<any> {
    return this.delete('/addresses', id);
  }

  // ISSUES
  getIssues(): Observable<any[]> {
    return this.get('/issues');
  }

  getIssue(id: number): Observable<any> {
    return this.getById('/issues', id);
  }

  createIssue(data: any): Observable<any> {
    return this.post('/issues', data);
  }

  updateIssue(id: number, data: any): Observable<any> {
    return this.put('/issues', id, data);
  }

  deleteIssue(id: number): Observable<any> {
    return this.delete('/issues', id);
  }
}
