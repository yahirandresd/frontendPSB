import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(EmpresaFumigadoraService);
    guardando = false;

    form: Partial<EmpresaFumigadora> = {
        nit: '', nombreEmpresa: '', numCertSanitario: '',
        fechaVencCert: new Date(), registroSDS: '', telefonoContacto: ''
    };

    ngOnInit(): void {
        if (this.empresa) this.form = { ...this.empresa };
    }

    async onGuardar(): Promise<void> {
        if (!this.form.nit || !this.form.nombreEmpresa || !this.form.numCertSanitario) return;
        this.guardando = true;
        try {
            if (this.empresa?.id) {
                await firstValueFrom(this.service.actualizar(this.empresa.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}