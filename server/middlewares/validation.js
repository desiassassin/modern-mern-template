import * as yup from "yup";

/**
 *
 * @param {yup.Schema} schema
 * @returns
 */
export default function validateRequest(schema) {
     return async function (req, res, next) {
          try {
               const requestData = {
                    ...req.body,
                    ...req.query
                    // ...req.params,
               };
               await schema.validate(requestData, { abortEarly: false });
               next();
          } catch (error) {
               const errors = {};

               for (const err of error.inner) {
                    if (errors[err.path]) continue;
                    errors[err.path] = err.errors[0];
               }

               return res.validationErrorResponse(errors);
          }
     };
}
