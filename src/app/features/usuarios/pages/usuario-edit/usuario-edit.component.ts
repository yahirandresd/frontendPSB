import { Component, inject, OnInit, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';
import { Usuario, UsuarioRol } from '../../models/usuario.interface';
import { CreateUsuarioDto } from '../../models/create-usuario.dto';
import { UpdateUsuarioDto } from '../../models/update-usuario.dto';

@Component({
    selector: 'app-usuario-edit',
    standalone: true,
    imports: [UsuarioFormComponent, ToastModule, ProgressSpinnerModule, ButtonModule, TagModule, AvatarModule, DividerModule, TitleCasePipe],
    providers: [MessageService],
    templateUrl: './usuario-edit.component.html',
    styleUrls: ['./usuario-edit.component.scss']
})
export class UsuarioEditComponent implements OnInit {
    private service = inject(UsuarioService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);

    usuario = signal<Usuario | null>(null);
    cargando = signal(true);

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            this.usuario.set(await firstValueFrom(this.service.getById(id)));
        } finally {
            this.cargando.set(false);
        }
    }

    iniciales(nombre: string): string {
        return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
    }

    rolSeverity(rol: UsuarioRol): 'danger' | 'warn' | 'info' | 'success' | 'secondary' {
        const map: Record<UsuarioRol, 'danger' | 'warn' | 'info' | 'success' | 'secondary'> = {
            superadmin: 'danger', admin: 'warn', supervisor: 'info', calidad: 'success', operario: 'secondary',
        };
        return map[rol] ?? 'secondary';
    }

    volver(): void {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.router.navigate(['/usuarios', id]);
    }

    async onSubmit(dto: CreateUsuarioDto | UpdateUsuarioDto): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            await firstValueFrom(this.service.update(id, dto as UpdateUsuarioDto));
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Usuario actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/usuarios', id]), 600);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario' });
        }
    }
}
