export class lineaticket {
    constructor(
      public idarticulo: string,
      public nombreart: string,
      public unidadart:string,
      public cantidadart:number,
      public precioart:number,
      public descuentoart:number,
      public ivaart:number,
      public importeart:number,
      public claveProdServ: string
    ){
      
    }
  }
  
  export class Producto {
    constructor(
       public id: string,
       public tipo: string,
       public nombre:any,
       public descripcion:any,
       public unidad:any,
       public preciopublico:any,
       public costo:any,
       public descuentomayoreo:any,
       public descuentomaximo:any,
       public mayoreo:any,
       public iva:any,
       public inventariominimo:any,
       public inventarioactual:any,
       public claveProdServ: string
    ){
    }
  }


  export class encabezadoticket {
    constructor(
      public folio: number,
      public estado: string,
      public idcliente: string,
      public nombrecliente: string,
      public rfccliente:string,
      public usocfdi:string,
      public formapago:string,
      public fecha:string,
      public lugarexpedicion:string,
      public CPExpedicion: number,
      public total:number
    ){
    }
  }
  