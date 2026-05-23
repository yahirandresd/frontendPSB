import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AnalisisLaboratorioService } from '../../services/analisis-laboratorio.service';
import { AnalisisLaboratorio } from '../../models/analisis-laboratorio.interface';

@Component({
    selector: 'app-analisis-laboratorio-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule],
    templateUrl: './analisis-laboratorio-list.component.html',
    styleUrls: ['./analisis-laboratorio-list.component.scss'],
    providers: [MessageService],
})
export class AnalisisLaboratorioListComponent implements OnInit {
    private service = inject(AnalisisLaboratorioService);
    private messageService = inject(MessageService);
    items = signal<AnalisisLaboratorio[]>([]);
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try { this.items.set(await firstValueFrom(this.service.getAll())); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}