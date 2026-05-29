import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ControlPotabilidadService } from '../../services/control-potabilidad.service';
import { ControlPotabilidad } from '../../models/control-potabilidad.interface';
import { FuenteAguaService } from '../../../fuente-agua/services/fuente-agua.service';

@Component({
    selector: 'app-control-potabilidad-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, TagModule, ToastModule, TooltipModule],
    templateUrl: './control-potabilidad-list.component.html',
    styleUrls: ['./control-potabilidad-list.component.scss'],
    providers: [MessageService],
})
export class ControlPotabilidadListComponent implements OnInit {
    private service = inject(ControlPotabilidadService);
    private fuenteAguaService = inject(FuenteAguaService);
    private messageService = inject(MessageService);
    items = signal<ControlPotabilidad[]>([]);
    fuenteMap = signal<Map<string, string>>(new Map());
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try {
            const [data, fuentes] = await Promise.all([
                firstValueFrom(this.service.getAll()),
                firstValueFrom(this.fuenteAguaService.getAll()),
            ]);
            this.items.set(data);
            this.fuenteMap.set(new Map(fuentes.map(f => [f.id, f.nombre])));
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}
