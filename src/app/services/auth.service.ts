import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { UsuarioModel } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
    private apiKey = 'AIzaSyDuok2OOCHwz8OCYG9NjzqPLhb1RGiSdlE';
    userToken: string;
    // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY] crear usuario
    // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY] login usuario


    constructor(private http: HttpClient) {
        this.leerToken();
    }
    logout() {
        localStorage.removeItem('token');
    }
    login(usuario: UsuarioModel) {
        const authData = {
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
        };
        return this.http.post(
            `${this.url}signInWithPassword?key=${this.apiKey}`, authData
        ).pipe(
            map((resp): any => {
                console.log('map');
                this.guardarToken(resp['idToken']);
                return resp;
            })
        );
    }
    nuevoUsuario(usuario: UsuarioModel) {
        const authData = {
            email: usuario.email,
            nombre: usuario.nombre,
            password: usuario.password,
            returnSecureToken: true
        };
        return this.http.post(
            `${this.url}signUp?key=${this.apiKey}`, authData
        ).pipe(
            map((resp): any => {
                console.log('map');
                this.guardarToken(resp['idToken']);
                return resp;
            })
        );
    }
    private guardarToken(idToken: string) {
        this.userToken = idToken;
        localStorage.setItem('token', idToken);
        const hoy = new Date();
        hoy.setSeconds(3600);
        localStorage.setItem('expire', hoy.getTime().toString());
    }
    leerToken() {
        if (localStorage.getItem('token')) {
            this.userToken = localStorage.getItem('token');
        } else {
            this.userToken = '';
        }
        return this.userToken;
    }
    estaAutenticado(): boolean {
        if (this.userToken.length < 2) {
            return false;
        }
        const expira = Number(localStorage.getItem('expire'));
        const expiraDate = new Date();
        expiraDate.setTime(expira);
        if (expiraDate > new Date()) {
            return true;
        } else {
            return false;
        }
    }
}
