import { StatusCodes } from "http-status-codes";

export default function errorHandler(err, req, res, next) {
     let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

     if (err?.name === "ValidationError") {
          const errors = Object.entries(err.errors).reduce((acc, [path, value]) => {
               acc[path] = value.message;
               return acc;
          }, {});
          return res.validationErrorResponse(errors);
     }

     res.errorResponse(statusCode, err.message ?? "Something went wrong! Please try again after some time.", err.stack);
}
