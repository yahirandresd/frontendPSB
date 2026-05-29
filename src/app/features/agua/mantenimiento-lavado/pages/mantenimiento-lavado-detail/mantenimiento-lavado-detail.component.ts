import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MantenimientoLavadoService } from '../../services/mantenimiento-lavado.service';
import { MantenimientoLavado } from '../../models/mantenimiento-lavado.interface';

@Component({
    selector: 'app-mantenimiento-lavado-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './mantenimiento-lavado-detail.component.html',
    styleUrls: ['./mantenimiento-lavado-detail.component.scss'],
    providers: [MessageService],
})
export class MantenimientoLavadoDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private service = inject(MantenimientoLavadoService);
    private messageService = inject(MessageService);

    item = signal<MantenimientoLavado | null>(null);
    loading = signal(true);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.cargar(id);
    }

    async cargar(id: string) {
        this.loading.set(true);
        try {
            this.item.set(await firstValueFrom(this.service.getById(id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el mantenimiento' });
        } finally {
            this.loading.set(false);
        }
    }

    volver() { this.location.back(); }
}
