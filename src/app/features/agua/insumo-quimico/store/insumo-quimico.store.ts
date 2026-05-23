import { Injectable, signal } from '@angular/core';
import { InsumoQuimico } from '../models/insumo-quimico.interface';
@Injectable({ providedIn: 'root' })
export class InsumoQuimicoStore {
    private _items = signal<InsumoQuimico[]>([]);
    private _selected = signal<InsumoQuimico | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: InsumoQuimico[]) { this._items.set(items); }
    setSelected(item: InsumoQuimico | null) { this._selected.set(item); }
    add(item: InsumoQuimico) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<InsumoQuimico>) { this._items.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p)); }
    remove(id: string) { this._items.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
