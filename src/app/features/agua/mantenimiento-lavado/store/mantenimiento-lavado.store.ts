import { Injectable, signal } from '@angular/core';
import { MantenimientoLavado } from '../models/mantenimiento-lavado.interface';
@Injectable({ providedIn: 'root' })
export class MantenimientoLavadoStore {
    private _items = signal<MantenimientoLavado[]>([]);
    private _selected = signal<MantenimientoLavado | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: MantenimientoLavado[]) { this._items.set(items); }
    setSelected(item: MantenimientoLavado | null) { this._selected.set(item); }
    add(item: MantenimientoLavado) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<MantenimientoLavado>) { this._items.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p)); }
    remove(id: string) { this._items.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
