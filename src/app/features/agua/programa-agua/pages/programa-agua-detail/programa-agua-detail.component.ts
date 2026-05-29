import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgramaAguaService } from '../../services/programa-agua.service';
import { ProgramaAgua } from '../../models/programa-agua.interface';

@Component({
    selector: 'app-programa-agua-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, ToastModule],
    templateUrl: './programa-agua-detail.component.html',
    styleUrls: ['./programa-agua-detail.component.scss'],
    providers: [MessageService],
})
export class ProgramaAguaDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private service = inject(ProgramaAguaService);
    private messageService = inject(MessageService);

    item = signal<ProgramaAgua | null>(null);
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
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el programa de agua' });
        } finally {
            this.loading.set(false);
        }
    }

    volver() { this.location.back(); }
}
