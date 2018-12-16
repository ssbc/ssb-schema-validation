const Validator = require('is-my-json-valid')
const getContent = require('ssb-msg-content')

module.exports = function (schemas) {
  if (!Array.isArray(schemas)) throw new Error('ssb-schema-validation expects an Array')

  // build validators for each schema once
  const validators = Validators(schemas)

  return function isValid (msg, opts = {}) {
    isValid.errors = []

    const content = getContent(msg)
    const { version } = content

    if (!version) {
      isValid.errors.push({
        field: 'data.version',
        message: 'is not provided'
      })
      if (opts.attachErrors) msg.errors = isValid.errors
      return false
    }

    const validator = validators.find(v => v.version === version)
    // WARNING: assumes there's only one validator per version!
    if (!validator) {
      isValid.errors.push({
        field: 'data.version',
        message: `No schemas match version ${version}`,
        value: version,
        type: typeof version
      })
      if (opts.attachErrors) msg.errors = isValid.errors
      return false
    }

    const result = validator(content)

    isValid.errors = validator.errors
    if (opts.attachErrors) msg.errors = isValid.errors
    return result
  }
}

// helpers

function Validators (schemas) {
  // TODO check all schemas are for same type?

  return schemas.map(schema => {
    const validator = Validator(schema, { verbose: true })
    validator.type = getType(schema)
    validator.version = getVersion(schema)

    return validator
  })
}

function getType (schema) {
  return trimRegex(schema.properties.type.pattern)
}

function getVersion (schema) {
  // this assumes string versions, will need modifying if someone uses integer versions
  return trimRegex(schema.properties.version.pattern)
}

function trimRegex (regexString = '') {
  return regexString
    .replace(/^\^/, '')
    .replace(/\$$/, '')
}
