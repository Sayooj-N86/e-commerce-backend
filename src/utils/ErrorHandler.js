import { statusCode } from "./StatusCode.js";

export const validationError= (message) => {

    const err = new Error()
    err.status = statusCode.validationError;
    err.message = message;
    return err;
};

export const serverError = (message = "internal server error") => {
    const err = new Error();
    err.status = statusCode.serverError;
    err.message = message;
    return err;
}