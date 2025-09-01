import { PrismaClient } from "../generated/prisma/index.js";
export const prisma = globalThis.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}
export default prisma;
//# sourceMappingURL=prisma.js.map