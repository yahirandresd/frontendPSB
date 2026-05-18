import { Empresa } from '../../empresa/models/empresa.interface';
import { TipoAlimento } from '../../tipo-alimento/models/tipo-alimento.interface';
import { PlanPSB } from './plan-psb.interface';

export interface WizardState {
    empresa: Partial<Empresa>;
    tiposAlimento: Partial<TipoAlimento>[];
    planPsb: Partial<PlanPSB>;
    pasoActual: number;
}
