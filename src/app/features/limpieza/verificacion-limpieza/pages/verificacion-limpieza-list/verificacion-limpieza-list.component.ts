import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { VerificacionLimpiezaService } from '../../services/verificacion-limpieza.service';
import { VerificacionLimpieza } from '../../models/verificacion-limpieza.interface';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
    selector: 'app-verificacion-limpieza-list',
    standalone: true,
    imports: [TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TagModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './verificacion-limpieza-list.component.html',
    styleUrls: ['./verificacion-limpieza-list.component.scss']
})
export class VerificacionLimpiezaListComponent implements OnInit {
    private service = inject(VerificacionLimpiezaService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    registroId = this.route.snapshot.paramMap.get('registroId')!;
    items = signal<VerificacionLimpieza[]>([]);

    async ngOnInit(): Promise<void> {
        await this.load();
    }

    private async load(): Promise<void> {
        try {
            this.items.set(await firstValueFrom(this.service.getByRegistro(this.registroId)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las verificaciones' });
        }
    }

    navigateToCreate(): void {
        this.router.navigate(['crear'], { relativeTo: this.route });
    }

    navigateToEdit(id: string): void {
        this.router.navigate([id, 'editar'], { relativeTo: this.route });
    }

    confirmDelete(id: string): void {
        this.confirmationService.confirm({
            message: '¿Eliminar esta verificación?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-trash',
            accept: () => this.delete(id)
        });
    }

    private async delete(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            await this.load();
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Verificación eliminada' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la verificación' });
        }
    }

    resultadoSeverity(resultado: string): Severity {
        const map: Record<string, Severity> = {
            aprobado:    'success',
            rechazado:   'danger',
            observacion: 'warn'
        };
        return map[resultado] ?? 'secondary';
    }

    resultadoLabel(resultado: string): string {
        const map: Record<string, string> = {
            aprobado:    'Aprobado',
            rechazado:   'Rechazado',
            observacion: 'Observación'
        };
        return map[resultado] ?? resultado;
    }
}
