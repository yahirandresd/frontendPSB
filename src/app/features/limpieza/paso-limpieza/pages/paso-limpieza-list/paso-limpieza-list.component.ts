import { Component, inject, OnInit, signal } from '@angular/core';
import { Location, SlicePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PasoLimpiezaService } from '../../services/paso-limpieza.service';
import { PasoLimpieza } from '../../models/paso-limpieza.interface';
import { PasoLimpiezaPqService } from '@/app/features/limpieza/paso-limpieza-pq/services/paso-limpieza-pq.service';
import { PasoLimpiezaPq } from '@/app/features/limpieza/paso-limpieza-pq/models/paso-limpieza-pq.interface';
import { ProductoQuimicoService } from '@/app/features/limpieza/producto-quimico/services/producto-quimico.service';
import { ProductoQuimico } from '@/app/features/limpieza/producto-quimico/models/producto-quimico.interface';

@Component({
    selector: 'app-paso-limpieza-list',
    standalone: true,
    imports: [TableModule, ButtonModule, TagModule, ConfirmDialogModule, ToastModule, TooltipModule, SlicePipe],
    providers: [ConfirmationService, MessageService],
    templateUrl: './paso-limpieza-list.component.html',
    styleUrls: ['./paso-limpieza-list.component.scss']
})
export class PasoLimpiezaListComponent implements OnInit {
    private service         = inject(PasoLimpiezaService);
    private pqService       = inject(PasoLimpiezaPqService);
    private productoService = inject(ProductoQuimicoService);
    private router          = inject(Router);
    private route           = inject(ActivatedRoute);
    private confirmationService = inject(ConfirmationService);
    private messageService      = inject(MessageService);
    private location            = inject(Location);

    programaId = this.route.snapshot.paramMap.get('programaId')!;
    pasos      = signal<PasoLimpieza[]>([]);
    catalogo   = signal<ProductoQuimico[]>([]);
    cargando   = signal(true);

    private pqMap = new Map<string, PasoLimpiezaPq[]>();

    async ngOnInit(): Promise<void> {
        await this.cargar();
    }

    async cargar(): Promise<void> {
        this.cargando.set(true);
        try {
            const [pasos, catalogo] = await Promise.all([
                firstValueFrom(this.service.getByPrograma(this.programaId)),
                firstValueFrom(this.productoService.getAll()).catch(() => [] as ProductoQuimico[]),
            ]);
            this.catalogo.set(catalogo);

            const pqsLists = await Promise.all(
                pasos.map(p => firstValueFrom(this.pqService.getByPaso(p.id)).catch(() => [] as PasoLimpiezaPq[]))
            );
            this.pqMap.clear();
            pasos.forEach((p, i) => this.pqMap.set(p.id, pqsLists[i]));
            this.pasos.set(pasos);
        } finally {
            this.cargando.set(false);
        }
    }

    productosDelPaso(pasoId: string): PasoLimpiezaPq[] {
        return this.pqMap.get(pasoId) ?? [];
    }

    nombreProducto(pq: PasoLimpiezaPq): string {
        return this.catalogo().find(p => p.id === pq.productoQuimicoId)?.nombre ?? '—';
    }

    volver(): void { this.location.back(); }

    irACrear(): void {
        this.router.navigate(['crear'], { relativeTo: this.route });
    }

    irAEditar(id: string): void {
        this.router.navigate([id, 'editar'], { relativeTo: this.route });
    }

    confirmarEliminar(paso: PasoLimpieza): void {
        this.confirmationService.confirm({
            message: `¿Eliminar el paso #${paso.orden}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.eliminar(paso.id)
        });
    }

    private async eliminar(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Paso eliminado correctamente' });
            await this.cargar();
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el paso' });
        }
    }
}
