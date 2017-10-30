import { User } from '../Models/User';

export class UserService {

    /**
     * userSearch
     * Metodo para realizar una busqueda entre los usuarios
     */
    public userSearch(valor: String, users: any): Array<User> {
        return [new User(valor,valor,valor,valor)];
    }
}