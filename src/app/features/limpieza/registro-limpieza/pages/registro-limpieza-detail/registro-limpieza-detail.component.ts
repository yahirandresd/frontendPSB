import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RegistroLimpiezaService } from '../../services/registro-limpieza.service';
import { RegistroLimpieza } from '../../models/registro-limpieza.interface';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
    selector: 'app-registro-limpieza-detail',
    standalone: true,
    imports: [ButtonModule, CardModule, TagModule, ProgressSpinnerModule, DatePipe, RouterModule],
    templateUrl: './registro-limpieza-detail.component.html',
    styleUrls: ['./registro-limpieza-detail.component.scss']
})
export class RegistroLimpiezaDetailComponent implements OnInit {
    private service = inject(RegistroLimpiezaService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    registro = signal<RegistroLimpieza | null>(null);
    cargando = signal(true);
    error = signal(false);

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            this.registro.set(await firstValueFrom(this.service.getById(id)));
        } catch {
            this.error.set(true);
        } finally {
            this.cargando.set(false);
        }
    }

    volver(): void {
        this.router.navigate(['../..'], { relativeTo: this.route });
    }

    irAEditar(): void {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.router.navigate(['..', id, 'editar'], { relativeTo: this.route });
    }

    estadoSeverity(estado: string): Severity {
        const map: Record<string, Severity> = {
            pendiente:   'warn',
            en_proceso:  'info',
            completado:  'success',
            con_novedad: 'danger'
        };
        return map[estado] ?? 'secondary';
    }

    estadoLabel(estado: string): string {
        const map: Record<string, string> = {
            pendiente:   'Pendiente',
            en_proceso:  'En proceso',
            completado:  'Completado',
            con_novedad: 'Con novedad'
        };
        return map[estado] ?? estado;
    }
}
