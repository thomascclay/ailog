"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const util_1 = require("util");
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event', (0, util_1.inspect)(event));
    console.log('context', (0, util_1.inspect)(context));
    if (!event.body) {
        return {
            statusCode: 400,
            body: 'No body'
        };
    }
    const body = JSON.parse(event.body);
    return {
        statusCode: 200,
        body: event.body
    };
});
exports.handler = handler;
