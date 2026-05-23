export interface RegistroPlagas {
  id: string;
  registroId: string;
  programaPlagaId: string;
  tipoActividad: 'mensual' | 'trimestral' | 'anual' | 'inspeccion';
  resultadoGeneral: string;
      // Firmas: usuario que realiza y usuario que aprueba
  firmadoPorId: string;
  aprobadoPorId: string;
  firmadoPor?: { id: string; nombre: string; firma: string };
  aprobadoPor?: { id: string; nombre: string; firma: string }
}