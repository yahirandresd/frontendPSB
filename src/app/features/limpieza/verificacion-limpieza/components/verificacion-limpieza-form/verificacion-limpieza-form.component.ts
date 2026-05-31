import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { VerificacionLimpieza, TipoVerificacion, MetodoValidacion } from '../../models/verificacion-limpieza.interface';
import { CreateVerificacionLimpiezaDto } from '../../models/create-verificacion-limpieza.dto';
import { UpdateVerificacionLimpiezaDto } from '../../models/update-verificacion-limpieza.dto';
import { UsuarioService } from '@/app/features/usuarios/services/usuario.service';

@Component({
    selector: 'app-verificacion-limpieza-form',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
    templateUrl: './verificacion-limpieza-form.component.html',
    styleUrls: ['./verificacion-limpieza-form.component.scss']
})
export class VerificacionLimpiezaFormComponent implements OnInit {
    @Input() verificacion?: VerificacionLimpieza;
    @Input() registroLimpiezaId!: string;
    @Output() formSubmit = new EventEmitter<CreateVerificacionLimpiezaDto | UpdateVerificacionLimpiezaDto>();
    @Output() cancelar = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private usuarioService = inject(UsuarioService);

    usuarios = signal<{ label: string; value: string }[]>([]);

    tipoOpciones: { label: string; value: TipoVerificacion }[] = [
        { label: 'ATP',            value: 'ATP'            },
        { label: 'Visual',         value: 'VISUAL'         },
        { label: 'Microbiológico', value: 'MICROBIOLOGICO' },
        { label: 'Alérgenos',      value: 'ALERGENOS'      },
        { label: 'Químico',        value: 'QUIMICO'        }
    ];

    metodoOpciones: { label: string; value: MetodoValidacion }[] = [
        { label: 'ATP',            value: 'ATP'            },
        { label: 'Alérgenos',      value: 'ALERGENOS'      },
        { label: 'Visual',         value: 'VISUAL'         },
        { label: 'Microbiológico', value: 'MICROBIOLOGICO' }
    ];

    form = this.fb.group({
        responsableId:            ['', Validators.required],
        tipo:                     [null as TipoVerificacion | null, Validators.required],
        resultado:                ['', Validators.required],
        fechaPrueba:              ['', Validators.required],
        unidad:                   [null as string | null],
        limiteAceptable:          [null as string | null],
        metodoValidacion:         [null as MetodoValidacion | null],
        loteReactivo:             [null as string | null],
        fechaVencimientoReactivo: [null as string | null]
    });

    async ngOnInit(): Promise<void> {
        const usuarios = await firstValueFrom(this.usuarioService.getAll());
        this.usuarios.set(usuarios.map(u => ({
            label: u.cargo ? `${u.nombre} — ${u.cargo}` : u.nombre,
            value: u.id
        })));

        this.form.get('metodoValidacion')!.valueChanges.subscribe(val => {
            this.actualizarValidadoresFecha(val);
        });

        if (this.verificacion) {
            this.form.get('responsableId')!.disable();
            this.form.get('tipo')!.disable();
            this.form.get('fechaPrueba')!.disable();

            this.form.patchValue({
                responsableId:            this.verificacion.responsableId,
                tipo:                     this.verificacion.tipo,
                resultado:                this.verificacion.resultado,
                fechaPrueba:              this.verificacion.fechaPrueba.substring(0, 10),
                unidad:                   this.verificacion.unidad             ?? null,
                limiteAceptable:          this.verificacion.limiteAceptable    ?? null,
                metodoValidacion:         this.verificacion.metodoValidacion   ?? null,
                loteReactivo:             this.verificacion.loteReactivo       ?? null,
                fechaVencimientoReactivo: this.verificacion.fechaVencimientoReactivo
                    ? this.verificacion.fechaVencimientoReactivo.substring(0, 10)
                    : null
            });

            this.actualizarValidadoresFecha(this.verificacion.metodoValidacion ?? null);
        }
    }

    private actualizarValidadoresFecha(metodo: MetodoValidacion | null): void {
        const ctrl = this.form.get('fechaVencimientoReactivo')!;
        if (metodo === 'ATP' || metodo === 'ALERGENOS') {
            ctrl.setValidators([Validators.required, this.fechaNoVencida]);
        } else {
            ctrl.clearValidators();
        }
        ctrl.updateValueAndValidity();
    }

    private fechaNoVencida(ctrl: AbstractControl): ValidationErrors | null {
        if (!ctrl.value) return null;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return new Date(ctrl.value) < hoy ? { vencido: true } : null;
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        const raw = this.form.getRawValue();

        if (this.verificacion) {
            const dto: UpdateVerificacionLimpiezaDto = {
                resultado:                raw.resultado                || undefined,
                unidad:                   raw.unidad                   || undefined,
                limiteAceptable:          raw.limiteAceptable          || undefined,
                metodoValidacion:         raw.metodoValidacion         ?? undefined,
                loteReactivo:             raw.loteReactivo             || undefined,
                fechaVencimientoReactivo: raw.fechaVencimientoReactivo || undefined
            };
            this.formSubmit.emit(dto);
        } else {
            const dto: CreateVerificacionLimpiezaDto = {
                registroLimpiezaId:       this.registroLimpiezaId,
                responsableId:            raw.responsableId!,
                tipo:                     raw.tipo!,
                resultado:                raw.resultado!,
                fechaPrueba:              raw.fechaPrueba!,
                unidad:                   raw.unidad                   || undefined,
                limiteAceptable:          raw.limiteAceptable          || undefined,
                metodoValidacion:         raw.metodoValidacion         ?? undefined,
                loteReactivo:             raw.loteReactivo             || undefined,
                fechaVencimientoReactivo: raw.fechaVencimientoReactivo || undefined
            };
            this.formSubmit.emit(dto);
        }
    }
}
