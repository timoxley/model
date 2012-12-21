var Emitter = require('emitter')
var attr = require('attr')
var type = require('type')

module.exports = Model

function Model(data) {
  this.attributes = {}
  data = data || {}
  this.set(data)
}

Emitter(Model.prototype)

Model.prototype.get = function(name) {
  if (!name) return this.getAll()
  var attribute = this.attributes[name]
  if (!attribute) return undefined
  return attribute()
}

Model.prototype.set = function(name, value) {
  if (type(name) === 'object') return this.update(name)
  if (type(name) !== 'string') throw new Error('attribute name must be a string')
  if (arguments.length !== 2) throw new Error('must supply a value for ' + name)

  var attribute = this.attributes[name] = this.attributes[name] || attr(name)
  var self = this
  attribute.on('change', function(newVal, oldVal) {
    self.emit('change', name, newVal, oldVal)
  })

  attribute(value)
  return this
}

Model.prototype.update = function(updatedData) {
  for (var key in updatedData) {
    if (updatedData.hasOwnProperty(key)) {
      this.set(key, updatedData[key])
    }
  }
}

Model.prototype.getAll = function() {
  var result = {}
  for (var key in this.attributes) {
    if (this.attributes.hasOwnProperty(key)) {
      result[key] = this.get(key)
    }
  }
  return result
}
