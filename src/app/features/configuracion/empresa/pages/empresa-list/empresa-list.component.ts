import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.interface';

@Component({
    selector: 'app-empresa-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule],
    templateUrl: './empresa-list.component.html',
    styleUrls: ['./empresa-list.component.scss'],
    providers: [MessageService],
})
export class EmpresaListComponent implements OnInit {
    private service = inject(EmpresaService);
    private messageService = inject(MessageService);

    empresas = signal<Empresa[]>([]);
    loading = signal(false);

    ngOnInit() { this.cargarEmpresas(); }

    async cargarEmpresas() {
        this.loading.set(true);
        try {
            const data = await firstValueFrom(this.service.getAll());
            this.empresas.set(data);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos de la empresa' });
        } finally {
            this.loading.set(false);
        }
    }
}
