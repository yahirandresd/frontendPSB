import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { Usuario, UsuarioRol } from '../../models/usuario.interface';
import { CreateUsuarioDto } from '../../models/create-usuario.dto';
import { UpdateUsuarioDto } from '../../models/update-usuario.dto';

@Component({
    selector: 'app-usuario-form',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, PasswordModule, SelectModule, ButtonModule],
    templateUrl: './usuario-form.component.html',
    styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {
    @Input() usuario?: Usuario;
    @Output() formSubmit = new EventEmitter<CreateUsuarioDto | UpdateUsuarioDto>();

    private fb = inject(FormBuilder);

    rolesOpciones: { label: string; value: UsuarioRol }[] = [
        { label: 'Admin',       value: 'admin'      },
        { label: 'Supervisor',  value: 'supervisor' },
        { label: 'Calidad',     value: 'calidad'    },
        { label: 'Operario',    value: 'operario'   },
    ];

    estadoOpciones = [
        { label: 'Activo',   value: 'activo'   },
        { label: 'Inactivo', value: 'inactivo' },
    ];

    form: FormGroup = this.fb.group({
        empresa_id:        ['', Validators.required],
        nombre:            ['', Validators.required],
        email:             ['', [Validators.required, Validators.email]],
        password:          ['', [Validators.required, Validators.minLength(6)]],
        rol:               ['', Validators.required],
        cargo:             [''],
        estado:            ['activo'],
        pin_firma_hash:    [''],
        firma_digitalizada: [''],
    });

    get f() { return this.form.controls; }
    get esEdicion(): boolean { return !!this.usuario; }

    ngOnInit(): void {
        if (this.usuario) {
            this.form.patchValue({
                nombre:            this.usuario.nombre,
                rol:               this.usuario.rol,
                cargo:             this.usuario.cargo ?? '',
                estado:            this.usuario.estado,
                firma_digitalizada: this.usuario.firma_digitalizada ?? '',
                // pin_firma_hash se deja vacío intencionalmente: no se muestra ni se envía salvo que el admin lo cambie
            });
            this.f['empresa_id'].disable();
            this.f['email'].disable();
            this.f['password'].clearValidators();
            this.f['password'].disable();
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const raw = this.form.getRawValue();
        const payload = this.usuario
            ? {
                nombre:            raw.nombre,
                rol:               raw.rol,
                cargo:             raw.cargo || undefined,
                estado:            raw.estado,
                ...(raw.pin_firma_hash ? { pin_firma_hash: raw.pin_firma_hash } : {}),
                firma_digitalizada: raw.firma_digitalizada || undefined,
              } as UpdateUsuarioDto
            : {
                empresa_id:        raw.empresa_id,
                nombre:            raw.nombre,
                email:             raw.email,
                password:          raw.password,
                rol:               raw.rol,
                cargo:             raw.cargo || undefined,
                estado:            raw.estado || undefined,
                pin_firma_hash:    raw.pin_firma_hash || undefined,
                firma_digitalizada: raw.firma_digitalizada || undefined,
              } as CreateUsuarioDto;
        this.formSubmit.emit(payload);
    }
}
