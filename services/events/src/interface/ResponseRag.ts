

export default interface ResponseRag {
   success: boolean,
   msg: string,
   data: {
     questions_for_rag: string[]
   }
 }
