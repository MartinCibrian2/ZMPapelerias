export class UserModel
{
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public password: string,
        public email: string,
        public role: string,
        public image: string,
        public job: string,
        public tipodedocumento: "user",
        public alive: true,
        public active: true,
        public created_at: Date,
        public created_by: string,
        public updated_at: Date,
        public updated_by: string
    ){}
}