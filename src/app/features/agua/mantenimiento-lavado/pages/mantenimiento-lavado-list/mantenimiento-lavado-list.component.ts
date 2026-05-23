import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MantenimientoLavadoService } from '../../services/mantenimiento-lavado.service';
import { MantenimientoLavado } from '../../models/mantenimiento-lavado.interface';

@Component({
    selector: 'app-mantenimiento-lavado-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule],
    templateUrl: './mantenimiento-lavado-list.component.html',
    styleUrls: ['./mantenimiento-lavado-list.component.scss'],
    providers: [MessageService],
})
export class MantenimientoLavadoListComponent implements OnInit {
    private service = inject(MantenimientoLavadoService);
    private messageService = inject(MessageService);
    items = signal<MantenimientoLavado[]>([]);
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try { this.items.set(await firstValueFrom(this.service.getAll())); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}