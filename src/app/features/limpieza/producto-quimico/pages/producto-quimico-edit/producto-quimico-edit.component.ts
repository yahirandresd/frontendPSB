import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ProductoQuimicoService } from '../../services/producto-quimico.service';
import { ProductoQuimicoFormComponent } from '../../components/producto-quimico-form/producto-quimico-form.component';
import { ProductoQuimico } from '../../models/producto-quimico.interface';
import { UpdateProductoQuimicoDto } from '../../models/update-producto-quimico.dto';

@Component({
    selector: 'app-producto-quimico-edit',
    standalone: true,
    imports: [ProductoQuimicoFormComponent, ToastModule, ProgressSpinnerModule],
    providers: [MessageService],
    templateUrl: './producto-quimico-edit.component.html',
    styleUrls: ['./producto-quimico-edit.component.scss']
})
export class ProductoQuimicoEditComponent implements OnInit {
    private service = inject(ProductoQuimicoService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);

    producto = signal<ProductoQuimico | null>(null);
    cargando = signal(true);

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            this.producto.set(await firstValueFrom(this.service.getById(id)));
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el producto' });
        } finally {
            this.cargando.set(false);
        }
    }

    async onSubmit(dto: UpdateProductoQuimicoDto): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id')!;
        try {
            await firstValueFrom(this.service.update(id, dto));
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Producto químico actualizado correctamente' });
            setTimeout(() => this.router.navigate(['/limpieza/productos-quimicos']), 500);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el producto químico' });
        }
    }
}
