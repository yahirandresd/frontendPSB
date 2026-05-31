import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';
import { TipoResiduoService } from '../../services/tipo-residuo.service';
import { TipoResiduoFormComponent } from '../../components/tipo-residuo-form/tipo-residuo-form.component';
import { TipoResiduo } from '../../models/tipo-residuo.interface';
import { CreateTipoResiduoDto } from '../../models/create-tipo-residuo.dto';

@Component({
    selector: 'app-tipo-residuo-edit',
    standalone: true,
    imports: [ToastModule, TipoResiduoFormComponent],
    providers: [MessageService],
    templateUrl: './tipo-residuo-edit.component.html',
    styleUrls: ['./tipo-residuo-edit.component.scss']
})
export class TipoResiduoEditComponent implements OnInit {
    private service = inject(TipoResiduoService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    tipoResiduo = signal<TipoResiduo | undefined>(undefined);

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            const data = await firstValueFrom(this.service.getById(id));
            this.tipoResiduo.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el tipo de residuo.' });
        }
    }

    async onUpdate(dto: CreateTipoResiduoDto): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            await firstValueFrom(this.service.update(id, dto));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Tipo de residuo actualizado correctamente.' });
            setTimeout(() => this.router.navigate(['/catalogos/tipos-residuo']), 1200);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el tipo de residuo.' });
        }
    }

    onCancelar(): void {
        this.router.navigate(['/catalogos/tipos-residuo']);
    }
}
