# ssb-schema-validation

Returns a function that takes an ssb message and will check first against version, search for a matching schema, then validate against the correct schema and return truthy or falsey with an errorset.

Here's how to use it:

Organise your schemas in version directories, and draw each set together with an index.js that returns an object which contains all the schemas stores by their name as key e.g. ``'root'``

Draw all schemas together with their versions and export from `schemas/index.js`
```
// schemas/index.js
const V1_SCHEMA_VERSION = "1"
const V2_SCHEMA_VERSION = "2"

module.exports = {
  V1_SCHEMA_VERSION: require('./v1'),
  V2_SCHEMA_VERSION: require('./v2')
}
```

Then create a new validator which passes the schemas to the validator along with the name of the schema. This will return your validator that takes an ssb message and options, and returns a boolean.

```js
// isRoot.js
const schemas = require('./schemas')
const validate = require('ssb-schema-validation')
const messageType = 'root'

// Returns a function that takes an obj and opts.
module.exports = validate(schemas).with(messageType)
```

