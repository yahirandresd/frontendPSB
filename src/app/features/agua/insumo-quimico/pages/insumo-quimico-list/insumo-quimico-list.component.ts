import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InsumoQuimicoService } from '../../services/insumo-quimico.service';
import { InsumoQuimico } from '../../models/insumo-quimico.interface';

@Component({
    selector: 'app-insumo-quimico-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule],
    templateUrl: './insumo-quimico-list.component.html',
    styleUrls: ['./insumo-quimico-list.component.scss'],
    providers: [MessageService],
})
export class InsumoQuimicoListComponent implements OnInit {
    private service = inject(InsumoQuimicoService);
    private messageService = inject(MessageService);
    items = signal<InsumoQuimico[]>([]);
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try { this.items.set(await firstValueFrom(this.service.getAll())); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}