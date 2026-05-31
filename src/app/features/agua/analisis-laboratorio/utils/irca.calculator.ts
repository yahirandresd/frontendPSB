export interface ResultadoIRCA {
    puntajeIncumplido: number;
    irca: number;
    nivelRiesgo: string;
    cumpleFisicoquimica: boolean;
    cumpleMicrobiologica: boolean;
    cumpleGeneral: boolean;
    resultado: string;
}

const PUNTAJE_IRCA = {
    colorAparente: 6,
    turbiedad: 15,
    ph: 1.5,
    cloroResidual: 15,
    coliformesTotales: 15,
    eColi: 25,
    mesofilos: 16,
};

const PUNTAJE_MAXIMO_IRCA = 93.5;

const LIMITES = {
    cloro: { min: 0.3, max: 2.0 },
    ph: { min: 6.5, max: 9.0 },
    turbiedad: { max: 2 },
    color: { max: 15 },
};

export function calcularIRCA(params: {
    cloroResidual: number;
    ph: number;
    turbiedad: number;
    colorAparente: number;
    coliformesTotalesPresentes: boolean;
    eColiPresente: boolean;
    mesofilos: number;
}): ResultadoIRCA {
    const cumpleFisicoquimica =
        params.cloroResidual >= LIMITES.cloro.min &&
        params.cloroResidual <= LIMITES.cloro.max &&
        params.ph >= LIMITES.ph.min &&
        params.ph <= LIMITES.ph.max &&
        params.turbiedad <= LIMITES.turbiedad.max &&
        params.colorAparente <= LIMITES.color.max;

    const cumpleMicrobiologica =
        !params.coliformesTotalesPresentes &&
        !params.eColiPresente;

    let puntajeIncumplido = 0;

    if (params.colorAparente > LIMITES.color.max)
        puntajeIncumplido += PUNTAJE_IRCA.colorAparente;
    if (params.turbiedad > LIMITES.turbiedad.max)
        puntajeIncumplido += PUNTAJE_IRCA.turbiedad;
    if (params.ph < LIMITES.ph.min || params.ph > LIMITES.ph.max)
        puntajeIncumplido += PUNTAJE_IRCA.ph;
    if (params.cloroResidual < LIMITES.cloro.min || params.cloroResidual > LIMITES.cloro.max)
        puntajeIncumplido += PUNTAJE_IRCA.cloroResidual;
    if (params.coliformesTotalesPresentes)
        puntajeIncumplido += PUNTAJE_IRCA.coliformesTotales;
    if (params.eColiPresente)
        puntajeIncumplido += PUNTAJE_IRCA.eColi;
    if (params.mesofilos > 0)
        puntajeIncumplido += PUNTAJE_IRCA.mesofilos;

    const irca = parseFloat(((puntajeIncumplido / PUNTAJE_MAXIMO_IRCA) * 100).toFixed(2));

    const nivelRiesgo =
        irca <= 5 ? 'sin_riesgo' :
        irca <= 14 ? 'riesgo_bajo' :
        irca <= 35 ? 'riesgo_medio' :
        irca <= 80 ? 'riesgo_alto' : 'inviable_sanitariamente';

    const cumpleGeneral = cumpleFisicoquimica && cumpleMicrobiologica;

    return {
        puntajeIncumplido,
        irca,
        nivelRiesgo,
        cumpleFisicoquimica,
        cumpleMicrobiologica,
        cumpleGeneral,
        resultado: cumpleGeneral ? 'apto' : 'no_apto',
    };
}

export function getNivelRiesgoLabel(nivel: string): string {
    switch (nivel) {
        case 'sin_riesgo': return 'Sin Riesgo';
        case 'riesgo_bajo': return 'Riesgo Bajo';
        case 'riesgo_medio': return 'Riesgo Medio';
        case 'riesgo_alto': return 'Riesgo Alto';
        case 'inviable_sanitariamente': return 'Inviable Sanitariamente';
        default: return nivel;
    }
}

export function getNivelRiesgoSeverity(nivel: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (nivel) {
        case 'sin_riesgo': return 'success';
        case 'riesgo_bajo': return 'info';
        case 'riesgo_medio': return 'warn';
        case 'riesgo_alto':
        case 'inviable_sanitariamente': return 'danger';
        default: return 'info';
    }
}
