import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);

    loginForm: FormGroup = this.fb.group({
        email:    ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading      = signal(false);
    errorMessage = signal('');
    showPassword = signal(false);
    isDark       = signal(false);

    ngOnInit(): void {
        try {
            const stored = localStorage.getItem('sanify-theme');
            if (stored) {
                this.isDark.set(stored === 'dark');
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.isDark.set(true);
            }
        } catch { /* SSR guard */ }
    }

    toggleTheme(): void {
        const next = !this.isDark();
        this.isDark.set(next);
        try { localStorage.setItem('sanify-theme', next ? 'dark' : 'light'); } catch {}
    }

    togglePassword(): void {
        this.showPassword.update(v => !v);
    }

    async onSubmit(): Promise<void> {
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
            this.errorMessage.set('Credenciales incorrectas. Verifica tu correo y contraseña.');
            return;
        }

        this.router.navigate(['/dashboard']);
    }
}
