import { Injectable, signal } from '@angular/core';
import { ProgramaAgua } from '../models/programa-agua.interface';

@Injectable({ providedIn: 'root' })
export class ProgramaAguaStore {
    private _programasAgua = signal<ProgramaAgua[]>([]);
    private _selected = signal<ProgramaAgua | null>(null);
    private _loading = signal(false);

    readonly programasAgua = this._programasAgua.asReadonly();
    readonly selected = this._selected.asReadonly();
    readonly loading = this._loading.asReadonly();

    setAll(items: ProgramaAgua[]) { this._programasAgua.set(items); }
    setSelected(item: ProgramaAgua | null) { this._selected.set(item); }
    add(item: ProgramaAgua) { this._programasAgua.update(list => [...list, item]); }
    update(id: string, changes: Partial<ProgramaAgua>) {
        this._programasAgua.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p));
    }
    remove(id: string) { this._programasAgua.update(list => list.filter(p => p.id !== id)); }
    setLoading(value: boolean) { this._loading.set(value); }
}
