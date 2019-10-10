import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from } from 'rxjs';

import Swal from 'sweetalert2';

import { AuthService } from './../../services/auth.service';
import { UsuarioModel } from './../../models/usuario.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    usuario: UsuarioModel = new UsuarioModel();
    saveUser = false;

    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit() {
        if (localStorage.getItem('email')) {
            this.usuario.email = localStorage.getItem('email');
            this.saveUser = true;
        }
    }
    login(form: NgForm) {
        if (form.invalid) {
            return;
        }
        Swal.fire({
            allowOutsideClick: false,
            type: 'info',
            text: 'Espere por favor...'
        });
        Swal.showLoading();
        console.log(this.usuario);
        this.auth.login(this.usuario).subscribe(resp => {
            console.log(resp);
            Swal.close();
            if (this.saveUser) {
                localStorage.setItem('email', this.usuario.email);
            }
            this.router.navigateByUrl('/home');
        }, (err) => {
            console.log(err.error.error.message);
            Swal.fire({
                type: 'error',
                title: 'Error al autenticar usuario',
                text: err.error.error.message
            });
        }); // // se subscribe a la respuesta que firebase nos envie
    }
}
