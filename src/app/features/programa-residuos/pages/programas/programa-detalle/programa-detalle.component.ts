import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgramaResiduosStore } from '../../../services/programa-residuos.store';
import { ProgramaResiduosService } from '../../../services/programa-residuos.service';
import {
    EstadoRegistro,
    FrecuenciaPrograma,
    Programa,
    RegistroResiduo
} from '../../../models/programa-residuos.models';
import {
    checklistProgreso,
    ESTADO_REGISTRO_LABELS,
    ESTADO_REGISTRO_SEVERITY,
    FRECUENCIA_PROGRAMA_LABELS,
    progresoColor,
    TIPO_ACTIVIDAD_LABELS
} from '../../../utils/programa-residuos.labels';
import { PlanPsbService } from '@/app/features/configuracion/plan-psb/services/plan-psb.service';
import { UsuarioService } from '@/app/features/usuarios/services/usuario.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-programa-detalle',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        TabsModule,
        TagModule,
        ButtonModule,
        TableModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        CheckboxModule,
        ProgressBarModule,
        TimelineModule,
        FileUploadModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './programa-detalle.component.html',
    styleUrls: ['./programa-detalle.component.scss']
})
export class ProgramaDetalleComponent {
    private readonly store = inject(ProgramaResiduosStore);
    private readonly service = inject(ProgramaResiduosService);
    private readonly route = inject(ActivatedRoute);
    private readonly toast = inject(MessageService);
    private readonly planPsbService = inject(PlanPsbService);
    private readonly usuarioService = inject(UsuarioService);
    private readonly destroyRef = inject(DestroyRef);

    readonly programaId = this.route.snapshot.paramMap.get('id')!;
    readonly programa = computed(() => this.store.getProgramaById(this.programaId));

    readonly planNombre = signal('');
    readonly usuarioOptions = signal<{ label: string; value: string }[]>([]);
    readonly registros = signal<RegistroResiduo[]>([]);

    constructor() {
        effect(() => {
            const planId = this.programa()?.planPsbId;
            if (planId && !this.planNombre()) {
                firstValueFrom(this.planPsbService.getById(planId))
                    .then(plan => this.planNombre.set(plan.nombre))
                    .catch(() => {});
            }

            const prId = this.programa()?.programaResiduo?.id;
            if (prId) {
                this.loadRegistros(prId);
            }
        });
        firstValueFrom(this.usuarioService.getAll())
            .then(usuarios => this.usuarioOptions.set(usuarios.map(u => ({ label: u.nombre, value: u.nombre }))))
            .catch(() => {});
    }

