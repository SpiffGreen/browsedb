/**
 * @author  Spiff Jekey-Green <spiffjekeygreen@gmail.com>
 * @see     https://browsedb.github.io
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
 class BrowseDB {
    constructor(collectionName, schema = null) {
        if(localStorage.getItem(collectionName) === null) localStorage.setItem(collectionName, "[]");
        this.collectionName = collectionName;
        this.schema = schema;
        this.create = this.create.bind(this);
        this.find = this.find.bind(this);
        this.findById = this.findById.bind(this);
        this.update = this.update.bind(this);
        this.updateById = this.updateById.bind(this);
        this.updateAll = this.updateAll.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteById = this.deleteById.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.remove = this.remove.bind(this);

        this.idGenerator = this.idGenerator.bind(this);
        this.objLength = this.objLength.bind(this);
        this.checkSchema = this.checkSchema.bind(this);
    }

    /**
     * @description Generates unique id for documents
     * @param {Number} max 
     * @returns {String} Random string(id)
     */
    idGenerator(max = 10) {
        const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var result = '';
        for ( var i = 0; i < max; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    /**
     * @description Calculates and returns the length(i.e number of keys) of an object
     * @param {{}} obj  Input
     * @returns {Number}    Length of object
     */
    objLength(obj) {
        if(typeof obj !== "object") throw new TypeError("Parameter '1' of create should be an object");
        let length = 0;
        for(let x in obj) {
            ++length;
        }
        return length;
    }

    /**
     * @description Check's input against schema for correctness
     * @param {{}} inp data input for creating document
     * @param {{}} schema Schema used for testing
     * @returns final data for document creation
     */
    checkSchema(inp, schema) {
        let result = inp;
        for(let field in schema) {
            if(typeof schema[field] !== "object") {
                if(typeof schema[field] === "function") {
                    if(typeof inp[field] !== typeof schema[field]()) {
                        throw new TypeError(`Expected a ${typeof schema[field]()} instead got a ${typeof inp[field]}`);
                    }
                } else {
                    throw new TypeError("Expected a function");
                }
            } else {
                if(schema[field].default !== undefined && inp[field] == undefined) result[field] = typeof schema[field].default === "function" ? schema[field]["default"]() : schema[field].default;
                if(schema[field].required === true && inp[field] == undefined) {
                    throw new EvalError(`'${field}' is required`);
                }
                if(typeof schema[field]["type"] == "function") {
                    if(typeof schema[field]["type"]() !== typeof result[field]) throw new TypeError(`Expected a ${typeof schema[field]["type"]()} instead got a ${typeof inp[field]}`);
                }
            }
        }
        return result;
    }

    /**
     * @description     Creates document from data provided
     * @param {{}} obj  Data to store in new document
     * @returns {{}}    Created document with it's id
     */
    create(obj) {
        if(typeof obj !== "object") throw new TypeError("Parameter '1' of create should be an object");
        const generatedId = this.idGenerator(10);
        if(this.schema !== null) obj = this.checkSchema(obj, this.schema);
        const newItems = [{...obj, id: generatedId}, ...JSON.parse(localStorage.getItem(this.collectionName))];
        localStorage.setItem(this.collectionName, JSON.stringify(newItems));
        return {
            ...obj,
            id: generatedId,
        };
    }

    /**
     * @description Retrieves data from database
     * @param {{}} query Object for specifing the where part of find function, works like 'WHERE' statement in SQL
     * @param {{}} key Object filtering result(s) of find
     * @returns {Array<Object>} Data from database
     */
    find(query, key) {
        if(typeof query === "undefined" || this.objLength(query) < 1) {
            const items = JSON.parse(localStorage.getItem(this.collectionName));
            if(typeof key === "undefined") return items;
            return items.map(i => {
                for(let field in key) {
                    if(key[field] === 0) delete i[field];
                }
                return i;
            });
        }
        if(typeof query !== "object") throw new TypeError("Parameter '1' of function should be object");
        const items = JSON.parse(localStorage.getItem(this.collectionName));
        let result = [];
        items.forEach(i => {
            for(let x in query) {
                if(i[x] === query[x]) {
                    if(typeof key != "undefined") {
                        for(let keyTerm in key) {
                            if(key[keyTerm] === 0) delete i[keyTerm];
                            else {
                                for(let e in i) {
                                    if(e !== keyTerm) delete i[e];
                                }
                            }
                        }
                    }
                    result.push(i);
                }
            }
        });
        return result;
    }

    /**
     * @description Finds document by id
     * @param {Number} id 
     * @returns Returns document whose id matches function's parameter
     */
    findById(id) {
        if(typeof id !== "string") throw TypeError("Parameter '1' of function should be string");
        const items = JSON.parse(localStorage.getItem(this.collectionName));
        return items.filter(i => i.id === id)[0];
    }

    /**
     * @description Updates documents
     * @param {{}} query Object describing 'WHERE' the operation should take place
     * @param {{}} upt Object containing data for update
     */
    update(query, upt) {
        if(typeof query !== "object") throw new TypeError("Parameter '1' of function should be object");
        const items = JSON.parse(localStorage.getItem(this.collectionName));
        let newItems = [], result = {};
        items.forEach(i => {
            let isWorth = false;
            for(let x in query) {
                if(i[x] !== query[x]) isWorth = false;
                else isWorth = true;
            }
            if(isWorth) {
                for(let change in upt) {
                    if(i[change]) {
                        i[change] = upt[change];
                    }
                }
                result = i;
            }
            newItems.push(i);
        });
        localStorage.setItem(this.collectionName, JSON.stringify(newItems));
        return result;
    }

    /**
     * @description Updates documents based on id
     * @param {String} id ID of document required for update
     * @param {{}} upt Object to replace with documents
     * @returns The updated element with it's new content
     */
    updateById(id, upt) {
        const items = JSON.parse(localStorage.getItem(this.collectionName));
        let result = {}, newItems = [];
        items.forEach(i => {
            if(i.id === id) {
                for(let change in upt) {
                    if(i[change]) {
                        i[change] = upt[change];
                    }
                }
                result = i;
            }
            newItems.push(i);
        });
        localStorage.setItem(this.collectionName, JSON.stringify(newItems));
        return result;
    }

    /**
     * @description Updates all documents with the provided data
     * @param {{}} upt Object to replace with documents
     * @returns Returns The new documents
     */
    updateAll(upt) {
        const items = JSON.parse(localStorage.getItem(this.collectionName));
        let newItems = [];
        items.forEach(i => {
            for(let change in upt) {
                if(i[change]) {
                    i[change] = upt[change];
                }
            }
            newItems.push(i);
        });
        localStorage.setItem(this.collectionName, JSON.stringify(newItems));
        return newItems;
    }

    /**
     * @description Deletes documents based on the query provided
     * @param {{}} query The object that denotes where the operation is to take place
     * @returns {{}} Returns the document deleted
     */
    delete(query) {
        const items = JSON.parse(localStorage.getItem(this.collectionName));
        let result = {};
        const newItems = items.filter(i => {
            let isWorth = false;
            for(let q in query) {
                if(i[q] === query[q]) isWorth = true;
                else isWorth = false;
            }
            if(isWorth) result = i;
            else return i;
        });
        localStorage.setItem(this.collectionName, JSON.stringify(newItems));
        return result;
    }

    /**
     * @description Deletes a document based on the id provided
     * @param {String} id ID of document created/assigned by BrowseDB
     * @returns Returns document deleted
     */
    deleteById(id) {
        const items = JSON.parse(localStorage.getItem(this.collectionName));
        let deletedItem = {};
        const newItems = items.filter(i => {
            if(i.id === id) deletedItem = i;
            return i.id !== id;
        });
        localStorage.setItem(this.collectionName, JSON.stringify(newItems));
        return deletedItem;
    }

    /**
     * @description Deletes all documents
     * @returns An empty array indicating deletion of all documents
     */
    deleteAll() {
        localStorage.setItem(this.collectionName, "[]");
        return [];
    }

    /**
     * @description Same as `delete()`
     * @param {{}} obj Query describing 'WHERE' operation should take place
     * @returns Deleted item
     */
    remove(obj) {
        if(typeof obj !== "object" || typeof obj !== "undefined") throw new TypeError("Parameter '1' should be type object")
        if(this.objLength(obj) < 1 || typeof obj === "undefined") {
            localStorage.setItem(this.collectionName, "[]");
        }
        return this.delete(obj);
    }
}