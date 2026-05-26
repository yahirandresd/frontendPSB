import { Component, inject, OnInit, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgramaLimpiezaService } from '../../services/programa-limpieza.service';
import { ProgramaLimpieza } from '../../models/programa-limpieza.interface';

interface LimpiezaModule {
    label: string;
    icon: string;
    route: string;
    description: string;
}

@Component({
    selector: 'app-programa-limpieza-list',
    standalone: true,
    imports: [RouterModule, TableModule, ButtonModule, CardModule, AccordionModule, ConfirmDialogModule, ToastModule, SlicePipe],
    providers: [ConfirmationService, MessageService],
    templateUrl: './programa-limpieza-list.component.html',
    styleUrls: ['./programa-limpieza-list.component.scss']
})
export class ProgramaLimpiezaListComponent implements OnInit {
    private service = inject(ProgramaLimpiezaService);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    programas = signal<ProgramaLimpieza[]>([]);
    cargando = signal(true);

    modules: LimpiezaModule[] = [
        { label: 'Equipos y Áreas',    icon: 'pi pi-wrench',   route: '/limpieza/equipos',            description: 'Equipos, áreas y utensilios de limpieza' },
        { label: 'Productos Químicos', icon: 'pi pi-flask',    route: '/limpieza/productos-quimicos', description: 'Productos autorizados con registro INVIMA' },
        { label: 'Pasos de Limpieza',  icon: 'pi pi-list',     route: '/limpieza/programas',          description: 'Pasos definidos por programa de limpieza' },
        { label: 'Registros',          icon: 'pi pi-file-edit', route: '/limpieza/programas',         description: 'Registros diarios de ejecución y verificación' },
    ];

    async ngOnInit(): Promise<void> {
        await this.cargar();
    }

    async cargar(): Promise<void> {
        this.cargando.set(true);
        try {
            this.programas.set(await firstValueFrom(this.service.getAll()));
        } finally {
            this.cargando.set(false);
        }
    }

    irACrear(): void {
        this.router.navigate(['/limpieza/programas/crear']);
    }

    irAVer(id: string): void {
        this.router.navigate(['/limpieza/programas', id]);
    }

    irAEditar(id: string): void {
        this.router.navigate(['/limpieza/programas', id, 'editar']);
    }

    confirmarEliminar(programa: ProgramaLimpieza): void {
        this.confirmationService.confirm({
            message: '¿Eliminar este programa de limpieza?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.eliminar(programa.id)
        });
    }

    private async eliminar(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Programa eliminado correctamente' });
            await this.cargar();
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el programa' });
        }
    }
}
