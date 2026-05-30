import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { PasoLimpiezaService } from '../../services/paso-limpieza.service';
import { PasoLimpiezaFormComponent } from '../../components/paso-limpieza-form/paso-limpieza-form.component';
import { PasoLimpieza } from '../../models/paso-limpieza.interface';
import { UpdatePasoLimpiezaDto } from '../../models/update-paso-limpieza.dto';
import { PasoLimpiezaPqService } from '@/app/features/limpieza/paso-limpieza-pq/services/paso-limpieza-pq.service';
import { PasoLimpiezaPq } from '@/app/features/limpieza/paso-limpieza-pq/models/paso-limpieza-pq.interface';
import { ConcentracionUnidad } from '@/app/features/limpieza/paso-limpieza-pq/models/create-paso-limpieza-pq.dto';
import { ProductoQuimicoService } from '@/app/features/limpieza/producto-quimico/services/producto-quimico.service';
import { ProductoQuimico } from '@/app/features/limpieza/producto-quimico/models/producto-quimico.interface';

@Component({
    selector: 'app-paso-limpieza-edit',
    standalone: true,
    imports: [
        PasoLimpiezaFormComponent,
        ToastModule,
        ButtonModule,
        InputNumberModule,
        DividerModule,
        ConfirmDialogModule,
        TooltipModule,
        SelectModule,
        ReactiveFormsModule,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './paso-limpieza-edit.component.html',
    styleUrls: ['./paso-limpieza-edit.component.scss']
})
export class PasoLimpiezaEditComponent implements OnInit {
    private service             = inject(PasoLimpiezaService);
    private pqService           = inject(PasoLimpiezaPqService);
    private productoService     = inject(ProductoQuimicoService);
    private router              = inject(Router);
    private route               = inject(ActivatedRoute);
    private messageService      = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private fb                  = inject(FormBuilder);

    paso          = signal<PasoLimpieza | undefined>(undefined);
    productosPq   = signal<PasoLimpiezaPq[]>([]);
    catalogo      = signal<ProductoQuimico[]>([]);
    mostrarFormPq = signal(false);
    guardandoPq   = signal(false);

    programaId = this.route.snapshot.paramMap.get('programaId')!;
    private id = this.route.snapshot.paramMap.get('id')!;

    unidadOptions: { label: string; value: ConcentracionUnidad }[] = [
        { label: 'ppm',  value: 'ppm'  },
        { label: '%',    value: '%'    },
        { label: 'mL/L', value: 'mL/L' },
    ];

    formPq: FormGroup = this.fb.group({
        productoQuimicoId:   [null, Validators.required],
        concentracionValor:  [null, [Validators.required, Validators.min(0)]],
        concentracionUnidad: [null, Validators.required],
        tiempoContactoMin:   [null, [Validators.required, Validators.min(1)]],
    });

    async ngOnInit(): Promise<void> {
        try {
            const [paso, catalogo] = await Promise.all([
                firstValueFrom(this.service.getById(this.id)),
                firstValueFrom(this.productoService.getAll()).catch(() => [] as ProductoQuimico[]),
            ]);
            this.paso.set(paso);
            this.catalogo.set(catalogo);
            await this.cargarProductos();
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el paso' });
        }
    }

    async cargarProductos(): Promise<void> {
        try {
            const data = await firstValueFrom(this.pqService.getByPaso(this.id));
            this.productosPq.set(data);
        } catch {
            this.productosPq.set([]);
        }
    }

    async onFormSubmit(dto: UpdatePasoLimpiezaDto): Promise<void> {
        try {
            await firstValueFrom(this.service.update(this.id, dto));
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Paso actualizado correctamente' });
            setTimeout(() => this.router.navigate(['../../'], { relativeTo: this.route }), 1000);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el paso' });
        }
    }

    async onGuardarPq(): Promise<void> {
        if (this.formPq.invalid) {
            this.formPq.markAllAsTouched();
            return;
        }
        this.guardandoPq.set(true);
        try {
            const raw = this.formPq.getRawValue();
            await firstValueFrom(this.pqService.create({
                pasoLimpiezaId:      this.id,
                productoQuimicoId:   raw.productoQuimicoId,
                concentracionValor:  raw.concentracionValor,
                concentracionUnidad: raw.concentracionUnidad,
                tiempoContactoMin:   raw.tiempoContactoMin,
            }));
            this.formPq.reset();
            this.mostrarFormPq.set(false);
            await this.cargarProductos();
            this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Producto químico agregado' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el producto' });
        } finally {
            this.guardandoPq.set(false);
        }
    }

    nombreProducto(pq: PasoLimpiezaPq): string {
        return this.catalogo().find(p => p.id === pq.productoQuimicoId)?.nombre ?? 'Producto';
    }

    confirmarEliminarPq(pq: PasoLimpiezaPq): void {
        this.confirmationService.confirm({
            message: `¿Eliminar el producto "<strong>${this.nombreProducto(pq)}</strong>"?`,
            header: 'Eliminar producto químico',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.eliminarPq(pq.id),
        });
    }

    async eliminarPq(id: string): Promise<void> {
        try {
            await firstValueFrom(this.pqService.delete(id));
            this.productosPq.update(lista => lista.filter(p => p.id !== id));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado' });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto' });
        }
    }

    cancelarFormPq(): void {
        this.formPq.reset();
        this.mostrarFormPq.set(false);
    }
}
