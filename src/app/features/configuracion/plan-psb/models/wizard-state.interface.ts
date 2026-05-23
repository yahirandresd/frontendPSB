import { Empresa } from '../../empresa/models/empresa.interface';

export interface WizardState {
    empresa: Partial<Empresa>;
    pasoActual: number;
}
