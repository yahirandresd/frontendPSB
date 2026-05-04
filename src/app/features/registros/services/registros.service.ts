import { Injectable, signal } from '@angular/core';
import { Registro } from '../models/registro.model';

export const TIPOS_ACTIVIDAD = [
    'Control de Medicación',
    'Control Glucemia',
    'Desinfección Quirófano',
    'Suministro de Oxígeno',
    'Revisión Inventario EPP',
    'Control de Temperatura',
    'Limpieza General',
    'Revisión de Equipos',
];

@Injectable({ providedIn: 'root' })
export class RegistrosService {

    private nextId = 5;

    private _registros = signal<Registro[]>([
        {
            id: 1,
            fecha: '2024-05-24',
            tipoActividad: 'Control Glucemia',
            responsable: 'Enf. Elena R.',
            observaciones: 'Todos los niveles estables en planta 3.',
            estado: 'Completado'
        },
        {
            id: 2,
            fecha: '2024-05-24',
            tipoActividad: 'Desinfección Quirófano',
            responsable: 'Limpieza - Jorge M.',
            observaciones: 'Protocolo COVID-19 aplicado tras cirugía.',
            estado: 'Completado'
        },
        {
            id: 3,
            fecha: '2024-05-24',
            tipoActividad: 'Suministro de Oxígeno',
            responsable: 'Téc. Carlos P.',
            observaciones: 'Reemplazo de tanques en UCI.',
            estado: 'Pendiente'
        },
        {
            id: 4,
            fecha: '2024-05-23',
            tipoActividad: 'Revisión Inventario EPP',
            responsable: 'Dra. Marta L.',
            observaciones: 'Stock de mascarillas bajo (15%).',
            estado: 'Completado'
        },
    ]);

    readonly registros = this._registros.asReadonly();

    agregar(registro: Omit<Registro, 'id'>) {
        this._registros.update(list => [
            { ...registro, id: this.nextId++ },
            ...list
        ]);
    }

    eliminar(id: number) {
        this._registros.update(list => list.filter(r => r.id !== id));
    }

    actualizar(id: number, cambios: Partial<Registro>) {
        this._registros.update(list =>
            list.map(r => r.id === id ? { ...r, ...cambios } : r)
        );
    }
}