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
        empresaId:         ['', Validators.required],
        nombre:            ['', Validators.required],
        email:             ['', [Validators.required, Validators.email]],
        password:          ['', [Validators.required, Validators.minLength(6)]],
        rol:               ['', Validators.required],
        cargo:             [''],
        estado:            ['activo'],
        pinFirmaHash:      [''],
        firmaDigitalizada: [''],
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
                firmaDigitalizada: this.usuario.firmaDigitalizada ?? '',
            });
            this.f['empresaId'].disable();
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
                ...(raw.pinFirmaHash ? { pinFirmaHash: raw.pinFirmaHash } : {}),
                firmaDigitalizada: raw.firmaDigitalizada || undefined,
              } as UpdateUsuarioDto
            : {
                empresaId:         raw.empresaId,
                nombre:            raw.nombre,
                email:             raw.email,
                password:          raw.password,
                rol:               raw.rol,
                cargo:             raw.cargo || undefined,
                estado:            raw.estado || undefined,
                pinFirmaHash:      raw.pinFirmaHash || undefined,
                firmaDigitalizada: raw.firmaDigitalizada || undefined,
              } as CreateUsuarioDto;
        this.formSubmit.emit(payload);
    }
}
