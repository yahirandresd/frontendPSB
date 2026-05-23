import { Component, inject, OnInit, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PasoLimpiezaService } from '../../services/paso-limpieza.service';
import { PasoLimpieza } from '../../models/paso-limpieza.interface';

@Component({
    selector: 'app-paso-limpieza-list',
    standalone: true,
    imports: [TableModule, ButtonModule, ConfirmDialogModule, ToastModule, SlicePipe],
    providers: [ConfirmationService, MessageService],
    templateUrl: './paso-limpieza-list.component.html',
    styleUrls: ['./paso-limpieza-list.component.scss']
})
export class PasoLimpiezaListComponent implements OnInit {
    private service = inject(PasoLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    programaId = this.route.snapshot.paramMap.get('programaId')!;
    pasos = signal<PasoLimpieza[]>([]);
    cargando = signal(true);

    async ngOnInit(): Promise<void> {
        await this.cargar();
    }

    async cargar(): Promise<void> {
        this.cargando.set(true);
        try {
            this.pasos.set(await firstValueFrom(this.service.getByPrograma(this.programaId)));
        } finally {
            this.cargando.set(false);
        }
    }

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
