import { DELAY_RESPONSE } from "../constants.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default function commonResponseMiddleware(req, res, next) {
     /**
      * Function to send the response in a consistent format
      *
      * @param {Object} data - The data to be returned
      * @param {number} status - The HTTP status code to be returned
      * @param {string|Object|Array} message - The message to be returned
      *
      */
     res.apiResponse = (status, message, data) => {
          const response = {
               status: "success"
          };

          if (!(typeof message == "string")) {
               response.data = message;
          } else {
               response.message = message;
          }

          if (data !== undefined || data !== null) {
               response.data = data;
          }

          if (DELAY_RESPONSE.enabled) {
               setTimeout(() => res.status(status).json(response), DELAY_RESPONSE.seconds);
          } else {
               res.status(status).json(response);
          }
     };

     /**
      * Function to send an error response in a consistent format
      *
      * @param {string} message - The error message to be displayed
      * @param {number} status - The HTTP status code to be returned
      */
     res.errorResponse = (status = StatusCodes.INTERNAL_SERVER_ERROR, message = ReasonPhrases.INTERNAL_SERVER_ERROR, stackTrace = null) => {
          const response = {
               status: "error",
               message: message
          };

          if (stackTrace && process.env.DEBUG == "true") {
               response.stack_trace = stackTrace;
          }

          if (DELAY_RESPONSE.enabled) {
               setTimeout(() => res.status(status).json(response), DELAY_RESPONSE.seconds);
          } else {
               res.status(status).json(response);
          }
     };

     /**
      * Function to send a validation error response
      *
      * @param {Object} errors - An object containing the validation errors
      * @param {string} message - The error message to be displayed
      * @param {number} status - The HTTP status code to be returned
      */
     res.validationErrorResponse = (errors = {}, message = "Validation Error", status = StatusCodes.UNPROCESSABLE_ENTITY) => {
          res.status(status).json({
               type: "validation-error",
               message,
               errors
          });
     };

     next();
}
