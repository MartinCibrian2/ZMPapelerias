export class ClientModel
{
    constructor(
        public _id: string,
        public nombre: string,
        public rfc: string,
        public tel: string,
        public active: boolean
    ){}
}

export class ClienteRegistro
{
    constructor(
        public _id: string,
        public nombre: string,
        public razonsocial: string,
        public rfc: string,
        public CP: number,
        public calle: string,
        public numerodomicilio: string,
        public colonia: string,
        public municipio: string,
        public estado: string,
        public correoelectronico:string,
        public telefonofijo: string,
        public telefonomovil: string,
        public nombrecontacto: string,
        public whatsapp: string,
        public tipopago: string,
        public numtarjeta: string,
        public numcuenta: string,
        public bancocliente: string

    ){}
}