    private loadRegistros(prId: string | number = this.programa()?.programaResiduo?.id ?? ''): void {
        if (!prId) return;
        this.service.getRegistrosByPrograma(prId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: data => this.registros.set(data),
                error: () => {}
            });
    }

    readonly estadoLabels = ESTADO_REGISTRO_LABELS;
    readonly estadoSeverity = ESTADO_REGISTRO_SEVERITY;
    readonly tipoLabels = TIPO_ACTIVIDAD_LABELS;
    readonly frecuenciaLabels = FRECUENCIA_PROGRAMA_LABELS;
    readonly progresoColor = progresoColor;

    readonly latestRegistroResiduo = computed(() => {
        const regs = this.registros();
        if (!regs || regs.length === 0) return null;
        const last = regs[regs.length - 1];
        return {
            ...last,
            checklistResiduo: last.checklistResiduo ?? [],
            evidencias: last.evidencias ?? [],
            recolecciones: last.recolecciones ?? []
        };
    });

    readonly progresoChecklist = computed(() => {
        const l = this.latestRegistroResiduo();
        return l ? checklistProgreso(l.checklistResiduo) : 0;
    });

    readonly checklistResumen = computed(() => {
        const l = this.latestRegistroResiduo();
        if (!l) return { completados: 0, pendientes: 0 };
        const completados = l.checklistResiduo.filter((c) => c.porcentaje_cumplimiento === 100).length;
        return { completados, pendientes: l.checklistResiduo.length - completados };
    });

    readonly historialTimeline = computed(() => {
        const p = this.programa();
        const regs = p?.registros || [];
        return [...regs]
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .map((r) => ({
                status: `Ejecución registrada: ${r.observaciones || 'Inspección de control'}`,
                date: new Date(r.fecha).toLocaleDateString('es-CO'),
                user: r.usuarioId === 'usr-1' ? 'María González' : r.usuarioId === 'usr-2' ? 'Juan Pérez' : 'Carlos Arbeláez'
            }));
    });

    readonly actividades = computed(() => {
        const p = this.programa();
        return this.registros().map((rr) => ({
            id: rr.id,
            tipo_actividad: rr.tipo_actividad,
            resultado_general: rr.resultado_general,
            fecha: rr.registro?.fecha || '',
            responsable: p?.responsable || '',
            estado: rr.registro?.estado || EstadoRegistro.PENDIENTE,
            observaciones: rr.registro?.observaciones || ''
        }));
    });

    readonly evidencias = computed(() =>
        this.registros().flatMap(r => r.evidencias ?? [])
    );

    actividadDialog = signal(false);
    actividadEditId = signal<string | null>(null);
    actForm = {
        tipo_actividad: 'recoleccion',
        resultado_general: '',
        responsable: '',
        fecha: '',
        estado: EstadoRegistro.PENDIENTE,
        observaciones: ''
    };

    readonly tipoOptions = Object.keys(TIPO_ACTIVIDAD_LABELS).map((k) => ({
        label: TIPO_ACTIVIDAD_LABELS[k],
        value: k
    }));
    readonly estadoActOptions = (Object.keys(ESTADO_REGISTRO_LABELS) as EstadoRegistro[]).map((k) => ({
        label: ESTADO_REGISTRO_LABELS[k],
        value: k
    }));

    nuevaEvidenciaNombre = '';

    checklistDialog = signal(false);
    checklistForm = {
        titulo: '',
        descripcion: ''
    };

    openActividadDialog(act?: { id: string; tipo_actividad: string; resultado_general: string; fecha: string; responsable: string; estado: EstadoRegistro; observaciones: string }): void {
        if (act) {
            this.actividadEditId.set(act.id);
            this.actForm = {
                tipo_actividad: act.tipo_actividad,
                resultado_general: act.resultado_general,
                responsable: act.responsable,
                fecha: act.fecha,
                estado: act.estado,
                observaciones: act.observaciones
            };
        } else {
            this.actividadEditId.set(null);
            this.actForm = {
                tipo_actividad: 'recoleccion',
                resultado_general: '',
                responsable: this.programa()?.responsable || '',
                fecha: new Date().toISOString().slice(0, 10),
                estado: EstadoRegistro.PENDIENTE,
                observaciones: ''
            };
        }
        this.actividadDialog.set(true);
    }

    guardarActividad(): void {
        if (!this.actForm.resultado_general.trim() || !this.actForm.fecha || !this.actForm.responsable.trim()) {
            this.toast.add({ severity: 'warn', summary: 'Atención', detail: 'Completa resultado, responsable y fecha' });
            return;
        }

        const editId = this.actividadEditId();
        if (editId) {
            this.store.updateActividad(this.programaId, editId, { ...this.actForm }).subscribe({
                next: () => {
                    this.actividadDialog.set(false);
                    this.loadRegistros();
                    this.toast.add({ severity: 'success', summary: 'Actividad', detail: 'Actualizada correctamente' });
                },
                error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la actividad' })
            });
        } else {
            this.store.addActividad(this.programaId, { ...this.actForm }).subscribe({
                next: () => {
                    this.actividadDialog.set(false);
                    this.loadRegistros();
                    this.toast.add({ severity: 'success', summary: 'Actividad', detail: 'Guardada correctamente' });
                },
                error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la actividad' })
            });
        }
    }

    eliminarActividad(id: string): void {
        this.store.deleteActividad(this.programaId, id).subscribe({
            next: () => {
                this.loadRegistros();
                this.toast.add({ severity: 'info', summary: 'Eliminada', detail: 'Actividad eliminada' });
            },
            error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la actividad' })
        });
    }

    completarActividad(actId: string): void {
        this.store.updateActividad(this.programaId, actId, { estado: EstadoRegistro.COMPLETADO }).subscribe({
            next: () => {
                this.loadRegistros();
                this.toast.add({ severity: 'success', summary: 'Actividad', detail: 'Marcada como completada' });
            },
            error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar la actividad' })
        });
    }

    toggleCheck(itemId: string): void {
        this.store.toggleChecklist(this.programaId, itemId);
    }

    openChecklistDialog(): void {
        this.checklistForm = { titulo: '', descripcion: '' };
        this.checklistDialog.set(true);
    }

    iniciarRegistro(): void {
        const act = {
            tipo_actividad: 'inspeccion',
            resultado_general: 'Registro inicial de control',
            fecha: new Date().toISOString().split('T')[0],
            responsable: 'Sistema',
            estado: 'pendiente' as EstadoRegistro,
            observaciones: 'Registro creado automáticamente para habilitar el checklist'
        };
        this.store.addActividad(this.programaId, act).subscribe({
            next: () => this.toast.add({ severity: 'success', summary: 'Éxito', detail: 'Registro de control iniciado' }),
            error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo iniciar el registro' })
        });
    }

    guardarChecklistItem(): void {
        const latestReg = this.latestRegistroResiduo();
        if (!latestReg) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'No hay un registro activo para añadir esta tarea' });
            return;
        }

        if (!this.checklistForm.titulo.trim()) {
            this.toast.add({ severity: 'warn', summary: 'Atención', detail: 'El título es obligatorio' });
            return;
        }

        this.store.addChecklistItem(this.programaId, latestReg.id, {
            titulo: this.checklistForm.titulo,
            descripcion: this.checklistForm.descripcion,
            porcentaje_cumplimiento: 0
        });
        
        this.checklistDialog.set(false);
        this.toast.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea añadida al checklist' });
    }

    onUploadEvidencia(event: { originalEvent: Event; files: File[] }): void {
        const file = event.files?.[0];
        if (!file) {
            this.toast.add({ severity: 'warn', summary: 'Evidencia', detail: 'No se seleccionó ningún archivo' });
            return;
        }
        if (!this.latestRegistroResiduo()) {
            this.toast.add({ severity: 'warn', summary: 'Evidencia', detail: 'Primero crea un registro de actividad para asociar la evidencia' });
            return;
        }
        const nombre = this.nuevaEvidenciaNombre.trim() || file.name;
        this.store.addEvidencia(this.programaId, file, {
            nombre,
            tipo: file.type || 'documento',
            fecha: new Date().toISOString().slice(0, 10),
            usuario: 'Sistema'
        }).subscribe({
            next: () => {
                this.toast.add({ severity: 'success', summary: 'Evidencia', detail: 'Archivo cargado y registrado correctamente' });
                this.nuevaEvidenciaNombre = '';
            },
            error: (err) => {
                console.error('Error uploading evidence:', err);
                this.toast.add({ severity: 'error', summary: 'Evidencia', detail: 'Error al cargar la evidencia' });
            }
        });
    }

    eliminarEvidencia(id: number): void {
        this.store.deleteEvidencia(this.programaId, id).subscribe({
            next: () => this.toast.add({ severity: 'info', summary: 'Evidencia', detail: 'Evidencia eliminada correctamente' }),
            error: () => this.toast.add({ severity: 'error', summary: 'Evidencia', detail: 'No se pudo eliminar la evidencia' })
        });
    }

    labelTipo(t: string): string {
        return TIPO_ACTIVIDAD_LABELS[t] || t;
    }

    labelActEstado(e: EstadoRegistro): string {
        return ESTADO_REGISTRO_LABELS[e];
    }

    severityActEstado(e: EstadoRegistro) {
        return ESTADO_REGISTRO_SEVERITY[e];
    }

    labelFrecuencia(f: FrecuenciaPrograma): string {
        return FRECUENCIA_PROGRAMA_LABELS[f];
    }
}

