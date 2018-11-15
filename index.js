const Validator = require('is-my-json-valid')
const getContent = require('ssb-msg-content')

module.exports = function (schemas) {
  return {
    with: messageType
  }

  function messageType (type) {
    return function isValid (obj, opts = {}) {
      isValid.errors = []
      const versionStrings = Object.keys(schemas)
      const content = getContent(obj)
      const version = content.version

      if (!version) {
        isValid.errors.push({
          field: 'data.version',
          message: 'is not provided'
        })
        if (opts.attachErrors) obj.errors = isValid.errors
        return false
      }

      const versionConst = versionStrings.find(v => v === version)
      if (!versionConst) {
        isValid.errors.push({
          field: 'data.version',
          message: 'is not a valid version',
          value: content.version,
          type: typeof content.version
        })
        if (opts.attachErrors) obj.errors = isValid.errors
        return false
      }

      const versionSchemas = schemas[versionConst]
      if (!versionSchemas) {
        isValid.errors.push({
          field: 'data.version',
          message: `No schemas match version ${versionConst}`,
          value: versionConst,
          type: typeof versionConst
        })
        if (opts.attachErrors) obj.errors = isValid.errors
        return false
      }

      const schema = versionSchemas[type]
      if (!schema) {
        isValid.errors.push({
          field: 'data.schema',
          message: `${type} is not a valid schema`,
          value: type,
          type: typeof type

        })
        if (opts.attachErrors) obj.errors = isValid.errors
        return false
      }

      const validator = Validator(schema, { verbose: true })
      const result = validator(content)

      isValid.errors = validator.errors
      if (opts.attachErrors) obj.errors = isValid.errors
      return result
    }
  }
}
