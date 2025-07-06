import { randomBytes } from "node:crypto";

function createRandomStringToken(numberOfBytes = 16) {
     return randomBytes(numberOfBytes).toString("hex");
     // TODO: add logic to check for collisions in the database
}

export default {
     createRandomStringToken
};
