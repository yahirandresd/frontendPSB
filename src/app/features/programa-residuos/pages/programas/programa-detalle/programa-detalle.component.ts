import { Component, computed, inject, signal } from '@angular/core';
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
    private readonly route = inject(ActivatedRoute);
    private readonly toast = inject(MessageService);

    readonly programaId = this.route.snapshot.paramMap.get('id')!;
    readonly programa = computed(() => this.store.getProgramaById(this.programaId));

    readonly estadoLabels = ESTADO_REGISTRO_LABELS;
    readonly estadoSeverity = ESTADO_REGISTRO_SEVERITY;
    readonly tipoLabels = TIPO_ACTIVIDAD_LABELS;
    readonly frecuenciaLabels = FRECUENCIA_PROGRAMA_LABELS;
    readonly progresoColor = progresoColor;

    readonly latestRegistroResiduo = computed(() => {
        const p = this.programa();
        const regs = p?.programaResiduo?.registros;
        if (!regs || regs.length === 0) return null;
        return regs[regs.length - 1];
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
        const list = p?.programaResiduo?.registros || [];
        return list.map((rr) => ({
            id: rr.id,
            tipo_actividad: rr.tipo_actividad,
            resultado_general: rr.resultado_general,
            fecha: rr.registro?.fecha || '',
            responsable: p?.responsable || '',
            estado: rr.registro?.estado || EstadoRegistro.PENDIENTE,
            observaciones: rr.registro?.observaciones || ''
        }));
    });

    readonly evidencias = computed(() => {
        const p = this.programa();
        return p?.programaResiduo?.registros.flatMap(r => r.evidencias) || [];
    });

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
        const editId = this.actividadEditId();
        if (editId) {
            this.store.updateActividad(this.programaId, editId, { ...this.actForm });
        } else {
            this.store.addActividad(this.programaId, { ...this.actForm });
        }
        this.actividadDialog.set(false);
        this.toast.add({ severity: 'success', summary: 'Actividad', detail: 'Guardada correctamente' });
    }

    eliminarActividad(id: string): void {
        this.store.deleteActividad(this.programaId, id);
        this.toast.add({ severity: 'info', summary: 'Eliminada', detail: 'Actividad eliminada' });
    }

    completarActividad(actId: string): void {
        this.store.updateActividad(this.programaId, actId, { estado: EstadoRegistro.COMPLETADO });
    }

    toggleCheck(itemId: string): void {
        this.store.toggleChecklist(this.programaId, itemId);
    }

    onUploadEvidencia(): void {
        const nombre = this.nuevaEvidenciaNombre.trim() || 'Evidencia cargada';
        this.store.addEvidencia(this.programaId, {
            nombre,
            tipo: 'documento',
            fecha: new Date().toISOString().slice(0, 10),
            usuario: 'Carlos Arbeláez'
        });
        this.nuevaEvidenciaNombre = '';
        this.toast.add({ severity: 'success', summary: 'Evidencia', detail: 'Archivo registrado (demo)' });
    }

    eliminarEvidencia(id: number): void {
        this.store.deleteEvidencia(this.programaId, id);
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

