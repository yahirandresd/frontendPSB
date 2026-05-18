export interface Plaguicida {
  id: string;
  codigoRegistro: string;
  nombreComercial: string;
  ingredienteActivo: string;
  categoriaOMS: string;   // 'Ia' | 'Ib' | 'II' | 'III' | 'U'
  dosisAplicacion: string;
  registroICA: string;
  fichaTecnicaUrl?: string;
}
