'use strict'

var Emitter = require('emitter')
var attr = require('attr')
var type = require('type')

require('watch')

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

/**
 * Take a constructor and return a new
 * constructor that will create Model
 * enhanced instances of said constructor.
 *
 * Call `.attr` on returned Function to define
 * the names of the model properties.
 *
 * ```js
 * var Stock = function(options) {
 *   options = options || {}
 *   this.value = options.value
 *   this.name = options.name
 * }
 *
 * // Enhance Stock constructor with Model
 * Stock = Model(Stock)
 *   .attr('value')
 *   .attr('name')
 *
 * // Generate new instance exactly as normal.
 * var AAPL = new Stock({
 *    value: 100,
 *    name: 'AAPL'
 *  })
 *
 *  AAPL.on('change value', function(newValue, oldValue) {
 *    console.log('AAPL value changed from %d to %d!', oldValue, newValue)
 *  })
 *
 *  // Note: no stupid .get() or .set() BS :D
 *  AAPL.value = 200
 *  // => AAPL value changed from 100 to 200!
 * ```
 * @param {Function} constructor
 * @return {Function}
 * @api public
 */

function Model(constructor) {
  constructor = constructor || function() {}
  function Type() {
    constructor.apply(this, arguments)
    this.constructor = constructor
    for (var i = 0; i < Type.attrs.length; i++) {
      watchProperty(this, Type.attrs[i])
    }
  }
  Type.attrs = []
  Type.attr = function(name) {
    Type.attrs.push(name)
    return Type
  }
  Emitter(Type.prototype)
  return Type
}

/**
 * Watch property `name` on object `context`.
 *
 * @param {Object} context
 * @param {String} name
 * @api private
 */

function watchProperty(context, name) {
  context.watch(name, function(prop, oldVal, newVal){
    context.emit('change ' + prop, newVal, oldVal)
  })
}
