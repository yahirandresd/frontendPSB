import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccionCorrectivaAguaService } from '../../services/accion-correctiva-agua.service';
import { AccionCorrectivaAgua } from '../../models/accion-correctiva-agua.interface';

@Component({
    selector: 'app-accion-correctiva-agua-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './accion-correctiva-agua-detail.component.html',
    styleUrls: ['./accion-correctiva-agua-detail.component.scss'],
    providers: [MessageService],
})
export class AccionCorrectivaAguaDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private service = inject(AccionCorrectivaAguaService);
    private messageService = inject(MessageService);

    item = signal<AccionCorrectivaAgua | null>(null);
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
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la acción correctiva' });
        } finally {
            this.loading.set(false);
        }
    }

    volver() { this.location.back(); }
}
