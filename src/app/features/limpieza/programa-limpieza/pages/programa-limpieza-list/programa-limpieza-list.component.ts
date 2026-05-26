import { Component, inject, OnInit, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgramaLimpiezaService } from '../../services/programa-limpieza.service';
import { ProgramaLimpieza } from '../../models/programa-limpieza.interface';

@Component({
    selector: 'app-programa-limpieza-list',
    standalone: true,
    imports: [TableModule, ButtonModule, ConfirmDialogModule, ToastModule, SlicePipe],
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
