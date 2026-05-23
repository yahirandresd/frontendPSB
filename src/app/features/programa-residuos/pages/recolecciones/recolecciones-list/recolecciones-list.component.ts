import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaResiduosStore } from '../../../services/programa-residuos.store';
import { ESTADO_REGISTRO_LABELS, ESTADO_REGISTRO_SEVERITY } from '../../../utils/programa-residuos.labels';
import { EstadoRegistro } from '../../../models/programa-residuos.models';

@Component({
    selector: 'app-recolecciones-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, ToastModule],
    providers: [MessageService],
    templateUrl: './recolecciones-list.component.html',
    styleUrls: ['./recolecciones-list.component.scss']
})
export class RecoleccionesListComponent {
    private readonly store = inject(ProgramaResiduosStore);
    private readonly toast = inject(MessageService);

    readonly recolecciones = this.store.recoleccionesList;
    readonly estadoLabels = ESTADO_REGISTRO_LABELS;
    readonly estadoSeverity = ESTADO_REGISTRO_SEVERITY;

    editDialog = signal(false);
    editId = signal<string | null>(null);
    editForm = {
        cantidad_recolectada: 0,
        responsable: '',
        observaciones: ''
    };

    abrirEditar(r: any): void {
        this.editId.set(r.id);
        this.editForm = {
            cantidad_recolectada: r.cantidad_recolectada,
            responsable: r.responsable,
            observaciones: r.observaciones
        };
        this.editDialog.set(true);
    }

    labelEstado(e: EstadoRegistro): string {
        return ESTADO_REGISTRO_LABELS[e] || e;
    }

    severityEstado(e: EstadoRegistro) {
        return ESTADO_REGISTRO_SEVERITY[e] || 'secondary';
    }

    guardar(): void {
        const id = this.editId();
        if (!id) return;
        this.store.updateRecoleccion(id, {
            cantidad_recolectada: this.editForm.cantidad_recolectada,
            responsable: this.editForm.responsable,
            observaciones: this.editForm.observaciones
        });
        this.editDialog.set(false);
        this.toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Recolección actualizada correctamente' });
    }
}

