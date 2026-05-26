import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProductoQuimicoService } from '../../services/producto-quimico.service';
import { ProductoQuimico } from '../../models/producto-quimico.interface';

@Component({
    selector: 'app-producto-quimico-detail',
    standalone: true,
    imports: [ButtonModule, TagModule, ProgressSpinnerModule, DatePipe, TitleCasePipe],
    templateUrl: './producto-quimico-detail.component.html',
    styleUrls: ['./producto-quimico-detail.component.scss']
})
export class ProductoQuimicoDetailComponent implements OnInit {
    private service = inject(ProductoQuimicoService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    producto = signal<ProductoQuimico | null>(null);
    cargando = signal(true);
    error = signal(false);

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            this.producto.set(await firstValueFrom(this.service.getById(id)));
        } catch {
            this.error.set(true);
        } finally {
            this.cargando.set(false);
        }
    }

    tipoSeverity(tipo: string): 'info' | 'success' | 'warn' | 'secondary' | 'danger' {
        const map: Record<string, 'info' | 'success' | 'warn' | 'secondary' | 'danger'> = {
            desinfectante: 'info',
            detergente:    'secondary',
            sanitizante:   'success',
            desengrasante: 'warn',
            esterilizante: 'danger',
        };
        return map[tipo] ?? 'secondary';
    }

    volver(): void {
        this.router.navigate(['/limpieza/productos-quimicos']);
    }

    irAEditar(): void {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.router.navigate(['/limpieza/productos-quimicos', id, 'editar']);
    }
}
