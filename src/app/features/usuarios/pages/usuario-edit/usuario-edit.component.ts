import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';
import { Usuario } from '../../models/usuario.interface';
import { CreateUsuarioDto } from '../../models/create-usuario.dto';
import { UpdateUsuarioDto } from '../../models/update-usuario.dto';

@Component({
    selector: 'app-usuario-edit',
    standalone: true,
    imports: [UsuarioFormComponent, ToastModule, ProgressSpinnerModule],
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

    async onSubmit(dto: CreateUsuarioDto | UpdateUsuarioDto): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            await firstValueFrom(this.service.update(id, dto as UpdateUsuarioDto));
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Usuario actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/usuarios', id]), 500);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario' });
        }
    }
}
