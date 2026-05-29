import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TanqueAlmacenamientoService } from '../../services/tanque-almacenamiento.service';
import { TanqueAlmacenamiento } from '../../models/tanque-almacenamiento.interface';
import { FuenteAguaService } from '../../../fuente-agua/services/fuente-agua.service';

@Component({
    selector: 'app-tanque-almacenamiento-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, TooltipModule],
    templateUrl: './tanque-almacenamiento-list.component.html',
    styleUrls: ['./tanque-almacenamiento-list.component.scss'],
    providers: [MessageService],
})
export class TanqueAlmacenamientoListComponent implements OnInit {
    private service = inject(TanqueAlmacenamientoService);
    private fuenteAguaService = inject(FuenteAguaService);
    private messageService = inject(MessageService);
    items = signal<TanqueAlmacenamiento[]>([]);
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
