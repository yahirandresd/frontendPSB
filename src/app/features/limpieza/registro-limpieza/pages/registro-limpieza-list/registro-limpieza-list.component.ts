import { Component, inject, OnInit, signal } from '@angular/core';
import { Location, SlicePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { RegistroLimpiezaService } from '../../services/registro-limpieza.service';
import { RegistroLimpieza } from '../../models/registro-limpieza.interface';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
    selector: 'app-registro-limpieza-list',
    standalone: true,
    imports: [TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TagModule, SlicePipe],
    providers: [MessageService, ConfirmationService],
    templateUrl: './registro-limpieza-list.component.html',
    styleUrls: ['./registro-limpieza-list.component.scss']
})
export class RegistroLimpiezaListComponent implements OnInit {
    private service = inject(RegistroLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private location = inject(Location);

    programaId = this.route.snapshot.paramMap.get('programaId')!;
    items = signal<RegistroLimpieza[]>([]);

    async ngOnInit(): Promise<void> {
        await this.load();
    }

    private async load(): Promise<void> {
        try {
            this.items.set(await firstValueFrom(this.service.getByPrograma(this.programaId)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los registros' });
        }
    }

    volver(): void { this.location.back(); }

    navigateToCreate(): void {
        this.router.navigate(['crear'], { relativeTo: this.route });
    }

    navigateToDetail(id: string): void {
        this.router.navigate([id], { relativeTo: this.route });
    }

    navigateToEdit(id: string): void {
        this.router.navigate([id, 'editar'], { relativeTo: this.route });
    }

    confirmDelete(id: string): void {
        this.confirmationService.confirm({
            message: '¿Eliminar este registro?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-trash',
            accept: () => this.delete(id)
        });
    }

    private async delete(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            await this.load();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro' });
        }
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
