/*
 Developed By Vikram N
 https://github.com/VikramN
 License : MIT
 */

if (typeof module === 'undefined') {
    if(typeof window.React === 'undefined') {
        console.log('Re-Tag requires React which is missing');
    } else {
        window.ReTag = ReTagFactory();
    }
} else {
    var React = require('react');
    module.exports = ReTagFactory();
}

function ReTagFactory() {
    return {

        // React component to display tags
        Tags: React.createClass({
            displayName: "Tags",

            getInitialState: function () {
                return {
                    tags: []
                }
            },

            // once we mount check, we listen to model
            componentDidMount: function () {
                var _ = this;
                var src = this.props.collection;
                src.listen(function () {
                    _.setState({
                        tags: src._tags
                    });
                });
            },

            // every tag has data-tag attribute. It's the key used to uniquely id a tag
            // key is also used by react renderer
            removeTag: function (e) {
                var key = e.target.getAttribute('data-tag');
                this.props.collection.remove(key);
            },

            // map each element to a tag (html dom element)
            // each tag is div, it also has button 'x' to delete
            _mapper: function (e) {
                var _ = this;
                return (    React.createElement("div", {key: e.key, className: _.props.css},
                    e.tag,
                    React.createElement("button", {
                        "data-tag": e.key,
                        style: {display: 'inline'},
                        className: _.props.deleteCss,
                        onClick: _.removeTag
                    }, "  ")
                ))
            },

            render: function () {
                return (
                    React.createElement("div", {style: {display: 'inline'}}, this.state.tags.map(this._mapper))
                );
            }
        }),

        // React component to handle tag input
        TagInput: React.createClass({
            displayName: "TagInput",

            getInitialState: function () {
                return {text: '', breaks: []};
            },

            componentDidMount: function () {
                // Default delims
                var chars = [',', ' '];

                if (this.props.breaks) {
                    // So user over-rides default delims
                    chars = this.props.breaks;
                }

                this.setState({text: this.state.text, breaks: chars});
            },

            // check if delim exists in txt
            breaks: function (txt) {
                var chars = this.state.breaks;
                for (var i = 0; i < chars.length; i++) {
                    if (txt.indexOf(chars[i]) !== -1) {
                        return true;
                    }
                }

                return false;
            },

            // set focus to input element (dom)
            setFocus: function () {
                this.refs.txt_tag.getDOMNode().focus();
            },

            // On text change of input
            onTextChange: function (e) {
                var txt = e.target.value;

                // We have delim
                if (this.breaks(txt)) {

                    // And it's not the 1st char
                    if (txt.length === 1) {
                        return;
                    }

                    this.addTag(e);

                } else {

                    // Valid, continue with input
                    this.setState({text: e.target.value, breaks: this.state.breaks});
                }
            },

            addTag: function (e) {
                var txt = e.target.value;

                // We create a regex [ ] with all delims and split using that
                // Send this over to model
                this.props.collection.addRange(txt.split(new RegExp('[' + this.state.breaks.join('') + ']')));

                this.setState({text: '', breaks: this.state.breaks});
            },

            onKeyInput: function (e) {
                // Enter KEY
                if (e.keyCode === 13) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    this.addTag(e);
                    return false;
                }
            },

            render: function () {
                var t = React.createElement("input", {
                    ref: "txt_tag", className: this.props.css, type: 'text', value: this.state.text,
                    onChange: this.onTextChange
                });

                if (this.props.handleBlur) {
                    t.props.onBlur = this.addTag;
                }

                if (this.props.handleEnter) {
                    t.props.onKeyUp = this.onKeyInput;
                }

                return t;
            }
        }),

        // Create a style node in the doc's head
        // This has default css for rendering tags
        // Skip this call and provide your own css
        addDefaultStyles: function () {
            var defaultStyle = ".tag { border: 1px solid #B8B9BA; border-radius: 5px; background-color: transparent; padding: 5px 5px 5px 10px; margin: 2px; display: inline-block; }" +
            ".tagInput1 { outline: none; border: 0px; height: 20px; margin: 2px; }" +
            ".tagInput2 { outline: none; border: 0px; border-bottom: 1px solid #ddd; height: 20px; width: 90%; margin: 5px; }" +
            ".deleteTag { border: 0; border-radius: 21px; color: #ff604c; padding: 0px 4px 1px 4px; text-decoration: none; outline: none; cursor: pointer; background-color: transparent; font-weight: bold; }" +
            ".deleteTag:hover { color: red; }" +
            ".deleteTag:before { content: '✖'; }";

            var s = document.createElement('style');
            s.innerHTML = defaultStyle;
            document.head.appendChild(s);
        },

        TagCollection: (function () {
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
                    this._tags.push({tag: tag, key: '' + this._index});
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
        })()
    };
}

