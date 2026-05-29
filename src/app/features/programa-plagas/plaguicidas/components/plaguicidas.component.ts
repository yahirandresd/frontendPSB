import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
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
    @Input() programaPlagasId!: string;            // ✅ recibir el ID del programa
    @Output() guardado = new EventEmitter<void>();
    @Output() cancelado = new EventEmitter<void>();

    private service = inject(PlaguicidaService);
    guardando = false;

    form: Partial<Plaguicida> = {
        codigoRegistro: '',
        nombreComercial: '',
        ingredienteActivo: '',
        categoriaOms: '',          // ✅ corregido
        registroIca: '',           // ✅ corregido
        dosisAplicacion: '',
        fichaTecnicaUrl: '',
        accionesCorrectivasPlagas: ''
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['plaguicida']) {
            if (this.plaguicida) {
                this.form = { ...this.plaguicida };
            } else {
                // Reset al abrir formulario de creación
                this.form = {
                    codigoRegistro: '',
                    nombreComercial: '',
                    ingredienteActivo: '',
                    categoriaOms: '',
                    registroIca: '',
                    dosisAplicacion: '',
                    fichaTecnicaUrl: '',
                    accionesCorrectivasPlagas: ''
                };
            }
        }
    }

    async onGuardar(): Promise<void> {
        console.log('INPUT programaPlagasId:', this.programaPlagasId);
        if (!this.form.codigoRegistro || !this.form.nombreComercial || !this.form.ingredienteActivo) return;

        this.guardando = true;

        // ✅ Construir payload con nombres correctos para el API
        const payload: Partial<Plaguicida> = {
            programaPlagasId: this.programaPlagasId,
            codigoRegistro: this.form.codigoRegistro,
            nombreComercial: this.form.nombreComercial,
            ingredienteActivo: this.form.ingredienteActivo,
            categoriaOms: this.form.categoriaOms,
            registroIca: this.form.registroIca,
            dosisAplicacion: this.form.dosisAplicacion,
            fichaTecnicaUrl: this.form.fichaTecnicaUrl,
            accionesCorrectivasPlagas: this.form.accionesCorrectivasPlagas ?? ''
        };

        try {
            if (this.plaguicida?.id) {
                await firstValueFrom(this.service.actualizar(this.plaguicida.id, payload));
            } else {
                await firstValueFrom(this.service.crear(payload));
            }
            this.guardado.emit();
        } catch (e) {
            console.error('Error al guardar plaguicida:', e);
        } finally {
            this.guardando = false;
        }
    }

    onCancelar(): void { this.cancelado.emit(); }
}