var TagCollection = (function () {
    function TagCollection(options) {
        this._index = 0;
        this._tags = [];
        this._observers = [];
        this._onAdd = null;
        this._onDelete = null;
        this._onAdd = options && typeof (options.onAdd) === 'function' ? options.onAdd : null;
        this._onDelete = options && typeof (options.onDelete) === 'function' ? options.onDelete : null;
    }
    TagCollection.prototype._add = function (tag) {
        tag = this._onAdd ? this._onAdd(tag, this._tags) : tag;
        if (tag) {
            this._index++;
            this._tags.push({ tag: tag, key: '' + this._index });
        }
    };
    TagCollection.prototype._fire = function () {
        for (var i = 0; i < this._observers.length; i++) {
            this._observers[i]();
        }
    };
    TagCollection.prototype.addRange = function (tags) {
        for (var i = 0; i < tags.length; i++) {
            var t = tags[i];
            if (t && t !== '') {
                this._add(t);
            }
        }
        this._fire();
    };
    TagCollection.prototype.add = function (tag) {
        if (tag && tag !== '') {
            this._add(tag);
            this._fire();
        }
    };
    TagCollection.prototype.remove = function (key) {
        var remove = this._onDelete ? this._onDelete(key, this._tags) : true;
        if (remove) {
            for (var i = 0; i < this._tags.length; i++) {
                if (this._tags[i].key === key) {
                    this._tags.splice(i, 1);
                    this._fire();
                    return;
                }
            }
        }
    };
    TagCollection.prototype.clear = function () {
        this._index = 0;
        this._tags = [];
        this._fire();
    };
    TagCollection.prototype.getTags = function () {
        var result = new Array(this._tags.length);
        for (var i = 0; i < this._tags.length; i++) {
            result[i] = this._tags[i].tag;
        }
        return result;
    };
    TagCollection.prototype.listen = function (callback) {
        if (callback) {
            this._observers.push(callback);
        }
    };
    return TagCollection;
})();
//# sourceMappingURL=TagCollection.js.map