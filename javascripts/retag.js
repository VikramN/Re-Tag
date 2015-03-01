/*
 Developed By Vikram N
 https://github.com/VikramN
 License : MIT
 */

var Tags = React.createClass({
    getInitialState : function(){
        return {
            tags : []
        }
    },

    componentDidMount : function() {
        var _ = this;
        var src = this.props.collection;
        src.listen(function(){
            _.setState({
                tags : src._tags
            });
        });
    },

    removeTag : function(e) {
        var key = e.target.getAttribute('data-tag');
        this.props.collection.remove(key);
    },

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
});

var TagInput = React.createClass({

    getInitialState : function(){
        return { text : '', breaks : [] };
    },

    componentDidMount : function() {
        var chars = [',', ' '];

        if(this.props.breaks) {
            chars = this.props.breaks;
        }

        this.setState({ text : this.state.text, breaks : chars});
    },

    breaks : function(txt) {
        var chars = this.state.breaks;
        for(var i =0; i < chars.length; i++){
            if(txt.indexOf(chars[i]) !== -1){
                return true;
            }
        }

        return false;
    },

    setFocus : function(){
        this.refs.txt_tag.getDOMNode().focus();
    },

    onTextChange : function(e){
        var txt = e.target.value;
        if(this.breaks(txt)) {
            if(txt.length === 1){
                return;
            }
            this.props.collection.addRange(txt.split(new RegExp('[' + this.state.breaks.join('') + ']')));
            this.setState({ text : '', breaks : this.state.breaks});
        } else {
            this.setState({ text : e.target.value, breaks : this.state.breaks});
        }
    },

    addTag : function(e){
        var txt = e.target.value;
        this.props.collection.addRange(txt.split(new RegExp('[' + this.state.breaks.join('') + ']')));
        this.setState({ text : '', breaks : this.state.breaks});
    },

    onKeyInput : function(e){
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
});