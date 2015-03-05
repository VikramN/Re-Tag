class @TagCollection
  constructor: (options) ->
    @_index = 0
    @_tags =  []
    @_observers = []
    @_allowDups = true
    @_contains = (tag) =>
      for t in @_tags
        if tag is t.tag
          return true
      return false

    if options and options.duplicates and 'allow' of options.duplicates
      dup = options.duplicates

      @_allowDups = dup.allow

      # Did user provide a contains function?
      if not @_allowDups and dup.contains and typeof(dup.contains) is 'function'
        @_contains = (item) =>
          return dup.contains(item, @_tags)

  _add : (tag) ->
    if @_allowDups or (not @_allowDups and not @_contains(tag))
      @_index++
      @_tags.push({ tag : tag, key : '' + @_index  })

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
