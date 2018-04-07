export class detallefactura {
    constructor(
      public claveProdServ: string,
      public descripcion: string,
      public unidad:string,
      public claveunidad: string,
      public cantidad:number,
      public precioart:number,
      public descuentoart:number,
      public tipodeimpuesto:number,
      public tasaimpuesto: number,
      public importeart:number
    ){
      
    }
  }
  
  export class encabezadofactura {
    constructor(
      public tipo: string,
      public folio: number,
      public fecha: string,
      public nombrecliente:string,
       public rfccliente:string,
       public subtotal:number,
       public impuestos:number,
       public total:number,
       public usodecfdi:string,
       public tipocfdi:string,
       public formadepago:string,
       public metododepago:string,
       public regimenfiscal:string,
       public estadofactura:string,
       public articulos: detallefactura []
    ){
    }
  }


  