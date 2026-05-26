import { Component, inject, OnInit, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductoQuimicoService } from '../../services/producto-quimico.service';
import { ProductoQuimico } from '../../models/producto-quimico.interface';

@Component({
    selector: 'app-producto-quimico-list',
    standalone: true,
    imports: [TableModule, TagModule, ButtonModule, TooltipModule, ConfirmDialogModule, ToastModule, TitleCasePipe],
    providers: [ConfirmationService, MessageService],
    templateUrl: './producto-quimico-list.component.html',
    styleUrls: ['./producto-quimico-list.component.scss']
})
export class ProductoQuimicoListComponent implements OnInit {
    private service = inject(ProductoQuimicoService);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    productos = signal<ProductoQuimico[]>([]);
    cargando = signal(true);

    async ngOnInit(): Promise<void> {
        await this.cargar();
    }

    async cargar(): Promise<void> {
        this.cargando.set(true);
        try {
            this.productos.set(await firstValueFrom(this.service.getAll()));
        } finally {
            this.cargando.set(false);
        }
    }

    irACrear(): void {
        this.router.navigate(['/limpieza/productos-quimicos/crear']);
    }

    tipoSeverity(tipo: string): 'info' | 'success' | 'warn' | 'secondary' | 'danger' {
        const map: Record<string, 'info' | 'success' | 'warn' | 'secondary' | 'danger'> = {
            desinfectante: 'info',
            detergente:    'secondary',
            sanitizante:   'success',
            desengrasante: 'warn',
            esterilizante: 'danger',
        };
        return map[tipo] ?? 'secondary';
    }

    irAVer(id: string): void {
        this.router.navigate(['/limpieza/productos-quimicos', id]);
    }

    irAEditar(id: string): void {
        this.router.navigate(['/limpieza/productos-quimicos', id, 'editar']);
    }

    confirmarEliminar(producto: ProductoQuimico): void {
        this.confirmationService.confirm({
            message: `¿Eliminar "${producto.nombre}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.eliminar(producto.id)
        });
    }

    private async eliminar(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto químico eliminado correctamente' });
            await this.cargar();
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto químico' });
        }
    }
}
