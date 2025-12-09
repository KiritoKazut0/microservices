export default interface ResponseMobile {
  resultado: string,
  explicacion: string
  coincidencias: any[],
  sesgos_encontrados: string[],
  contexto: string
}