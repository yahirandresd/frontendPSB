import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';
import { TipoResiduoService } from '../../services/tipo-residuo.service';
import { TipoResiduoFormComponent } from '../../components/tipo-residuo-form/tipo-residuo-form.component';
import { CreateTipoResiduoDto } from '../../models/create-tipo-residuo.dto';

@Component({
    selector: 'app-tipo-residuo-create',
    standalone: true,
    imports: [ToastModule, TipoResiduoFormComponent],
    providers: [MessageService],
    templateUrl: './tipo-residuo-create.component.html',
    styleUrls: ['./tipo-residuo-create.component.scss']
})
export class TipoResiduoCreateComponent {
    private service = inject(TipoResiduoService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    async onCreate(dto: CreateTipoResiduoDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Tipo de residuo creado correctamente.' });
            setTimeout(() => this.router.navigate(['/catalogos/tipos-residuo']), 1200);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el tipo de residuo.' });
        }
    }

    onCancelar(): void {
        this.router.navigate(['/catalogos/tipos-residuo']);
    }
}
