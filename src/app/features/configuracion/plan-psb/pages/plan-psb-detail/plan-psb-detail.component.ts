import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PlanPsbService } from '../../services/plan-psb.service';
import { PlanPsb, NivelRiesgo, EstadoPlan } from '../../models/plan-psb.interface';
import { ProgramaService } from '@/app/features/programa/services/programa.service';
import { Programa } from '@/app/features/programa/models/programa.interface';

@Component({
    selector: 'app-plan-psb-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './plan-psb-detail.component.html',
    styleUrls: ['./plan-psb-detail.component.scss'],
    providers: [MessageService],
})
export class PlanPsbDetailComponent implements OnInit {
    private planService = inject(PlanPsbService);
    private programaService = inject(ProgramaService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);

    plan = signal<PlanPsb | null>(null);
    programa = signal<Programa | null>(null);
    loading = signal(true);

    readonly programaCards = [
        { tipo: 'limpieza',  icono: 'pi-sparkles', nombre: 'Limpieza y Desinfección', ruta: '/limpieza/programas' },
        { tipo: 'plagas',    icono: 'pi-bug',       nombre: 'Control de Plagas',       ruta: '/control-plagas'     },
        { tipo: 'agua',      icono: 'pi-tint',      nombre: 'Gestión del Agua',         ruta: '/programa-agua'      },
        { tipo: 'residuos',  icono: 'pi-inbox',     nombre: 'Manejo de Residuos',       ruta: '/programa-residuos'  },
    ];

    ngOnInit() { this.cargar(); }

    async cargar() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        this.loading.set(true);
        try {
            const [planData, programas] = await Promise.all([
                firstValueFrom(this.planService.getById(id)),
                firstValueFrom(this.programaService.getByPlanId(id)),
            ]);
            this.plan.set(planData);
            this.programa.set(programas[0] ?? null);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el plan' });
        } finally {
            this.loading.set(false);
        }
    }

    get planId(): string { return this.route.snapshot.paramMap.get('id') ?? ''; }

    estadoSeverity(estado: EstadoPlan): 'success' | 'secondary' | 'danger' | 'warn' {
        const map: Record<EstadoPlan, 'success' | 'secondary' | 'danger' | 'warn'> = {
            ACTIVO: 'success', BORRADOR: 'secondary', VENCIDO: 'danger', EN_REVISION: 'warn',
        };
        return map[estado];
    }

    riesgoSeverity(nivel: NivelRiesgo): 'danger' | 'warn' | 'success' {
        const map: Record<NivelRiesgo, 'danger' | 'warn' | 'success'> = { ALTO: 'danger', MEDIO: 'warn', BAJO: 'success' };
        return map[nivel];
    }

    volver() { this.router.navigate(['/planes']); }
}
