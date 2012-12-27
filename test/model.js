var Model = require('model')
var assert = require('timoxley-assert')

var model

describe('mixin', function() {
  var User
  beforeEach(function() {
    User = function(options) {
      options = options || {}
      this.name = options.name
      this.age = options.age
    }

    User = Model(User)
      .attr('name')
      .attr('age')

  })

  it('can mix into existing objects', function() {
    var tim = new User({name: 'Tim', age: 27})
    assert(tim instanceof User)
    assert.equal(tim.name, 'Tim')
    assert.equal(tim.age, 27)
  })

  describe('events', function() {
    var model
    beforeEach(function() {
      model = new User({name: 'Tim', age: 27})
    })
    it('fires events when properties are set', function(done) {
      model.once('change', function(prop, value) {
        assert.equal(prop, 'name')
        assert.equal(value, 'Tim')
        done()
      })
      model.name = 'Tim'
    })

    it('fires events when properties are updated', function(done) {
      model.name = 'Tim'

      model.once('change', function(prop, value) {
        assert.equal(prop, 'name')
        assert.equal(value, 'Tim Oxley')
        done()
      })

      model.name = 'Tim Oxley'
    })
  })
})
