import { Injectable, signal } from '@angular/core';
import { AnalisisLaboratorio } from '../models/analisis-laboratorio.interface';
@Injectable({ providedIn: 'root' })
export class AnalisisLaboratorioStore {
    private _items = signal<AnalisisLaboratorio[]>([]);
    private _selected = signal<AnalisisLaboratorio | null>(null);
    private _loading = signal(false);
    readonly items = this._items.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();
    setAll(items: AnalisisLaboratorio[]) { this._items.set(items); }
    setSelected(item: AnalisisLaboratorio | null) { this._selected.set(item); }
    add(item: AnalisisLaboratorio) { this._items.update(list => [...list, item]); }
    update(id: string, changes: Partial<AnalisisLaboratorio>) { this._items.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p)); }
    remove(id: string) { this._items.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
