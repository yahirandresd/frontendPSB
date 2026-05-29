import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { InsumoQuimicoService } from '../../services/insumo-quimico.service';
import { InsumoQuimico } from '../../models/insumo-quimico.interface';
import { MantenimientoLavadoService } from '../../../mantenimiento-lavado/services/mantenimiento-lavado.service';

@Component({
    selector: 'app-insumo-quimico-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, TooltipModule],
    templateUrl: './insumo-quimico-list.component.html',
    styleUrls: ['./insumo-quimico-list.component.scss'],
    providers: [MessageService],
})
export class InsumoQuimicoListComponent implements OnInit {
    private service = inject(InsumoQuimicoService);
    private mantenimientoService = inject(MantenimientoLavadoService);
    private messageService = inject(MessageService);
    items = signal<InsumoQuimico[]>([]);
    mantenimientoMap = signal<Map<string, string>>(new Map());
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try {
            const [data, mantenimientos] = await Promise.all([
                firstValueFrom(this.service.getAll()),
                firstValueFrom(this.mantenimientoService.getAll()),
            ]);
            this.items.set(data);
            this.mantenimientoMap.set(new Map(mantenimientos.map(m => [m.id, m.metodoLimpieza])));
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}
