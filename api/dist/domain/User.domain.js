"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const crypto_1 = require("crypto");
class User {
    constructor(init) {
        this.id = '';
        this.name = '';
        this.email = '';
        this.createdAt = new Date();
        this.password = '';
        this.updatedAt = new Date();
        Object.assign(this, {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }, init);
    }
}
exports.User = User;
//# sourceMappingURL=user.domain.js.map