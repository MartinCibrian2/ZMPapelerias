export class lineaticket {
<<<<<<< HEAD
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
=======
  constructor(
    public idarticulo: string,
    public nombreart: string,
    public unidadart:string,
    public cantidadart:number,
    public precioart:number,
    public descuentoart:number,
    public ivaart:string,
    public importeart:number,
    public claveProdServ: any
  ){
    
  }
}
>>>>>>> 4ec404ccf33e868881f00d8b35260610e7c8551f
