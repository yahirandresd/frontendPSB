import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaResiduosStore } from '../../../services/programa-residuos.store';
import { ESTADO_REGISTRO_LABELS, ESTADO_REGISTRO_SEVERITY, TagSeverity } from '../../../utils/programa-residuos.labels';
import { CreateRecoleccionDto, EstadoRegistro } from '../../../models/programa-residuos.models';

@Component({
    selector: 'app-recolecciones-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        TagModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TextareaModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './recolecciones-list.component.html',
    styleUrls: ['./recolecciones-list.component.scss']
})
export class RecoleccionesListComponent {
    private readonly store = inject(ProgramaResiduosStore);
    private readonly toast = inject(MessageService);

    readonly recolecciones = this.store.recoleccionesList;
    readonly registrosDisponibles = this.store.registrosDisponiblesParaRecoleccion;
    readonly estadoLabels = ESTADO_REGISTRO_LABELS;
    readonly estadoSeverity = ESTADO_REGISTRO_SEVERITY;

    createDialog = signal(false);
    editDialog = signal(false);
    editId = signal<string | null>(null);

    createForm: CreateRecoleccionDto = this.createDefaultForm();
    editForm = {
        cantidad_recolectada: 0,
        responsable: '',
        observaciones: ''
    };

    abrirCrear(): void {
        this.createForm = this.createDefaultForm();
        this.createDialog.set(true);
    }

    abrirEditar(r: { id: string; cantidad_recolectada: number; responsable: string; observaciones: string }): void {
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

    severityEstado(e: EstadoRegistro): TagSeverity {
        return ESTADO_REGISTRO_SEVERITY[e] || 'secondary';
    }

    onRegistroChange(registroResiduoId: string | null | undefined): void {
        if (!registroResiduoId) {
            return;
        }

        const seleccionado = this.registrosDisponibles().find((item) => item.value === registroResiduoId);
        if (!seleccionado) {
            return;
        }

        this.createForm = {
            ...this.createForm,
            registroResiduoId,
            responsable: this.createForm.responsable || seleccionado.responsable,
            fecha: this.createForm.fecha || seleccionado.fecha || new Date().toISOString().slice(0, 10)
        };
    }

    guardarNueva(): void {
        if (!this.createForm.registroResiduoId || !this.createForm.fecha || !this.createForm.responsable.trim()) {
            this.toast.add({ severity: 'warn', summary: 'Atencion', detail: 'Selecciona un registro y completa fecha y responsable' });
            return;
        }

        if (this.createForm.cantidad_recolectada <= 0) {
            this.toast.add({ severity: 'warn', summary: 'Atencion', detail: 'La cantidad recolectada debe ser mayor a 0' });
            return;
        }

        this.store.createRecoleccion(this.createForm).subscribe({
            next: () => {
                this.createDialog.set(false);
                this.toast.add({ severity: 'success', summary: 'Creada', detail: 'Recoleccion creada correctamente' });
            },
            error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la recoleccion' })
        });
    }

    guardar(): void {
        const id = this.editId();
        if (!id) {
            return;
        }

        this.store
            .updateRecoleccion(id, {
                cantidad_recolectada: this.editForm.cantidad_recolectada,
                responsable: this.editForm.responsable,
                observaciones: this.editForm.observaciones
            })
            .subscribe({
                next: () => {
                    this.editDialog.set(false);
                    this.toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Recoleccion actualizada correctamente' });
                },
                error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la recoleccion' })
            });
    }

    private createDefaultForm(): CreateRecoleccionDto {
        const primerRegistro = this.registrosDisponibles()[0];
        return {
            registroResiduoId: primerRegistro?.value || '',
            fecha: new Date().toISOString().slice(0, 10),
            responsable: primerRegistro?.responsable || '',
            cantidad_recolectada: 0,
            observaciones: ''
        };
    }
}
