import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AnalisisLaboratorioService } from '../../services/analisis-laboratorio.service';
import { AnalisisLaboratorio } from '../../models/analisis-laboratorio.interface';

@Component({
    selector: 'app-analisis-laboratorio-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TabsModule, TagModule, ToastModule],
    templateUrl: './analisis-laboratorio-detail.component.html',
    styleUrls: ['./analisis-laboratorio-detail.component.scss'],
    providers: [MessageService],
})
export class AnalisisLaboratorioDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private service = inject(AnalisisLaboratorioService);
    private messageService = inject(MessageService);

    item = signal<AnalisisLaboratorio | null>(null);
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
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el análisis de laboratorio' });
        } finally {
            this.loading.set(false);
        }
    }

    volver() { this.location.back(); }
}
