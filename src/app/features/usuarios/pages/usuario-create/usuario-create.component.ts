import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';
import { CreateUsuarioDto } from '../../models/create-usuario.dto';
import { UpdateUsuarioDto } from '../../models/update-usuario.dto';

@Component({
    selector: 'app-usuario-create',
    standalone: true,
    imports: [UsuarioFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './usuario-create.component.html',
    styleUrls: ['./usuario-create.component.scss']
})
export class UsuarioCreateComponent {
    private service = inject(UsuarioService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    async onSubmit(dto: CreateUsuarioDto | UpdateUsuarioDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto as CreateUsuarioDto));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Usuario creado correctamente' });
            setTimeout(() => this.router.navigate(['/usuarios']), 500);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario' });
        }
    }
}
