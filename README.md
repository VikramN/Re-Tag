# Re-Tag

React.js Tag Component

### By Vikram

## Demo Page
http://vikramn.github.io/Re-Tag/

## Sample Code

```javascript
// Default model
var tags1 = new ReTag.TagCollection();
 
// Default model with options
var tags1 = new ReTag.TagCollection({
 
    // Return null to ignore add, else return the value that needs to be added
    // You can do lookups, case conversion etc
    onAdd : function(item, list){
        var x = item.toLowerCase();
        for(var i =0; i < list.length; i++) {
            if(list[i].tag.toLowerCase() === x) {
                return null;
            }
        }
 
        return x;
    },
 
    // Return true to delete, false to ignore delete
    // Note - Key is passed in this scenario
    onDelete : function(key, list){
        for(var i =0; i < list.length; i++) {
            if(list[i].key === key && i < 5) {
                return false;
            }
        }
 
        return true;
    }
});
 
// Render Tag Component
// props: css = css class for each tag, collection = set to the model
React.render(<ReTag.Tags css={'tag'} deleteCss={'deleteTag'} collection={tags1} />;, document.getElementById('tagContainer1'));
 
// Render the tag input component, this is the one that accepts user input
// props:   css : input[type=text] css class,
//            collection : model,
//            breaks: array of chars to use for splitting [optional, defaults to , and SPACE]
//            handleBlur : create tag on blur event [optional, won't handle]
//            handleEnter : create tag on enter press [optional, won't handle]
var input1 =  React.render(
    <ReTag.TagInput css={'tagInput1'}
        collection={tags1}
        breaks={[' ', ',', ';', '.']}
        handleBlur={true}
        handleEnter={true} />,
    document.getElementById('tagInput1') );
 
// Example to set focus to input from outside
document.getElementById('make_focus').onclick = function(){
    input1.setFocus();
};
 
// When all said and done, you can use getTags() to get array of tags held by the model
tags1.getTags()
 
// You provide your own css (refer demo.css). To add default styles to your html page, you can
ReTag.addDefaultStyles();
```

## License
MIT



