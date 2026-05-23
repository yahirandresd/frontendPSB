import { Injectable, signal } from '@angular/core';
import { AccionCorrectivaAgua } from '../models/accion-correctiva-agua.interface';
@Injectable({ providedIn: 'root' })
export class AccionCorrectivaAguaStore {
    private _items = signal<AccionCorrectivaAgua[]>([]);
    private _selected = signal<AccionCorrectivaAgua | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: AccionCorrectivaAgua[]) { this._items.set(items); }
    setSelected(item: AccionCorrectivaAgua | null) { this._selected.set(item); }
    add(item: AccionCorrectivaAgua) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<AccionCorrectivaAgua>) { this._items.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p)); }
    remove(id: string) { this._items.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
