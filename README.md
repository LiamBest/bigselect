# Big Select jQuery plugin #

Big Select solves a few problems we faced when putting together our administration panels, the admin panels featured a lot of selects with lots content, which caused the following issues:
* Selects with large contents repeated many times slowed down the page.
* It's hard to find the item you want in the content when there are a lot to choose from.

Big Select solves these issues by:
* Registering/rendering the contents once for a particular data set.
* When a select is opened, use the global contents and display the drop down (or drop up), selecting the relevant entries and reflecting the updates on the button that mimics a select.
* Included search allows users to quickly navigate the contents.


### Requirements #
* jQuery (https://jquery.com/)
* crel (https://github.com/KoryNunn/crel)
* Bootstrap 3 (http://getbootstrap.com/)


### Examples page #

Included is an examples.html file, clone or download the project and open it in any modern web browser to see an example of a single select, multi-select and dropdown/dropup set of big selects. It also produces example postData to give a concrete example of post back to your web server.


### Simple example snippets #

Include the CSS and JS for big select (see the example page for jquery/bootstrap/crel example includes):
```html
<link href="/css/bigselect.css" rel="stylesheet" />
<script src="/js/bigselect.js" type="text/javascript"></script>
```


Add the HTML for the select on your page:
```html
<div class="big-select"
    data-field-name="testDataName"
    data-content-name="testData"
    data-type="single"
    data-readonly="false"
    data-selected='["hello"]'>
</div>
```


Register the data for the big select:
```javascript
<script type="text/javascript">
	BigSelectData.add("testData", {"hello":{"adminDisplayName":"Hello"},"world":{"adminDisplayName":"World"}});
</script>
```


Init big select on the element when document is ready:
```javascript
<script type="text/javascript">
	$(document).ready(function() {
		$('.big-select').bigselect();
	});
</script>
```

Export all big selects when posting the data:
```javascript
<script type="text/javascript">
        var postData = $("#exampleForm").serialize() + "&" + $.param($(".big-select").bigselectexport());
        // Use postData for the $.post() request
</script>
```


### Parameters for Big Select div element #

| Attribute         | Example Value              | Description                                                                                                     |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------------------------------|
| class             | big-select dropdown\|dropup | Requires big-select, then choose either dropdown or dropup to determine the direction it opens up.              |
| data-field-name   | testField                  | The field name when exported.                                                                                   |
| data-content-name | testContent                | The content name, should match what you register into BigSelectData.                                            |
| data-type         | single\|multi               | Set to single to be a single-select or multi for a multi-select.                                                |
| data-readonly     | true\|false                 | Whether or not to be in readonly mode. Will still output for export.                                            |
| data-selected     | ["hello"]                  | JSON array of the items currently selected. [] for none.                                                        |
| data-on-change    | functionName               | Function to call when the selects content changes, first parameter is an object with the new values.            |


### Big Select public functions #

| Function                                                          | Description                                                                                                                                                                                                                                                        |
|-------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| $(element).bigselect()                                            | Inits big select on the selected element.                                                                                                                                                                                                                          |
| $(element).bigselectexport()                                      | Exports the data for the selected elements, you can use $.param() to serialize the output for posting |
| $(element).bigselectcurrent()                                     | Works the same as export, but works on a single element instead of multiple.                                                                                                                                                                                       |
| $(element).bigselectregenerate()                                  | Regenerates big select for the selected elements, useful for updating the contents of existing big selects.                                                                                                                                                        |
| $(element).bigselectset(mixed selectedItems, bool ignoreOnUpdate) | Sets newly selected items for this big select, takes either string for a single object, or array of strings for multiple. Useful for programmatically updating the selected items. If false is sent for ignoreOnUpdate any on change function assigned to the big select element will be ignored.                                                 |

