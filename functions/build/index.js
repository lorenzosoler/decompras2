"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const prueba = require("./prueba");
exports.helloWorld = prueba.helloWorld;
//# sourceMappingURL=index.js.map