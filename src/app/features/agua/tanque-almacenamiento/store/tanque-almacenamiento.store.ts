import { Injectable, signal } from '@angular/core';
import { TanqueAlmacenamiento } from '../models/tanque-almacenamiento.interface';
@Injectable({ providedIn: 'root' })
export class TanqueAlmacenamientoStore {
    private _items = signal<TanqueAlmacenamiento[]>([]);
    private _selected = signal<TanqueAlmacenamiento | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: TanqueAlmacenamiento[]) { this._items.set(items); }
    setSelected(item: TanqueAlmacenamiento | null) { this._selected.set(item); }
    add(item: TanqueAlmacenamiento) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<TanqueAlmacenamiento>) { this._items.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p)); }
    remove(id: string) { this._items.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
