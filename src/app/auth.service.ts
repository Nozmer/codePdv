// auth.service.ts
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private tokenKey = 'token'; // Chave para o localStorage
    private token: string = '';
    private isCashRegister_id: string = '';

    constructor(private jwtHelper: JwtHelperService) {
        if (typeof localStorage !== 'undefined') {
            this.token = localStorage.getItem(this.tokenKey) || '';
        } else {
            // Handle the case when localStorage is not available (e.g., server-side rendering)
            this.token = ''; // Set a default value or handle it as per your requirement
        }
    }
    
    setToken(token: string): void {
        this.token = token;
        localStorage.setItem(this.tokenKey, token);
    }

    getInfoUser(): { owner_id: number, typePlan: number, isCashRegister_id: number, permissions: string } | null {
        if (this.token) {
            const decodedToken = this.jwtHelper.decodeToken(this.token);
            return {owner_id: decodedToken.owner_id, typePlan: decodedToken.typePlan, isCashRegister_id: decodedToken.isCashRegister_id, permissions: decodedToken.permissions};
        }
        return null;
    }

    isAuthenticated(): boolean {
        // Verifica se o token está expirado ou não
        return !this.jwtHelper.isTokenExpired(this.token);
    }

    clearToken(): void {
        this.token = '';
        localStorage.removeItem(this.tokenKey); // Remove o token do localStorage
    }
}
