export class lineaticket {
    constructor
    (
      public idarticulo: string,
      public nombreart: string,
      public unidadart:string,
      public cantidadart:number,
      public precioart:number,
      public descuentoart:number,
      public ivaart:number,
      public importeart:number
    )
      { 
      }
  }

  export class encabezadoticket {
    constructor
    (
      public folio:number,
      public estadoticket:string,
      public idcliente: string,
      public nombrecliente: string,
      public rfccliente:string,
      public usofactcliente:string,
      public formapagocliente:string,
      public fecha:string,
      public lugar:string,
      public codigopostal:number,
      public total:number
    )
      { 
      }
  }