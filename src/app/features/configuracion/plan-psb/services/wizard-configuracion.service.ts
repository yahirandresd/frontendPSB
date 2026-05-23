import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WizardState } from '../models/wizard-state.interface';

const INITIAL_STATE: WizardState = {
    empresa: {},
    pasoActual: 0
};

@Injectable()
export class WizardConfiguracionService {
    private state$ = new BehaviorSubject<WizardState>({ ...INITIAL_STATE });

    getState(): Observable<WizardState> {
        return this.state$.asObservable();
    }

    getSnapshot(): WizardState {
        return this.state$.getValue();
    }

    setEmpresa(empresa: WizardState['empresa']): void {
        this.state$.next({ ...this.state$.getValue(), empresa });
    }

    setPasoActual(pasoActual: number): void {
        this.state$.next({ ...this.state$.getValue(), pasoActual });
    }

    resetWizard(): void {
        this.state$.next({ ...INITIAL_STATE });
    }
}
