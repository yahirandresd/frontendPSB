import { Injectable, signal } from '@angular/core';
import { FuenteAgua } from '../models/fuente-agua.interface';
@Injectable({ providedIn: 'root' })
export class FuenteAguaStore {
    private _items = signal<FuenteAgua[]>([]);
    private _selected = signal<FuenteAgua | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: FuenteAgua[]) { this._items.set(items); }
    setSelected(item: FuenteAgua | null) { this._selected.set(item); }
    add(item: FuenteAgua) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<FuenteAgua>) { this._items.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p)); }
    remove(id: string) { this._items.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
