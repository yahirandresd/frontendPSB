import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { firstValueFrom } from 'rxjs';
import { RegistroPlagasService } from '../services/registro-plagas.service';
import { RegistroPlagas } from '../models/registro-plagas';
 
@Component({
    selector: 'app-registro-plagas-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule],
    templateUrl: './registro-plagas.html'
})
export class RegistroPlagasComponent implements OnInit {
    @Input() registro: RegistroPlagas | null = null;
    @Input() usuarios: any[] = [];
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();
 
    private service = inject(RegistroPlagasService);
 
    guardando = false;
    firmaRealizadoPor: string | null = null;
    firmaAprobadoPor: string | null = null;
 
    form: Partial<RegistroPlagas> = {
        tipoActividad: undefined,
        resultadoGeneral: '',
        firmadoPorId: '',
        aprobadoPorId: ''
    };
 
    readonly tiposActividad = [
        'Inspección preventiva',
        'Aplicación de plaguicida',
        'Revisión de trampas',
        'Control de roedores',
        'Control de insectos',
        'Fumigación'
    ];
 
    readonly resultados = [
        'APROBADO', 'CONFORME', 'OBSERVACIONES', 'PENDIENTE', 'NO_APROBADO'
    ];
 
    ngOnInit(): void {
        if (this.registro) {
            this.form = { ...this.registro };
            this.firmaRealizadoPor = this.registro.firmadoPor?.firma ?? null;
            this.firmaAprobadoPor = this.registro.aprobadoPor?.firma ?? null;
        }
    }
 
    onSeleccionarFirmante(event: any, tipo: 'firmado' | 'aprobado'): void {
        const usuario = this.usuarios.find(u => u.id === event.value);
        if (!usuario) return;
        if (tipo === 'firmado') this.firmaRealizadoPor = usuario.firma ?? null;
        else this.firmaAprobadoPor = usuario.firma ?? null;
    }
 
    async onGuardar(): Promise<void> {
        if (!this.form.tipoActividad || !this.form.resultadoGeneral ||
            !this.form.firmadoPorId || !this.form.aprobadoPorId) return;
 
        this.guardando = true;
        try {
            if (this.registro?.id) {
                await firstValueFrom(this.service.actualizar(this.registro.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
            // El page maneja el error via MessageService
        } finally {
            this.guardando = false;
        }
    }
 
    onCancelar(): void {
        this.cancelado.emit();
    }
}
 