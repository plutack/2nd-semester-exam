import { ErrorWithStatusCode } from "../exceptions/customErrorConstructor.js";
// prevent u
export const validateUpdateFields = (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['state', 'otherAllowedField1', 'otherAllowedField2']; // Fields allowed to be updated with state
    const isStateUpdate = updates.includes('state');

    if (isStateUpdate && updates.some(field => !allowedUpdates.includes(field))) {
        throw new ErrorWithStatusCode("Updating 'state' along with other non-allowed fields is not permitted,.", 400);
    }

    next();
}