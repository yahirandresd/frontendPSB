import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FuenteAguaService } from '../../services/fuente-agua.service';
import { FuenteAgua } from '../../models/fuente-agua.interface';

@Component({
    selector: 'app-fuente-agua-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './fuente-agua-detail.component.html',
    styleUrls: ['./fuente-agua-detail.component.scss'],
    providers: [MessageService],
})
export class FuenteAguaDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private service = inject(FuenteAguaService);
    private messageService = inject(MessageService);

    item = signal<FuenteAgua | null>(null);
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
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la fuente de agua' });
        } finally {
            this.loading.set(false);
        }
    }

    volver() { this.location.back(); }
}
