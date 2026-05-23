import { Injectable, signal } from '@angular/core';
import { Registro } from '../models/registro.interface';

@Injectable({ providedIn: 'root' })
export class RegistroStore {
    private _items = signal<Registro[]>([]);
    private _selected = signal<Registro | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: Registro[]) { this._items.set(items); }
    setSelected(item: Registro | null) { this._selected.set(item); }
    add(item: Registro) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<Registro>) { this._items.update(list => list.map(r => r.id === id ? { ...r, ...changes } : r)); }
    remove(id: string) { this._items.update(list => list.filter(r => r.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
