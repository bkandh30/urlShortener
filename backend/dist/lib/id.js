import { customAlphabet } from "nanoid";
import { DEFAULTS } from "@bkandh30/common-url-shortener";
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generateId = customAlphabet(alphabet, DEFAULTS.SHORT_ID_LENGTH);
export async function makeShortId(existsFn, maxRetries = DEFAULTS.MAX_COLLISION_RETRIES) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const id = generateId();
        const exists = await existsFn(id);
        if (!exists) {
            return id;
        }
        console.warn(`Collision detected for ID: ${id}, attempt ${attempt + 1}`);
    }
    throw new Error('Failed to generate unique short ID after maximum retries');
}
//# sourceMappingURL=id.js.map