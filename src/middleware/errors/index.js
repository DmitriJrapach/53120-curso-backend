import EErrors from "../../services/errors/enums.js";

export default (error, _req, res, _next) => {
    console.log(error.cause ? error.cause : 'No cause provided');

    let statusCode;
    let errorMessage;

    switch(error.code) {
        case EErrors.INVALID_TYPE_ERROR:
            statusCode = 400;
            errorMessage = 'Invalid type error';
            break;
        default:
            statusCode = 500;
            errorMessage = 'Unhandled Error';
    }

    res.status(statusCode).send({ status: "error", error: errorMessage });
}