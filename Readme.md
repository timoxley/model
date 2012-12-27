# model

  Simple 'reactive' Data Models.

  Model augments regular constructors to
  'watch' particular object properties, and
  fire 'change property' events whenever they
  change.

## Installation

    $ component install timoxley/model

## API

## Model()

  Take a constructor and return a new
  constructor that will create Model
  enhanced instances of said constructor.

  Call `.attr` on returned Function to define
  the names of the model properties.

  ```js
  var Stock = function(options) {
    options = options || {}
    this.value = options.value
    this.name = options.name
  }

  // Enhance Stock constructor with Model
  Stock = Model(Stock)
    .attr('value')
    .attr('name')


  // Generate new instance exactly as normal.
  var AAPL = new Stock({
    value: 100,
    name: 'AAPL'
  })

  AAPL.on('change value', function(newValue, oldValue) {
    console.log('AAPL value changed from %d to %d!', oldValue, newValue)
  })

  // Note: no stupid .get() or .set() BS :D
  AAPL.value = 200
  // => AAPL value changed from 100 to 200!
  ```

### Caveats
  `timoxley/model` relies on an Object.watch shim, which is bundled with
  the component. Just a headsup that this will add ES

## License

  MIT
  - [Model()](#model)


