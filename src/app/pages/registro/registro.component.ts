import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from './../../services/auth.service';
import { UsuarioModel } from './../../models/usuario.model';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

    usuario: UsuarioModel;
    saveUser = false;
    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.usuario = new UsuarioModel();
        // this.usuario.email = 'jaime@gmail.com';
    }
    onSubmit(formP: NgForm) {
        if (formP.invalid) {
            return;
        }
        Swal.fire({
            allowOutsideClick: false,
            type: 'info',
            text: 'Espere por favor...'
        });
        Swal.showLoading();
        // console.log('formulario enviado');
        // console.log(this.usuario);
        // console.log(formP);
        this.auth.nuevoUsuario(this.usuario).subscribe(resp => {
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
        }); // se subscribe a la respuesta que firebase nos envie
    }
}
