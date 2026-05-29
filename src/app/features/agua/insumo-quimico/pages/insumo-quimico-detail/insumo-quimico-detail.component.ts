import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InsumoQuimicoService } from '../../services/insumo-quimico.service';
import { InsumoQuimico } from '../../models/insumo-quimico.interface';

@Component({
    selector: 'app-insumo-quimico-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './insumo-quimico-detail.component.html',
    styleUrls: ['./insumo-quimico-detail.component.scss'],
    providers: [MessageService],
})
export class InsumoQuimicoDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private service = inject(InsumoQuimicoService);
    private messageService = inject(MessageService);

    item = signal<InsumoQuimico | null>(null);
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
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el insumo químico' });
        } finally {
            this.loading.set(false);
        }
    }

    volver() { this.location.back(); }
}
