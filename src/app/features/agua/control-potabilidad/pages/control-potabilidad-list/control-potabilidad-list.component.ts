import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ControlPotabilidadService } from '../../services/control-potabilidad.service';
import { ControlPotabilidad } from '../../models/control-potabilidad.interface';

@Component({
    selector: 'app-control-potabilidad-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './control-potabilidad-list.component.html',
    styleUrls: ['./control-potabilidad-list.component.scss'],
    providers: [MessageService],
})
export class ControlPotabilidadListComponent implements OnInit {
    private service = inject(ControlPotabilidadService);
    private messageService = inject(MessageService);
    items = signal<ControlPotabilidad[]>([]);
    loading = signal(false);
    ngOnInit() { this.cargar(); }
    async cargar() {
        this.loading.set(true);
        try { this.items.set(await firstValueFrom(this.service.getAll())); }
        catch { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar' }); }
        finally { this.loading.set(false); }
    }
}