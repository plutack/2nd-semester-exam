import { ErrorWithStatusCode } from "../exceptions/customErrorConstructor.js";
// prevent update  if state is being updated along with other fields
export const validateUpdateFields  = (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description", "body", "tags", ]; // Fields allowed to be updated separately from "state"
    const isStateUpdate = updates.includes('state');

    // If updating "state", ensure no other fields are updated
    if (isStateUpdate && updates.length > 1) {
        throw new ErrorWithStatusCode("Updating 'state' must be done separately from other fields.", 400);
    }

    // Check if all other updates are within the allowed fields when "state" is not updated
    if (!isStateUpdate && updates.some(field => !allowedUpdates.includes(field))) {
        throw new ErrorWithStatusCode("One or more fields cannot be updated.", 400);
    }

    next();
};
