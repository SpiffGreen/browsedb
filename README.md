# BrowseDB 🛢️
https://spiffgreen.github.io/browsedb-js/

![](https://raw.githubusercontent.com/SpiffGreen/browsedb/main/public/screenshot.PNG)

## 🔗Description
BrowseDB is a javascript clientside library for managing localStorage data in mongoose style. BrowseDB provides it's users methods for mangaging localStorage data efficiently. It can be used for simple CRUD operations. BrowseDB data is stored in string format but all data operations are done in json format.

## 📕 Terminologies
`Collections` - All BrowseDB instances are called collections, as they are just collection(array) of objects(documents).

`Documents` - As you might have guessed, are simply objects.

`Schema` - A schema is simply an object that describes the expected structure or blueprint of documents of a particular collection. This could be used for some sort of type checking. And is also optional

## ⚙️Usage and Settings
First, to use browsedb. Include/import browsedb, then create an instance of browsedb. Example
```javascript
    const schema = {
        text: {
            type: String,
            required: true
        },
        done: Boolean,
        date: {
            type: Number,
            required: true,
            default: Date.now
        }
    };
    const todos = new BrowseDB("todos", schema);
```

## Methods
* `create` - Used for creating documents. It accepts an object containing required data for object creation and returns a copy of the new document inserted into localStorage with its ID. BrowseDB generates a unique ID for the newly inserted document.
```javascript
    todos.create({ text: "Learn BrowseDB", done: false });
```

* `find` - For finding documents. It accepts two optional parameters: __query__ and __key__. __query__ is used in similar fashion to 'WHERE' in SQL like databases, While __key__ is used for filtering results. Example
```javascript
    todos.find(); // Returns all documents
    todos.find({}) // Returns all documents
    todos.find({ done: true }); // Returns all documents where done equal true
    todos.find({ done: false }, {done: 0, id: 0}); // Returns documents where done equal false but doesn't show done and id's of each document.
```

* `findById` - For finding documents based on id. It accepts one parameter: __id__. __id__(string) represents id of a document. It returns a document with the passed id.
```javascript
    todos.findById("zUVxUed827"); // Returns Document with id 'zUVxUed827'
```

* `update` - For updating data in document(s). It accepts two parameters: __query__ and __data__. Here, query is used as 'WHERE' would be used Relational databases, while __data__ represents the new data to be put into selected documents. The below example will find all documents where done = false, and update the text field.
```javascript
    todos.update({done: false}, {text: "Todo is not yet done"});
```

* `updateById` - For updating data in a document based on id. It finds a document by id, updates its content and returns the updated content. It accepts two parameters: __id__ and __data__.

* `updateAll` - For updating all documents data at once. It accepts one parameter: __data__.

* `delete` - Finds and deletes documents. Accepts one parameter: __query__ - Where the delete operation should take place.

* `deleteById` - Finds, deletes and returns a document with id passed to it. Accepts one parameter __id__.

* `deleteAll` - Deletes all documents in a collection.

* `remove`  - This function is a bit similar in behaviour to `delete`.

## Installation
### Content Delivery Networks
CDN Link   https://unpkg.com/browsedb@1.0.0/browsedb.min.js

HTML Tag
```html
    <script src="https://unpkg.com/browsedb@1.0.0/browsedb.min.js"><script>
```

### Using npm
```bash
    npm install browsedb
```

## ⛏️Development
*   yarn build or npm run build - produces a production version of library under the lib folder

## ⭐️Show your support
Please this repository if this project helped you!

## 👋 Contributing
Please read the CONTRIBUTING.md file to see how to contribute.

## 🌤️Browser compatibility
browsedb will work across browsers that support localStorage.
You could check for compatibility here:
*   https://caniuse.com/#search=localStorage