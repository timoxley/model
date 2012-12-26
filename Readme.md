
# model

  Simple Data Models

## Installation

    $ component install timoxley/model

## API

### Model()

  Initialize a new `Model` with `data` properties, or use as a mixin.
  ```js
  var Model = require('model')

  var user = new Model({
    name: 'Tim',
    age: 27
  })

  // or as a mixin:

  var User = function(data) {
    this.set('name', data.name)
    this.set('age', data.age)
  }

  Model(User.prototype)

  ```

### Model#get(name:String)

  Get the value of Model property specified by `name`
  or if `name` is not supplied, return the
  whole current model.

  ```js
  var model = new Model({
    name: 'Tim'
  })
  model.get('name') //=> 'Tim'
  ```

### Model#set(name:String)

  Set a property specified by `name` to `value` or
  if supplied an `Object`, add or update properties
  on the model, as specified by the given `Object`.

  Will trigger `change` events on the model if
  the model changes.

  ```js
  var model = new Model({
    name: 'Tim'
  })

  model.set('name', 'Tim Oxley')

  model.set({
    age: 27
  )

  model.get('name') //=> 'Tim Oxley'
  model.get('age') //=> 27
  ```

## License

  MIT

