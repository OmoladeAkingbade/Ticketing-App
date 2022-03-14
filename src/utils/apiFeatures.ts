
class APIfeatures {
    queryString: any;
    query: any;
  
    constructor(query: any, queryString: any) {
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
  
  export default APIfeatures;
