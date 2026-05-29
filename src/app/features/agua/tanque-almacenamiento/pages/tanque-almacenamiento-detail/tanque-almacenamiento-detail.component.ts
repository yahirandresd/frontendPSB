import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TanqueAlmacenamientoService } from '../../services/tanque-almacenamiento.service';
import { TanqueAlmacenamiento } from '../../models/tanque-almacenamiento.interface';

@Component({
    selector: 'app-tanque-almacenamiento-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, ToastModule],
    templateUrl: './tanque-almacenamiento-detail.component.html',
    styleUrls: ['./tanque-almacenamiento-detail.component.scss'],
    providers: [MessageService],
})
export class TanqueAlmacenamientoDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private service = inject(TanqueAlmacenamientoService);
    private messageService = inject(MessageService);

    item = signal<TanqueAlmacenamiento | null>(null);
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
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el tanque de almacenamiento' });
        } finally {
            this.loading.set(false);
        }
    }

    volver() { this.location.back(); }
}
