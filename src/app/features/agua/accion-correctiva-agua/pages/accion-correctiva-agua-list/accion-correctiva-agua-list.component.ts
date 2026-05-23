import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccionCorrectivaAguaService } from '../../services/accion-correctiva-agua.service';
import { AccionCorrectivaAgua } from '../../models/accion-correctiva-agua.interface';

@Component({
    selector: 'app-accion-correctiva-agua-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule],
    templateUrl: './accion-correctiva-agua-list.component.html',
    styleUrls: ['./accion-correctiva-agua-list.component.scss'],
    providers: [MessageService],
})
export class AccionCorrectivaAguaListComponent implements OnInit {
    private service = inject(AccionCorrectivaAguaService);
    private messageService = inject(MessageService);
    items = signal<AccionCorrectivaAgua[]>([]);
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try { this.items.set(await firstValueFrom(this.service.getAll())); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}