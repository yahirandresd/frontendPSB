
import { RouterModule, Router } from '@angular/router';
import { FormsModule,  } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';


import { AuthService } from './services/auth.service';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, IconFieldModule, InputIconModule, MessageModule, AppFloatingConfigurator, ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading = signal(false);
    errorMessage = signal('');

    async onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');

        const { email, password } = this.loginForm.value;
        const { error } = await this.authService.signIn(email, password);

        this.loading.set(false);

        if (error) {
            this.errorMessage.set('Credenciales incorrectas. Verifica tu email y contraseña.');
            return;
        }

        this.router.navigate(['/dashboard']);
    }
}
