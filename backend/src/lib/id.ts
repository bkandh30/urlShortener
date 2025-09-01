import { customAlphabet } from "nanoid";
// import { DEFAULTS } from "@bkandh30/common-url-shortener";

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export async function makeShortId(
    existsFn: (id: string) => Promise<boolean>,
    maxRetries?: number
): Promise<string> {
    const { DEFAULTS } = await import('@bkandh30/common-url-shortener');
    
    const effectiveMaxRetries = maxRetries ?? DEFAULTS.MAX_COLLISION_RETRIES;
    const generateId = customAlphabet(alphabet, DEFAULTS.SHORT_ID_LENGTH);

    for (let attempt = 0; attempt < effectiveMaxRetries; attempt++) {
        const id = generateId();
        const exists = await existsFn(id);

        if (!exists) {
            return id;
        }

        console.warn(`Collision detected for ID: ${id}, attempt ${attempt + 1}`)
    }

    throw new Error('Failed to generate unique short ID after maximum retries');
}