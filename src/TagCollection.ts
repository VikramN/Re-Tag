class TagCollection {
    _index = 0;
    _tags = [];
    _observers : {():void}[] = [];
    _onAdd : {(string, Array):string} = null;
    _onDelete : {(string, Array): boolean} = null;

    constructor(options) {
        this._onAdd = options && typeof(options.onAdd) === 'function' ? options.onAdd : null;
        this._onDelete = options && typeof(options.onDelete) === 'function' ? options.onDelete : null;
    }

    _add(tag: string){
        tag = this._onAdd ? this._onAdd(tag, this._tags) : tag;
        if(tag){
            this._index++;
            this._tags.push( { tag : tag, key: '' + this._index});
        }
    }

    _fire(){
        for(var i=0; i< this._observers.length; i++) {
            this._observers[i]();
        }
    }

    addRange(tags:Array<string>){
        for(var i=0; i< tags.length; i++) {
            var t= tags[i];
            if(t && t !== '') {
                this._add(t);
            }
        }
        this._fire();
    }

    add(tag:string){
        if(tag && tag !== ''){
            this._add(tag);
            this._fire();
        }
    }

    remove(key:string){
        var remove = this._onDelete ? this._onDelete(key, this._tags) : true;

        if(remove) {
            for(var i =0 ; i < this._tags.length; i++) {
                if(this._tags[i].key === key) {
                    this._tags.splice(i, 1);
                    this._fire();
                    return;
                }
            }
        }
    }

    clear(){
        this._index = 0;
        this._tags = [];
        this._fire();
    }

    getTags() : Array<string> {
        var result: string[] = new Array<string>(this._tags.length);
        for (var i = 0; i < this._tags.length; i++) {
            result[i] = this._tags[i].tag;
        }
        return result;
    }

    listen(callback:{():void}){
        if(callback){
            this._observers.push(callback);
        }
    }
}

