import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthService } from '@/app/features/auth/services/auth.service';

@Component({
    selector: 'app-user-drop',
    standalone: true,
    imports: [CommonModule, StyleClassModule],
    templateUrl: './app.user-drop.component.html',
    styleUrls: ['./app.user-drop.component.scss'],
})
export class AppUserDrop implements OnInit {
    private auth = inject(AuthService);
    private router = inject(Router);

    userEmail = signal<string>('');
    userName = signal<string>('');
    userInitials = signal<string>('U');

    async ngOnInit() {
        const { data } = await this.auth.getSession();
        const user = data.session?.user;
        const email = user?.email ?? '';
        const nombre = user?.user_metadata?.['nombre'] ?? '';
        const apellido = user?.user_metadata?.['apellido'] ?? '';
        const fullName = [nombre, apellido].filter(Boolean).join(' ');

        this.userEmail.set(email);
        this.userName.set(fullName);
        this.userInitials.set(
            nombre && apellido
                ? (nombre[0] + apellido[0]).toUpperCase()
                : nombre
                  ? nombre[0].toUpperCase()
                  : email[0]?.toUpperCase() ?? 'U'
        );
    }

    async logout() {
        await this.auth.signOut();
        this.router.navigate(['/auth/login']);
    }
}
