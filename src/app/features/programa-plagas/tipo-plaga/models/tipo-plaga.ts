export interface TipoPlaga {
  id: string;
  nombre: string;
  categoria: string;     // 'roedor' | 'insecto' | 'ave' | 'quiroptero'
  riesgoSanitario: string;
}