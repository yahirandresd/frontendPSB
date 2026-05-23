import { Component, inject, OnInit, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EquipoAreaService } from '../../services/equipo-area.service';
import { EquipoArea, EstadoEquipoArea, TipoEquipoArea } from '../../models/equipo-area.interface';

@Component({
    selector: 'app-equipo-area-list',
    standalone: true,
    imports: [TableModule, TagModule, ButtonModule, ConfirmDialogModule, ToastModule, SlicePipe],
    providers: [ConfirmationService, MessageService],
    templateUrl: './equipo-area-list.component.html',
    styleUrls: ['./equipo-area-list.component.scss']
})
export class EquipoAreaListComponent implements OnInit {
    private service = inject(EquipoAreaService);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    equipos = signal<EquipoArea[]>([]);
    cargando = signal(true);

    async ngOnInit(): Promise<void> {
        await this.cargar();
    }

    async cargar(): Promise<void> {
        this.cargando.set(true);
        try {
            this.equipos.set(await firstValueFrom(this.service.getAll()));
        } finally {
            this.cargando.set(false);
        }
    }

    tipoLabel(tipo: TipoEquipoArea): string {
        const map: Record<TipoEquipoArea, string> = { AREA: 'Área', EQUIPO: 'Equipo', UTENSILIO: 'Utensilio' };
        return map[tipo];
    }

    tipoSeverity(tipo: TipoEquipoArea): 'info' | 'warn' | 'secondary' {
        const map: Record<TipoEquipoArea, 'info' | 'warn' | 'secondary'> = { AREA: 'info', EQUIPO: 'warn', UTENSILIO: 'secondary' };
        return map[tipo];
    }

    estadoSeverity(estado: EstadoEquipoArea): 'success' | 'danger' {
        return estado === 'ACTIVO' ? 'success' : 'danger';
    }

    irACrear(): void {
        this.router.navigate(['/limpieza/equipos/crear']);
    }

    irAEditar(id: string): void {
        this.router.navigate(['/limpieza/equipos', id, 'editar']);
    }

    confirmarEliminar(equipo: EquipoArea): void {
        this.confirmationService.confirm({
            message: `¿Eliminar "${equipo.nombre}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.eliminar(equipo.id)
        });
    }

    private async eliminar(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Equipo/área eliminado correctamente' });
            await this.cargar();
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el equipo/área' });
        }
    }
}
