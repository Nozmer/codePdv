import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';  // Substitua pela URL do seu servidor

  constructor(private http: HttpClient) { }

  // login
  register(data: any): Observable<any> {
    const url = `${this.apiUrl}/register`;
    return this.http.post(url, data);
  }

  login(data: any): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, data);
  }

  // menu: manageProduct
  showProductTable(data: any): Observable<any> {
    const url = `${this.apiUrl}/showProductTable`;
    return this.http.post(url, data);
  }

  addProduct(data: any): Observable<any> {
    const url = `${this.apiUrl}/addProduct`;
    return this.http.post(url, data);
  }

  removeProduct(data: any): Observable<any> {
    const url = `${this.apiUrl}/removeProduct`;
    return this.http.post(url, data);
  }

  uploadImageProduct(data: any): Observable<any> {
    const url = `${this.apiUrl}/uploadImageProduct`;
    return this.http.post(url, data);
  }

  // menu: manageEmissionProduct
  addPayment(data: any): Observable<any> {
    const url = `${this.apiUrl}/addPayment`;
    return this.http.post(url, data);
  }

  // menu: manageDashBoard
  salesStatistics(data: any): Observable<any> {
    const url = `${this.apiUrl}/salesStatistics`;
    return this.http.post(url, data);
  }

  productRecent(data: any): Observable<any> {
    const url = `${this.apiUrl}/productRecent`;
    return this.http.post(url, data);
  }
}
