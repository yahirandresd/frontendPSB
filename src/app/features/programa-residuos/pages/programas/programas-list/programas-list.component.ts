import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgramaResiduosStore } from '../../../services/programa-residuos.store';
import {
    checklistProgreso,
    ESTADO_REGISTRO_LABELS,
    ESTADO_REGISTRO_SEVERITY,
    FRECUENCIA_PROGRAMA_LABELS
} from '../../../utils/programa-residuos.labels';
import { EstadoRegistro, FrecuenciaPrograma, Programa } from '../../../models/programa-residuos.models';

@Component({
    selector: 'app-programas-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        ToolbarModule,
        TagModule,
        SelectModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ConfirmDialogModule,
        ToastModule,
        ProgressBarModule,
        RouterLink
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './programas-list.component.html',
    styleUrls: ['./programas-list.component.scss']
})
export class ProgramasListComponent {
    @ViewChild('dt') table!: Table;

    private readonly store = inject(ProgramaResiduosStore);
    private readonly router = inject(Router);
    private readonly confirm = inject(ConfirmationService);
    private readonly toast = inject(MessageService);

    readonly estadoLabels = ESTADO_REGISTRO_LABELS;
    readonly estadoSeverity = ESTADO_REGISTRO_SEVERITY;
    readonly frecuenciaLabels = FRECUENCIA_PROGRAMA_LABELS;

    readonly filtroFrecuencia = signal<FrecuenciaPrograma | null>(null);
    readonly frecuenciaOptions = (Object.keys(FRECUENCIA_PROGRAMA_LABELS) as FrecuenciaPrograma[]).map((k) => ({
        label: FRECUENCIA_PROGRAMA_LABELS[k],
        value: k
    }));

    readonly programas = computed(() => {
        const freq = this.filtroFrecuencia();
        const list = this.store.programasList();
        return freq ? list.filter((p) => p.frecuencia === freq) : list;
    });

    progreso(p: Programa): number {
        const records = p.programaResiduo?.registros;
        if (!records || records.length === 0) return 0;
        const latest = records[records.length - 1];
        return checklistProgreso(latest.checklistResiduo);
    }

    programaEstado(p: Programa): EstadoRegistro {
        const regs = p.registros;
        if (!regs || regs.length === 0) return EstadoRegistro.PENDIENTE;
        return regs[regs.length - 1].estado;
    }

    onGlobalFilter(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.table.filterGlobal(value, 'contains');
    }

    exportCSV(): void {
        this.table.exportCSV();
    }

    verDetalle(id: string): void {
        this.router.navigate(['/programa-residuos/programas', id]);
    }

    labelEstado(e: EstadoRegistro): string {
        return ESTADO_REGISTRO_LABELS[e];
    }

    severityEstado(e: EstadoRegistro) {
        return ESTADO_REGISTRO_SEVERITY[e];
    }

    labelFrecuencia(f: FrecuenciaPrograma): string {
        return FRECUENCIA_PROGRAMA_LABELS[f];
    }

    eliminar(id: string, nombre: string): void {
        this.confirm.confirm({
            message: `¿Eliminar el programa "${nombre}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.store.deletePrograma(id);
                this.toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Programa eliminado' });
            }
        });
    }
}

