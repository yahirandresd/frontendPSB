import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { HallazgoService } from '../services/hallazgo.service';
import { Hallazgo } from '../models/hallazgo';
 
@Component({
    selector: 'app-hallazgo-plagas-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule, TextareaModule],
    templateUrl: './hallazgos.html'
})
export class HallazgoPlagasComponent implements OnInit {
    @Input() hallazgo: Hallazgo | null = null;
    @Input() registroPlagaId!: string;
    @Input() tiposPlaga: { label: string; value: string }[] = [];
 
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();
 
    private service = inject(HallazgoService);
    guardando = false;
 
    // Campo auxiliar: el textarea maneja texto plano, se convierte a string[] al guardar
    accionesCorrectivasTexto = '';
 
    form: Partial<Hallazgo> = {
        descripcion: '',
        severidad: undefined,
        estado: 'abierto',
        fecha: new Date(),
        registroPlagaId: '',
        tipoPlagaId: '',
        accionesCorrectivas: []
    };
 
    readonly severidades = [
        { label: 'Leve', value: 'leve' },
        { label: 'Moderado', value: 'moderado' },
        { label: 'Grave', value: 'grave' },
        { label: 'Crítico', value: 'critico' }
    ];
 
    readonly estados = [
        { label: 'Abierto', value: 'abierto' },
        { label: 'En gestión', value: 'en_gestion' },
        { label: 'Cerrado', value: 'cerrado' }
    ];
 
    ngOnInit(): void {
        if (this.hallazgo) {
            // Modo edición: carga datos y convierte el array a texto
            this.form = { ...this.hallazgo };
            this.accionesCorrectivasTexto = (this.hallazgo.accionesCorrectivas ?? []).join('\n');
        } else {
            // Modo creación: asigna el registroPlagaId del contexto
            this.form.registroPlagaId = this.registroPlagaId;
        }
    }
 
    async onGuardar(): Promise<void> {
        if (!this.form.descripcion || !this.form.severidad || !this.form.tipoPlagaId) return;
 
        // Convierte el texto del textarea a string[] filtrando líneas vacías
        this.form.accionesCorrectivas = this.accionesCorrectivasTexto
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0);
 
        if (this.form.accionesCorrectivas.length === 0) return;
 
        this.guardando = true;
        try {
            if (this.hallazgo?.id) {
                await firstValueFrom(this.service.actualizar(this.hallazgo.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally {
            this.guardando = false;
        }
    }
 
    onCancelar(): void { this.cancelado.emit(); }
}