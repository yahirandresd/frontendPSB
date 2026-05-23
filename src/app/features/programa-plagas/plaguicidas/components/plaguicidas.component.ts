import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom } from 'rxjs';
import { PlaguicidaService } from '../services/plaguicida.service';
import { Plaguicida } from '../models/plaguicida';

@Component({
    selector: 'app-plaguicida-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule],
    templateUrl: './plaguicidas.html'
})
export class PlaguicidaComponent implements OnInit {
    @Input() plaguicida: Plaguicida | null = null;
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(PlaguicidaService);
    guardando = false;

    form: Partial<Plaguicida> = {
        codigoRegistro: '', nombreComercial: '',
        ingredienteActivo: '', categoriaOMS: '',
        dosisAplicacion: '', registroICA: ''
    };

    readonly categoriasOMS = [
        { label: 'Ia – Extremadamente peligroso', value: 'Ia' },
        { label: 'Ib – Muy peligroso', value: 'Ib' },
        { label: 'II – Moderadamente peligroso', value: 'II' },
        { label: 'III – Poco peligroso', value: 'III' },
        { label: 'U – Normalmente no peligroso', value: 'U' }
    ];

    ngOnInit(): void {
        if (this.plaguicida) this.form = { ...this.plaguicida };
    }

    async onGuardar(): Promise<void> {
        if (!this.form.codigoRegistro || !this.form.nombreComercial || !this.form.ingredienteActivo) return;
        this.guardando = true;
        try {
            if (this.plaguicida?.id) {
                await firstValueFrom(this.service.actualizar(this.plaguicida.id, this.form));
            } else {
                await firstValueFrom(this.service.crear(this.form));
            }
            this.guardado.emit();
        } catch {
        } finally { this.guardando = false; }
    }

    onCancelar(): void { this.cancelado.emit(); }
}