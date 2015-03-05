class @TagCollection
  constructor: (options) ->
    @_index = 0
    @_tags =  []
    @_observers = []
    @_onAdd = if options and typeof(options.onAdd) is 'function' then options.onAdd else null
    @_onDelete = if options and typeof(options.onDelete) is 'function' then options.onDelete else null

  _add : (tag) ->
    tag = if @_onAdd then @_onAdd(tag, @_tags) else tag
    if tag
      @_index++
      @_tags.push({ tag : tag, key : '' + @_index  })

    return

  addRange : (tags)->
    for t in tags
      if t and t isnt ''
        @_add(t)

    @_fire()
    return

  add : (tag) ->
    @_add(tag)
    @_fire()
    return

  remove : (key) ->
    remove = if @_onDelete then @_onDelete(key, @_tags) else true

    if remove
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
