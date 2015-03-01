class @TagCollection
  constructor: ->
    @_index = 0
    @_tags =  []
    @_observers = []

  addRange : (tags)->
    for t in tags
      if t and t isnt ''
        @_index++
        @_tags.push({ tag : t, key : '' + @_index  })

    @_fire()
    return

  add : (tag) ->
    @_index++
    @_tags.push({ tag : tag, key : '' + @_index  })
    @_fire()
    return

  remove : (key) ->
    @_tags = (t for t in @_tags when t.key isnt key)
    @_fire()
    return

  listen : (callback) ->
    if callback then @_observers.push(callback)
    return

  getTags : () ->
    return (t.tag for t in @_tags)

  _fire : () ->
    for c in @_observers
      c()

    return
