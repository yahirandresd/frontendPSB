import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom } from 'rxjs';
import { EmpresaFumigadoraService } from '../services/empresa-fumigadora.service';
import { EmpresaFumigadora } from '../models/empresa-fumigadora';

@Component({
    selector: 'app-empresa-fumigadora-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
    templateUrl: './empresa-fumigadora.html'
})
export class EmpresaFumigadoraComponent implements OnInit {
    @Input() empresa: EmpresaFumigadora | null = null;
    @Input() programaPlagasId!: string; // ← recibir del padre
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(EmpresaFumigadoraService);
    guardando = false;

    form: Partial<EmpresaFumigadora> = {
        nit: '',
        nombre_empresa: '',
        numCerSanitario: '',    // ← nombre correcto
        fechaVencCer: new Date(), // ← nombre correcto
        registroSds: '',          // ← nombre correcto
        telefonoContacto: ''
    };

    ngOnInit(): void {
        if (this.empresa) {
            this.form = { ...this.empresa };
        } else {
            this.form.programaPlagasId = this.programaPlagasId;
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['empresa']) {
            if (this.empresa) {
                this.form = { ...this.empresa };
            } else {
                // Reset al abrir formulario de creación
                this.form = {
                    nit: '',
                    nombre_empresa: '',
                    numCerSanitario: '',
                    fechaVencCer: new Date(),
                    registroSds: '',
                    telefonoContacto: '',

                };
            }
        }
    }

    async onGuardar(): Promise<void> {
        if (!this.form.nit || !this.form.nombre_empresa || !this.form.numCerSanitario) return;
        this.guardando = true;
        try {
            const payload = { ...this.form, programaPlagasId: this.programaPlagasId };
            if (this.empresa?.id) {
                await firstValueFrom(this.service.actualizar(this.empresa.id, payload));
            } else {
                await firstValueFrom(this.service.crear(payload));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}