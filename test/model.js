var Model = require('model')
var assert = require('timoxley-assert')

var model

describe('mixin', function() {
  it('can mix into existing objects', function() {
    var User = function(data) {
      this.initializeModel(data)
    }
    Model(User.prototype)
    var tim = new User({name: 'Tim', age: 27})
    assert(tim instanceof User)
    assert.equal(tim.get('name'), 'Tim')
    assert.equal(tim.get('age'), 27)
  })
})

describe('constructor', function() {
  beforeEach(function() {
    model = new Model()
  })

  describe('set() and get()', function() {
    it('can set and get a value', function() {
      model.set('name', 'Tim')
      assert.equal(model.get('name'), 'Tim')
    })

    describe('updates', function() {
      it('can update multiple values at once', function() {
        model.set({
          name: 'Tim'
        })
        model.set({
          name: 'Tim Oxley',
          age: 27
        })

        assert.equal(model.get('name'), 'Tim Oxley')
        assert.equal(model.get('age'), 27)
      })
    })

    describe('getting all properties', function() {
      it('returns all properties as an object', function() {
        model.set({
          name: 'Tim Oxley',
          age: 27
        })
        assert.deepEqual(model.get(), {
          name: 'Tim Oxley',
          age: 27
        })
      })
    })
  })

  describe('events', function() {
    it('fires events when properties are set', function(done) {
      model.once('change', function(prop, value) {
        assert.equal(prop, 'name')
        assert.equal(value, 'Tim')
        done()
      })
      model.set('name', 'Tim')
    })

    it('fires events when properties are updated', function(done) {
      model.set('name', 'Tim')

      model.once('change', function(prop, value) {
        assert.equal(prop, 'name')
        assert.equal(value, 'Tim Oxley')
        done()
      })

      model.set('name', 'Tim Oxley')
    })
  })

})
