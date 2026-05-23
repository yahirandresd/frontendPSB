import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrosService, TIPOS_ACTIVIDAD } from '../../services/registros.service';
import { Registro, EstadoRegistro } from '../../models/registro.model';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-registros-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        RadioButtonModule,
        TextareaModule,
        TagModule,
        MenuModule,
        ToastModule,
        RippleModule,
    ],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="registros-page">

            <!-- FORMULARIO -->
            <div class="card form-card">
                <div class="card-header">
                    <span class="header-icon">✅</span>
                    <h2>Nueva Entrada de Actividad</h2>
                </div>

                <div class="form-grid">
                    <div class="form-field">
                        <label>Fecha</label>
                        <input type="date" pInputText [(ngModel)]="form.fecha" />
                    </div>

                    <div class="form-field">
                        <label>Tipo de Actividad</label>
                        <p-select
                            [options]="tiposActividad"
                            [(ngModel)]="form.tipoActividad"
                            placeholder="Seleccionar..."
                            [style]="{'width':'100%'}"
                        ></p-select>
                    </div>

                    <div class="form-field">
                        <label>Responsable</label>
                        <input type="text" pInputText [(ngModel)]="form.responsable" placeholder="Nombre del profesional" />
                    </div>

                    <div class="form-field">
                        <label>Estado Inicial</label>
                        <div class="radio-group">
                            <p-radiobutton name="estado" value="Pendiente" [(ngModel)]="form.estado" inputId="pendiente"></p-radiobutton>
                            <label for="pendiente">Pendiente</label>
                            <p-radiobutton name="estado" value="Completado" [(ngModel)]="form.estado" inputId="completado" class="ml-3"></p-radiobutton>
                            <label for="completado">Completado</label>
                        </div>
                    </div>
                </div>

                <div class="form-field full-width">
                    <label>Observaciones</label>
                    <div class="obs-row">
                        <textarea
                            pTextarea
                            [(ngModel)]="form.observaciones"
                            placeholder="Detalles específicos de la actividad realizada..."
                            rows="2"
                            style="flex:1"
                        ></textarea>
                        <button pButton pRipple label="Guardar Registro" icon="pi pi-save" class="save-btn" (click)="guardar()"></button>
                    </div>
                </div>
            </div>

            <!-- TABLA -->
            <div class="card table-card">
                <div class="card-header">
                    <div class="header-left">
                        <span class="header-icon">🕐</span>
                        <h2>Registros Recientes</h2>
                    </div>
                    <div class="header-actions">
                        <button pButton pRipple label="Exportar PDF" icon="pi pi-file-pdf" class="p-button-outlined p-button-sm"></button>
                        <button pButton pRipple label="Filtrar" icon="pi pi-filter" class="p-button-outlined p-button-sm"></button>
                    </div>
                </div>

                <p-table
                    [value]="registrosService.registros()"
                    [paginator]="true"
                    [rows]="10"
                    [rowsPerPageOptions]="[5, 10, 25]"
                    [tableStyle]="{'min-width': '60rem'}"
                    currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} registros"
                    [showCurrentPageReport]="true"
                >
                    <ng-template pTemplate="header">
                        <tr>
                            <th>FECHA</th>
                            <th>ACTIVIDAD</th>
                            <th>RESPONSABLE</th>
                            <th>OBSERVACIONES</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-registro>
                        <tr>
                            <td>{{ formatFecha(registro.fecha) }}</td>
                            <td><strong>{{ registro.tipoActividad }}</strong></td>
                            <td>{{ registro.responsable }}</td>
                            <td class="obs-cell">{{ registro.observaciones }}</td>
                            <td>
                                <p-tag
                                    [value]="registro.estado"
                                    [severity]="registro.estado === 'Completado' ? 'success' : 'warn'"
                                ></p-tag>
                            </td>
                            <td>
                                <button
                                    pButton
                                    icon="pi pi-ellipsis-v"
                                    class="p-button-text p-button-rounded p-button-sm"
                                    (click)="menu.toggle($event); registroActivo = registro"
                                ></button>
                                <p-menu #menu [popup]="true" [model]="menuItems()"></p-menu>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

        </div>
    `,
    styles: [`
        .registros-page {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .card {
            background: #ffffff;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            transition: background 0.2s ease, border-color 0.2s ease;
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .header-icon {
            font-size: 1.4rem;
        }

        .card-header h2 {
            font-size: 1.1rem;
            font-weight: 700;
            margin: 0;
            color: #111827;
            transition: color 0.2s ease;
        }

        .header-actions {
            display: flex;
            gap: 0.5rem;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .form-field label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 0.4rem;
            color: #6b7280;
            transition: color 0.2s ease;
        }

        .form-field input,
        .form-field textarea {
            width: 100%;
        }

        .radio-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            height: 2.5rem;
        }

        .radio-group label {
            color: #374151;
            transition: color 0.2s ease;
        }

        .obs-row {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
        }

        .save-btn {
            background-color: #2563eb !important;
            border: none !important;
            white-space: nowrap;
            height: 2.5rem;
        }

        .obs-cell {
            max-width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* =========================================
           MODO OSCURO
           ========================================= */
        :host-context(html.app-dark) .card {
            background: #1e1e1e !important;
            border: 1px solid #3f3f46 !important;
        }

        :host-context(html.app-dark) .card-header h2 {
            color: rgba(255, 255, 255, 0.87) !important;
        }

        :host-context(html.app-dark) .form-field label {
            color: rgba(255, 255, 255, 0.5) !important;
        }

        :host-context(html.app-dark) .radio-group label {
            color: rgba(255, 255, 255, 0.87) !important;
        }

    `]
})
export class RegistrosListComponent {

    registrosService = inject(RegistrosService);

    tiposActividad = TIPOS_ACTIVIDAD;
    registroActivo: Registro | null = null;

    form = {
        fecha: '',
        tipoActividad: '',
        responsable: '',
        observaciones: '',
        estado: 'Pendiente' as EstadoRegistro
    };

    menuItems = computed(() => [
        {
            label: 'Marcar Completado',
            icon: 'pi pi-check',
            command: () => {
                if (this.registroActivo) {
                    this.registrosService.actualizar(this.registroActivo.id, { estado: 'Completado' });
                }
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => {
                if (this.registroActivo) {
                    this.registrosService.eliminar(this.registroActivo.id);
                }
            }
        }
    ]);

    guardar() {
        if (!this.form.fecha || !this.form.tipoActividad || !this.form.responsable) {
            return;
        }
        this.registrosService.agregar({ ...this.form });
        this.form = {
            fecha: '',
            tipoActividad: '',
            responsable: '',
            observaciones: '',
            estado: 'Pendiente'
        };
    }

    formatFecha(fecha: string): string {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}