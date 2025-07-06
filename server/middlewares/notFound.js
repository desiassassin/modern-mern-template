import { ReasonPhrases, StatusCodes } from "http-status-codes";

export default function notFoundMiddleware(req, res, next) {
     console.log(req.url);
     res.errorResponse(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
}
