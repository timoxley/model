'use strict'

var Emitter = require('emitter')
var attr = require('attr')
var type = require('type')

/**
 * mix properties in
 *
 * @api private
 */
function mixin(target, source) {
  for (var key in source) {
    target[key] = source[key]
  }
  return target
}

/**
 * Expose `Model`.
 */

module.exports = Model

/**  Initialize a new `Model` with `data` properties, or use as a mixin.
 *  ```js
 *  var Model = require('model')
 *
 *  var user = new Model({
 *    name: 'Tim',
 *    age: 27
 *  })
 *
 *  // or as a mixin:
 *
 *  var User = function(data) {
 *    this.set('name', data.name)
 *    this.set('age', data.age)
 *  }
 *
 *  Model(User.prototype)
 *
 *  ```
 *
 * @param data
 * @api public
 */

function Model(data) {
  if (!(this instanceof Model)) {
    return mixin(data, Model.prototype)
  }
  this.initializeModel(data)
}

Model.prototype.initializeModel = function initializeModel(data) {
  data = data || {}
  this.attributes = this.attributes || {}
  this.set(data)

}

Emitter(Model.prototype)

/**
 * Get the value of Model property specified by `name`
 * or if `name` is not supplied, return the
 * whole current model.
 *
 * ```js
 * var model = new Model({
 *   name: 'Tim'
 * })
 * model.get('name') //=> 'Tim'
 * ```
 *
 * @param {String} name
 * @return {Mixed}
 * @api public
 */

Model.prototype.get = function(name) {
  if (!arguments.length) return this.getAll()
  return this.getProperty(name)
}

/**
 * Set a property specified by `name` to `value` or
 * if supplied an `Object`, add or update properties
 * on the model, as specified by the given `Object`.
 *
 * Will trigger `change` events on the model if
 * the model changes.
 *
 * ```js
 * var model = new Model({
 *   name: 'Tim'
 * })
 *
 * model.set('name', 'Tim Oxley')
 *
 * model.set({
 *   age: 27
 * )
 *
 * model.get('name') //=> 'Tim Oxley'
 * model.get('age') //=> 27
 * ```

 * @param {String} name
 * @return {Mixed}
 * @api public
 */

Model.prototype.set = function(name, value) {
  if (type(name) === 'object') return this.update(name)
  return this.setProperty(name, value)
}

/**
 * Get a property value specified by `name`.
 *
 * @param {String} name
 * @return {Mixed}
 * @api private
 */

Model.prototype.getProperty = function(name) {
  if (!name) return this.getAll()
  var attribute = this.attributes[name]
  if (!attribute) return undefined
  return attribute()
}

/**
 * Set a property specified by `name` to `value`.
 * Will trigger `change` events on the model if
 * the model does change.
 *
 * @param {String} name
 * @param {Mixed} value
 * @return {Model}
 * @api private
 */

Model.prototype.setProperty = function(name, value) {
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

/**
 * Add or update properties on this model, as specified
 * by the keys and values in `updated`.
 *
 * @param {Object} updated
 * @return {Model}
 * @api private
 */

Model.prototype.update = function(updated) {
  for (var key in updated) {
    if (updated.hasOwnProperty(key)) {
      this.set(key, updated[key])
    }
  }
  return this
}

/**
 * Get all properties of this model as a simple Object.
 *
 * @return {Object}
 * @api private
 */

Model.prototype.getAll = function() {
  var result = {}
  for (var key in this.attributes) {
    if (this.attributes.hasOwnProperty(key)) {
      result[key] = this.get(key)
    }
  }
  return result
}
