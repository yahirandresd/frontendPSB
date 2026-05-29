import { Component, inject, OnInit, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, UsuarioRol } from '../../models/usuario.interface';

@Component({
    selector: 'app-usuario-list',
    standalone: true,
    imports: [TableModule, TagModule, ButtonModule, TooltipModule, ToastModule, AvatarModule, TitleCasePipe],
    providers: [MessageService],
    templateUrl: './usuario-list.component.html',
    styleUrls: ['./usuario-list.component.scss']
})
export class UsuarioListComponent implements OnInit {
    private service = inject(UsuarioService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    usuarios = signal<Usuario[]>([]);
    cargando = signal(true);
    error = signal(false);

    async ngOnInit(): Promise<void> {
        await this.cargar();
    }

    async cargar(): Promise<void> {
        this.cargando.set(true);
        this.error.set(false);
        try {
            this.usuarios.set(await firstValueFrom(this.service.getAll()));
        } catch {
            this.error.set(true);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
        } finally {
            this.cargando.set(false);
        }
    }

    iniciales(nombre: string): string {
        return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
    }

    rolSeverity(rol: UsuarioRol): 'danger' | 'warn' | 'info' | 'success' | 'secondary' {
        const map: Record<UsuarioRol, 'danger' | 'warn' | 'info' | 'success' | 'secondary'> = {
            superadmin: 'danger',
            admin:      'warn',
            supervisor: 'info',
            calidad:    'success',
            operario:   'secondary',
        };
        return map[rol] ?? 'secondary';
    }

    irAVer(id: string):    void { this.router.navigate(['/usuarios', id]); }
    irAEditar(id: string): void { this.router.navigate(['/usuarios', id, 'editar']); }
    irACrear():            void { this.router.navigate(['/usuarios/crear']); }
}
