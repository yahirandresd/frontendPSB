import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgramaLimpiezaService } from '../../services/programa-limpieza.service';
import { ProgramaLimpieza } from '../../models/programa-limpieza.interface';

@Component({
    selector: 'app-programa-limpieza-detail',
    standalone: true,
    imports: [ButtonModule, CardModule, TagModule, ProgressSpinnerModule, DatePipe, RouterModule],
    templateUrl: './programa-limpieza-detail.component.html',
    styleUrls: ['./programa-limpieza-detail.component.scss']
})
export class ProgramaLimpiezaDetailComponent implements OnInit {
    private service = inject(ProgramaLimpiezaService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    programa = signal<ProgramaLimpieza | null>(null);
    cargando = signal(true);
    error = signal(false);

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            this.programa.set(await firstValueFrom(this.service.getById(id)));
        } catch {
            this.error.set(true);
        } finally {
            this.cargando.set(false);
        }
    }

    volver(): void {
        this.router.navigate(['/limpieza/programas']);
    }

    irAEditar(): void {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.router.navigate(['/limpieza/programas', id, 'editar']);
    }
}
