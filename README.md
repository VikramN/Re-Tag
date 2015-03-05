# Re-Tag

React.js Tag Component

### By Vikram

## Demo Page
http://vikramn.github.io/Re-Tag/

## Sample Code

```javascript
// Simple default model
var tags1 = new TagCollection();

// Render Tag Component
// props: css = css class for each tag, collection = set to the model
React.render(<Tags css={'tag'} deleteCss={'deleteTag'} collection={tags1} />, document.getElementById('tagContainer1'));

// Render the tag input component, this is the one that accepts user input
// props: css : input[type=text] css class, collection : model, breaks: array of chars to use for splitting,
// handleBlur & handleEnter handles blur event and enter key pressed event
var input1 =  React.render(<TagInput css={'tagInput1'} collection={tags1} breaks={[' ', ',', ';', '.']}
  handleBlur={true} handleEnter={true} />,document.getElementById('tagInput1') );

// Example to set focus to input
document.getElementById('make_focus').onclick = function(){
    input1.setFocus();
};
```

## License
MIT



