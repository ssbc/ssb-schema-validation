# ssb-schema-validation

Returns a function that takes an ssb message and will check first against version, search for a matching schema, then validate against the correct schema and return truthy or falsey with an errorset. Accepts variable version schemas, so we can increment versions of different models / schemas separately.

Here's how to use it:

Organise your schemas in version directories, and draw each set together with an index.js that returns an object which contains all the schemas stores by their name as key e.g. ``'post'``

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
│   ├── post
│   │   ├── index.js
│   │   └── v1.js
│   └── comment
│       ├── index.js
│       ├── v1.js
│       └── v2.js
└── validators
    ├── isPost.js
    └── index.js
```

Draw all schemas together with their versions and export from `schemas/index.js`

```js
// schemas/index.js

module.exports = {
  post: [
    require('./v1'),
  ],
  comment: [
    require('./v1')
    require('./v2')
  ]
}
```

Then create a new validator which passes the relevant schemas to the validator. This will return your validator that takes an ssb message and options, and returns a boolean.

```js
// isPost.js

const schemas = require('./schemas')
const Validator = require('ssb-schema-validation')

// Returns a function that takes an obj and opts.
module.exports = Validator(schemas.post)

// isComment.js

const schemas = require('./schemas')
const Validator = require('ssb-schema-validation')

// Returns a function that takes an obj and opts.
module.exports = Validator(schemas.comment)
```

The result being when used...
```js
const isPost = require('./isPost')
var valid = isPost(msg, { attachErrors: true })
if (valid) {
  render(msg)
} else {
  render(msg.errors)
}
```

