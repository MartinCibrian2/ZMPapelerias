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