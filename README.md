# ssb-schema-validation

Returns a function that takes an ssb message and will check first against version, search for a matching schema, then validate against the correct schema and return truthy or falsey with an errorset.

Here's how to use it:

Organise your schemas in version directories, and draw each set together with an index.js that returns an object which contains all the schemas stores by their name as key e.g. ``'root'``

Ensure our message declares a verision, else we'll get an error.
```js
{
  type: 'post',
  version: '1.0.0',
  body: 'tra-lala-lala-lala'
}
```

And export a schema for each version.

Example project structure could look like this...

```
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── schemas
│   ├── index.js
│   ├── v1
│   │   ├── index.js
│   │   ├── post.js
│   │   └── version.js
│   └── v2
│       ├── index.js
│       ├── post.js
│       └── version.js
└── validators
    ├── isPost.js
    └── index.js
```

Make sure we export the relevant schemas in `index.js`.
```js
// schemas/v1/index.js

module.exports = {
  post: require('./post')
}

// schemas/v2/index.js

module.exports = {
  post: require('./post')
}
```

Draw all schemas together with their versions and export from `schemas/index.js`

```js
// schemas/index.js
module.exports = {
  "1.0.0": require('./v1'),
  "2.0.0": require('./v2')
}
```

Then create a new validator which passes the schemas to the validator along with the name of the schema. This will return your validator that takes an ssb message and options, and returns a boolean.

```js
// isPost.js
const schemas = require('./schemas')
const validate = require('ssb-schema-validation')

// Returns a function that takes an obj and opts.
module.exports = validate(schemas).with('root')
```

The result being when used...
```js
const isRoot = require('./isRoot')
var valid = isRoot(msg, { attachErrors: true })
if (valid) {
  render(msg)
} else {
  render(msg.errors)
}
```

