import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, UsuarioRol } from '../../models/usuario.interface';

@Component({
    selector: 'app-usuario-detail',
    standalone: true,
    imports: [ButtonModule, TagModule, AvatarModule, ProgressSpinnerModule, DatePipe, TitleCasePipe],
    templateUrl: './usuario-detail.component.html',
    styleUrls: ['./usuario-detail.component.scss']
})
export class UsuarioDetailComponent implements OnInit {
    private service = inject(UsuarioService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    usuario = signal<Usuario | null>(null);
    cargando = signal(true);
    error = signal(false);

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            this.usuario.set(await firstValueFrom(this.service.getById(id)));
        } catch {
            this.error.set(true);
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

    volver():     void { this.router.navigate(['/usuarios']); }
    irAEditar():  void {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.router.navigate(['/usuarios', id, 'editar']);
    }
}
