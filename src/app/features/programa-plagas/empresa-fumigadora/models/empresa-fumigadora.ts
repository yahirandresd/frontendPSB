export interface EmpresaFumigadora {
  id: string;
  programaPlagasId: string;  // ← corregido (era programaPlagaId)
  nit: string;
  nombre_empresa: string;
  numCerSanitario: string;   // ← corregido (era numCertSanitario)
  fechaVencCer: Date;        // ← corregido (era fechaVencCert)
  registroSds: string;       // ← corregido (era registroSDS)
  telefonoContacto: string;
}
 