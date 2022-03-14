"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    // pagination
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 5;
        console.log(this.queryString);
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
exports.default = APIfeatures;
