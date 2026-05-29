import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { AccionCorrectivaAguaService } from '../../services/accion-correctiva-agua.service';
import { AccionCorrectivaAgua } from '../../models/accion-correctiva-agua.interface';
import { RegistroAguaService } from '../../../registro-agua/services/registro-agua.service';

@Component({
    selector: 'app-accion-correctiva-agua-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, TooltipModule],
    templateUrl: './accion-correctiva-agua-list.component.html',
    styleUrls: ['./accion-correctiva-agua-list.component.scss'],
    providers: [MessageService],
})
export class AccionCorrectivaAguaListComponent implements OnInit {
    private service = inject(AccionCorrectivaAguaService);
    private registroAguaService = inject(RegistroAguaService);
    private messageService = inject(MessageService);
    items = signal<AccionCorrectivaAgua[]>([]);
    registroMap = signal<Map<string, string>>(new Map());
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try {
            const [data, registros] = await Promise.all([
                firstValueFrom(this.service.getAll()),
                firstValueFrom(this.registroAguaService.getAll()),
            ]);
            this.items.set(data);
            this.registroMap.set(new Map(registros.map(r => [r.id, r.tipoActividad])));
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}
