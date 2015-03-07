/*
 Developed By Vikram N
 https://github.com/VikramN
 License : MIT
 */

var ReTag = {

    // React component to display tags
    Tags : React.createClass({

        getInitialState : function(){
            return {
                tags : []
            }
        },

        // once we mount check, we listen to model
        componentDidMount : function() {
            var _ = this;
            var src = this.props.collection;
            src.listen(function(){
                _.setState({
                    tags : src._tags
                });
            });
        },

        // every tag has data-tag attribute. It's the key used to uniquely id a tag
        // key is also used by react renderer
        removeTag : function(e) {
            var key = e.target.getAttribute('data-tag');
            this.props.collection.remove(key);
        },

        // map each element to a tag (html dom element)
        // each tag is div, it also has button 'x' to delete
        _mapper : function(e){
            var _ = this;
            return (    <div key={e.key} className={ _.props.css}>
                            {e.tag}
                <button data-tag={e.key} style={{ display: 'inline' }} className={ _.props.deleteCss} onClick={_.removeTag} >  </button>
            </div>)
        },

        render : function(){
            return (
                <div style={{ display: 'inline'}}>{ this.state.tags.map(this._mapper) }</div>
            );
        }
    }),

    // React component to handle tag input
    TagInput : React.createClass({

        getInitialState : function(){
            return { text : '', breaks : [] };
        },

        componentDidMount : function() {
            // Default delims
            var chars = [',', ' '];

            if(this.props.breaks) {
                // So user over-rides default delims
                chars = this.props.breaks;
            }

            this.setState({ text : this.state.text, breaks : chars});
        },

        // check if delim exists in txt
        breaks : function(txt) {
            var chars = this.state.breaks;
            for(var i =0; i < chars.length; i++){
                if(txt.indexOf(chars[i]) !== -1){
                    return true;
                }
            }

            return false;
        },

        // set focus to input element (dom)
        setFocus : function(){
            this.refs.txt_tag.getDOMNode().focus();
        },

        // On text change of input
        onTextChange : function(e){
            var txt = e.target.value;

            // We have delim
            if(this.breaks(txt)) {

                // And it's not the 1st char
                if(txt.length === 1){
                    return;
                }

                this.addTag(e);

            } else {

                // Valid, continue with input
                this.setState({ text : e.target.value, breaks : this.state.breaks});
            }
        },

        addTag : function(e){
            var txt = e.target.value;

            // We create a regex [ ] with all delims and split using that
            // Send this over to model
            this.props.collection.addRange(txt.split(new RegExp('[' + this.state.breaks.join('') + ']')));

            this.setState({ text : '', breaks : this.state.breaks});
        },

        onKeyInput : function(e){
            // Enter KEY
            if(e.keyCode === 13){
                if(e.preventDefault) { e.preventDefault(); }
                this.addTag(e);
                return false;
            }
        },

        render : function(){
            var t = <input ref="txt_tag" className={this.props.css} type={'text'} value={this.state.text}
                onChange={this.onTextChange} />;

            if(this.props.handleBlur) {
                t.props.onBlur=this.addTag;
            }

            if(this.props.handleEnter) {
                t.props.onKeyUp = this.onKeyInput;
            }

            return t;
        }
    }),

    // Create a style node in the doc's head
    // This has default css for rendering tags
    // Skip this call and provide your own css
    addDefaultStyles : function() {
        var defaultStyle =
            ".tag { border: 1px solid #B8B9BA; border-radius: 5px; background-color: transparent; padding: 5px 5px 5px 10px; margin: 2px; display: inline-block; }" +
            ".tagInput1 { outline: none; border: 0px; height: 20px; margin: 2px; }" +
            ".tagInput2 { outline: none; border: 0px; border-bottom: 1px solid #ddd; height: 20px; width: 90%; margin: 5px; }" +
            ".deleteTag { border: 0; border-radius: 21px; color: #ff604c; padding: 0px 4px 1px 4px; text-decoration: none; outline: none; cursor: pointer; background-color: transparent; font-weight: bold; }" +
            ".deleteTag:hover { color: red; }" +
            ".deleteTag:before { content: '✖'; }";

        var s = document.createElement('style');
        s.innerHTML = defaultStyle;
        document.head.appendChild(s);
    }
};

