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

