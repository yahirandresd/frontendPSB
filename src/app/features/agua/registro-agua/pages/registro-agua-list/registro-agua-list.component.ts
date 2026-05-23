import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RegistroAguaService } from '../../services/registro-agua.service';
import { RegistroAgua } from '../../models/registro-agua.interface';

@Component({
    selector: 'app-registro-agua-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule],
    templateUrl: './registro-agua-list.component.html',
    styleUrls: ['./registro-agua-list.component.scss'],
    providers: [MessageService],
})
export class RegistroAguaListComponent implements OnInit {
    private service = inject(RegistroAguaService);
    private messageService = inject(MessageService);
    items = signal<RegistroAgua[]>([]);
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try { this.items.set(await firstValueFrom(this.service.getAll())); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}