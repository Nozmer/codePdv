// auth.service.ts
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private tokenKey = 'token'; // Chave para o localStorage
    private token: string = '';

    constructor(private jwtHelper: JwtHelperService) { }

    setToken(token: string): void {
        this.token = token;
        localStorage.setItem(this.tokenKey, token);
    }

    getUserId(): number | null {
        if (this.token) {
            const decodedToken = this.jwtHelper.decodeToken(this.token);
            return decodedToken.user_id;
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
