import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { ProductoQuimico } from '../models/producto-quimico.interface';
import { CreateProductoQuimicoDto } from '../models/create-producto-quimico.dto';
import { UpdateProductoQuimicoDto } from '../models/update-producto-quimico.dto';

@Injectable({ providedIn: 'root' })
export class ProductoQuimicoService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/productos-quimicos`;

    getAll(): Observable<ProductoQuimico[]> {
        return this.http.get<ProductoQuimico[]>(this.url);
    }

    getById(id: string): Observable<ProductoQuimico> {
        return this.http.get<ProductoQuimico>(`${this.url}/${id}`);
    }

    getByEmpresa(empresaId: string): Observable<ProductoQuimico[]> {
        return this.http.get<ProductoQuimico[]>(`${this.url}/por-empresa/${empresaId}`);
    }

    create(dto: CreateProductoQuimicoDto): Observable<ProductoQuimico> {
        return this.http.post<ProductoQuimico>(this.url, dto);
    }

    update(id: string, dto: UpdateProductoQuimicoDto): Observable<ProductoQuimico> {
        return this.http.patch<ProductoQuimico>(`${this.url}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
