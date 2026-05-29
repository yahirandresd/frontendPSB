import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductoQuimicoService } from '../../services/producto-quimico.service';
import { ProductoQuimicoFormComponent } from '../../components/producto-quimico-form/producto-quimico-form.component';
import { CreateProductoQuimicoDto } from '../../models/create-producto-quimico.dto';
import { UpdateProductoQuimicoDto } from '../../models/update-producto-quimico.dto';

@Component({
    selector: 'app-producto-quimico-create',
    standalone: true,
    imports: [ProductoQuimicoFormComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './producto-quimico-create.component.html',
    styleUrls: ['./producto-quimico-create.component.scss']
})
export class ProductoQuimicoCreateComponent {
    private service = inject(ProductoQuimicoService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    async onSubmit(dto: CreateProductoQuimicoDto | UpdateProductoQuimicoDto): Promise<void> {
        try {
            await firstValueFrom(this.service.create(dto as CreateProductoQuimicoDto));
            this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Producto químico creado correctamente' });
            setTimeout(() => this.router.navigate(['/limpieza/productos-quimicos']), 500);
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el producto químico' });
        }
    }
}
