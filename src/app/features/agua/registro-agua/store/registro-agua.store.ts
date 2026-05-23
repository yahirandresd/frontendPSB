import { Injectable, signal } from '@angular/core';
import { RegistroAgua } from '../models/registro-agua.interface';
@Injectable({ providedIn: 'root' })
export class RegistroAguaStore {
    private _items = signal<RegistroAgua[]>([]);
    private _selected = signal<RegistroAgua | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: RegistroAgua[]) { this._items.set(items); }
    setSelected(item: RegistroAgua | null) { this._selected.set(item); }
    add(item: RegistroAgua) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<RegistroAgua>) { this._items.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p)); }
    remove(id: string) { this._items.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
