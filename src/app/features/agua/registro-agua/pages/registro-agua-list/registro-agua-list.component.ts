import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { RegistroAguaService } from '../../services/registro-agua.service';
import { RegistroAgua } from '../../models/registro-agua.interface';
import { ProgramaAguaService } from '../../../programa-agua/services/programa-agua.service';

@Component({
    selector: 'app-registro-agua-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, TooltipModule],
    templateUrl: './registro-agua-list.component.html',
    styleUrls: ['./registro-agua-list.component.scss'],
    providers: [MessageService],
})
export class RegistroAguaListComponent implements OnInit {
    private service = inject(RegistroAguaService);
    private programaAguaService = inject(ProgramaAguaService);
    private messageService = inject(MessageService);
    items = signal<RegistroAgua[]>([]);
    programaMap = signal<Map<string, string>>(new Map());
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try {
            const [data, programas] = await Promise.all([
                firstValueFrom(this.service.getAll()),
                firstValueFrom(this.programaAguaService.getAll()),
            ]);
            this.items.set(data);
            this.programaMap.set(new Map(programas.map(p => [p.id, p.objetivo])));
        } catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }

}
