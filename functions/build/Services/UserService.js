"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../Models/User");
class UserService {
    /**
     * userSearch
     * Metodo para realizar una busqueda entre los usuarios
     */
    userSearch(valor, users) {
        return [new User_1.User(valor, valor, valor, valor)];
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map