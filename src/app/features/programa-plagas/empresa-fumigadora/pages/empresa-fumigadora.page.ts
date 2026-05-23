import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { EmpresaFumigadoraService } from '../services/empresa-fumigadora.service';
import { EmpresaFumigadora } from '../models/empresa-fumigadora';
import { EmpresaFumigadoraComponent } from '../components/empresa-fumigadora.component';

@Component({
    selector: 'app-empresa-fumigadora-page',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule,
              TagModule, TooltipModule, ConfirmDialogModule, ToastModule, EmpresaFumigadoraComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './empresa-fumigadora-page.component.html'
})
export class EmpresaFumigadoraPageComponent implements OnInit {
    private service = inject(EmpresaFumigadoraService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    empresas: EmpresaFumigadora[] = [];
    empresaSeleccionada: EmpresaFumigadora | null = null;
    cargando = false;
    mostrarFormulario = false;
    mostrarDetalle = false;

    ngOnInit(): void { this.cargarEmpresas(); }

    cargarEmpresas(): void {
        this.cargando = true;
        this.service.listar().subscribe({
            next: (data) => { this.empresas = data; this.cargando = false; },
            error: () => { this.cargando = false; this.mostrarError('Error al cargar empresas'); }
        });
    }

    abrirFormulario(empresa?: EmpresaFumigadora): void {
        this.empresaSeleccionada = empresa ?? null;
        this.mostrarFormulario = true;
    }

    verDetalle(empresa: EmpresaFumigadora): void {
        this.empresaSeleccionada = empresa;
        this.mostrarDetalle = true;
    }

    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarEmpresas();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empresa guardada correctamente' });
    }

    confirmarEliminar(empresa: EmpresaFumigadora): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar la empresa "${empresa.nombreEmpresa}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await firstValueFrom(this.service.eliminar(empresa.id));
                    this.cargarEmpresas();
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Empresa eliminada' });
                } catch { this.mostrarError('Error al eliminar la empresa'); }
            }
        });
    }

    certificadoVigente(e: EmpresaFumigadora): boolean { return this.service.certificadoVigente(e); }

    private mostrarError(msg: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    }
}