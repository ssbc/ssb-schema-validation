# ssb-schema-validation

Builds message validators for ssb based on JSON-schema. Specifically designed for handling multiple different _versions_ of a schema for a particular message `type` (e.g. when you add new requirements, or change the encoding of a particular field and publish a new version of the schema)

**NOTE** - this requires schemas which have _both_ `type` and `version` fields.

## Example Usage

```js
var Validator = require('ssb-schema-validation')

var replySchemas = [
  require('./schemas/reply/v1')
  require('./schemas/reply/v2')
]

var isReply = Validator(replySchemas)

isReply(msg)
// => true / false
console.log(isReply.errors)
// => some errors
```

For a live example see e.g. [ssb-dark-crystal-schema](https://github.com/blockades/ssb-dark-crystal-schema)

## API

### `Validator(schemas) => fn`

Takes argument
- `schemas` - an array of JSON-schema.

Returns a function `validator` based on those schemas.

### `validator(msg, opts) => Bool`

Takes arguments:
- `msg` - a full ssb message, or the `content` field of such a message. Supporting both means you can use this validator to easily validate content either before writing to the database, or for reading from the database.

- `opts` (optional) - an object of form `{ attachErrors: Boolean }`, settings attachErrors: true mutates the original message by attaching any errors found during in validation. This option is `false` by default i.e. disabled.

Returns a Boolean: true/ false

**Note** - if the validator returns `false`, then details about _why_ the message didn't pass validation can be found under `validator.errors`. This is reset after each message is passed in.
