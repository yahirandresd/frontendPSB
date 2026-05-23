import { Injectable, signal } from '@angular/core';
import { Programa } from '../models/programa.interface';

@Injectable({ providedIn: 'root' })
export class ProgramaStore {
    private _items = signal<Programa[]>([]);
    private _selected = signal<Programa | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: Programa[]) { this._items.set(items); }
    setSelected(item: Programa | null) { this._selected.set(item); }
    add(item: Programa) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<Programa>) { this._items.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p)); }
    remove(id: string) { this._items.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
