import { Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProgramaResiduosStore } from '../../../services/programa-residuos.store';
import { ProgramaResiduosService } from '../../../services/programa-residuos.service';
import { ESTADO_REGISTRO_LABELS, ESTADO_REGISTRO_SEVERITY, TagSeverity } from '../../../utils/programa-residuos.labels';
import { CreateRecoleccionDto, EstadoRegistro, Programa, Recoleccion, RegistroResiduo, TipoResiduo } from '../../../models/programa-residuos.models';

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
    private readonly service = inject(ProgramaResiduosService);
    private readonly toast = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    readonly recolecciones = signal<Recoleccion[]>([]);
    readonly estadoLabels = ESTADO_REGISTRO_LABELS;
    readonly estadoSeverity = ESTADO_REGISTRO_SEVERITY;

    readonly registrosDisponibles = signal<{
        label: string;
        value: string;
        programaId: string;
        programaResiduoId: string;
        programaNombre: string;
        fecha: string;
        responsable: string;
        estado: EstadoRegistro;
    }[]>([]);

    constructor() {
        this.service.getTiposResiduo()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({ next: (tipos) => this.tiposResiduos.set(tipos), error: () => {} });

        this.service.getRecolecciones()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({ next: (recs) => this.recolecciones.set(recs), error: () => {} });

        toObservable(this.store.programasList)
            .pipe(
                switchMap((programas) => {
                    const conId = programas.filter((p) => p.programaResiduo?.id);
                    if (!conId.length) return of([] as { programa: Programa; registros: RegistroResiduo[] }[]);
                    return forkJoin(
                        conId.map((p) =>
                            this.service.getRegistrosByPrograma(p.programaResiduo!.id).pipe(
                                map((registros) => ({ programa: p, registros: registros ?? [] }))
                            )
                        )
                    );
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((resultados) => {
                const opciones = (resultados as { programa: Programa; registros: RegistroResiduo[] }[])
                    .flatMap(({ programa, registros }) =>
                        registros
                            .filter(
                                (rr) =>
                                    rr.tipo_actividad === 'recoleccion' ||
                                    rr.tipo_actividad === 'recoleccion_interna'
                            )
                            .map((rr) => ({
                                label: `${programa.nombre} · ${rr.tipo_actividad} · ${rr.registro?.fecha || 'sin fecha'}`,
                                value: String(rr.id),
                                programaId: programa.id,
                                programaResiduoId: String(programa.programaResiduo?.id ?? ''),
                                programaNombre: programa.nombre,
                                fecha: rr.registro?.fecha || '',
                                responsable: programa.responsable,
                                estado: (rr.registro?.estado as EstadoRegistro) || EstadoRegistro.PENDIENTE
                            }))
                    )
                    .sort((a, b) => b.fecha.localeCompare(a.fecha));
                this.registrosDisponibles.set(opciones);
            });
    }

    readonly tiposResiduos = signal<TipoResiduo[]>([]);

    readonly tiposResiduosOptions = computed(() =>
        this.tiposResiduos().map((tr) => ({
            label: tr.nombre,
            value: tr.id,
            data: tr
        }))
    );

    readonly tipoResiduoSeleccionado = signal<TipoResiduo | null>(null);
    selectedTipoResiduoId = '';

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
        this.tipoResiduoSeleccionado.set(null);
        this.selectedTipoResiduoId = '';
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
            this.tiposResiduos.set([]);
            this.tipoResiduoSeleccionado.set(null);
            this.selectedTipoResiduoId = '';
            this.createForm.tipoResiduoId = undefined;
            return;
        }

        const seleccionado = this.registrosDisponibles().find((item) => item.value === registroResiduoId);
        if (!seleccionado) {
            this.tiposResiduos.set([]);
            this.tipoResiduoSeleccionado.set(null);
            return;
        }

        this.createForm = {
            ...this.createForm,
            registroResiduoId,
            responsable: this.createForm.responsable || seleccionado.responsable,
            fecha: this.createForm.fecha || seleccionado.fecha || new Date().toISOString().slice(0, 10)
        };

        this.tipoResiduoSeleccionado.set(null);
        this.selectedTipoResiduoId = '';
        this.createForm.tipoResiduoId = undefined;
    }

    onTipoResiduoChange(tipoResiduoId: string | null): void {
        if (!tipoResiduoId) {
            this.tipoResiduoSeleccionado.set(null);
            this.selectedTipoResiduoId = '';
            this.createForm.tipoResiduoId = undefined;
            return;
        }

        const seleccionado = this.tiposResiduos().find((tr) => String(tr.id) === tipoResiduoId);
        this.tipoResiduoSeleccionado.set(seleccionado || null);
        this.selectedTipoResiduoId = tipoResiduoId;
        this.createForm.tipoResiduoId = Number(tipoResiduoId);
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
        const primerRegistro = this.registrosDisponibles()[0] ?? null;
        return {
            registroResiduoId: primerRegistro?.value || '',
            fecha: new Date().toISOString().slice(0, 10),
            responsable: primerRegistro?.responsable || '',
            cantidad_recolectada: 0,
            observaciones: ''
        };
    }
}
