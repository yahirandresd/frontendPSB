export interface Plaguicida {
  id: string;
  programaPlagasId: string;
  codigoRegistro: string;
  nombreComercial: string;
  ingredienteActivo: string;
  categoriaOms: string;   // 'Ia' | 'Ib' | 'II' | 'III' | 'U'
  dosisAplicacion: string;
  registroIca: string;
  fichaTecnicaUrl?: string;
  accionesCorrectivasPlagas?: string;

}
