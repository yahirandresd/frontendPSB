import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TanqueAlmacenamientoService } from '../../services/tanque-almacenamiento.service';
import { TanqueAlmacenamiento } from '../../models/tanque-almacenamiento.interface';

@Component({
    selector: 'app-tanque-almacenamiento-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule],
    templateUrl: './tanque-almacenamiento-list.component.html',
    styleUrls: ['./tanque-almacenamiento-list.component.scss'],
    providers: [MessageService],
})
export class TanqueAlmacenamientoListComponent implements OnInit {
    private service = inject(TanqueAlmacenamientoService);
    private messageService = inject(MessageService);
    items = signal<TanqueAlmacenamiento[]>([]);
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try { this.items.set(await firstValueFrom(this.service.getAll())); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}