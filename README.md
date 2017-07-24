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



### Example usage #

Include the CSS and JS:
```html
<link href="/css/bigselect.css" rel="stylesheet" />
<script type="text/javascript" src="/js/bigselect.js"></script>
```


Add the HTML for the select on your page:
```html
<div class="big-select dropdown"
	data-field-name="testDataName"
	data-content-name="testData"
	data-type="single"
	data-readonly="false"
	data-selected='["hello"]'>
</div>
```


Register the data for the select:
```javascript
BigSelectData.add("testData", {"hello":{"adminDisplayName":"Hello"},"world":{"adminDisplayName":"World"}});
```


Init big select on the element when document is ready:
```javascript
$(document).ready(function() {
	$('.big-select').bigselect();
});
```

Export the selected values before posting the data:
```javascript
var postData = Object();
$('#formid').find("input").each(function() {
	if (typeof($(this).attr("name")) !== "undefined")
	{
		if ($(this).is(":checkbox"))
		{
			postData[ $(this).attr("name") ] = $(this).is(':checked');
		}
		else
		{
			postData[ $(this).attr("name") ] = $(this).val();
		}
	}
});
var bigSelectData = $('.big-select').bigselectexport();
$.extend(postData, bigSelectData);
// Add to request as post data
```


### Parameters for Big Select div element #

| Attribute         | Example Value              | Description                                                                                                     |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------------------------------|
| class             | big-select dropdown|dropup | Requires big-select, then choose either dropdown or dropup to determine the direction it opens up.              |
| data-field-name   | testField                  | The field name when exported.                                                                                   |
| data-content-name | testContent                | The content name, should match what you register into BigSelectData.                                            |
| data-type         | single|multi               | Set to single to be a single-select or multi for a multi-select.                                                |
| data-readonly     | true|false                 | Whether or not to be in readonly mode. Will still output for export.                                            |
| data-selected     | ["hello"]                  | JSON array of the items currently selected. [] for none.                                                        |
| data-on-change    | functionName               | Function to call when the selects content changes, first parameter is an object with the new values.            |


### Public functions #

| Function                                                          | Description                                                                                                                                                                                                                                                        |
|-------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| $(element).bigselect()                                            | Inits big select on the selected element.                                                                                                                                                                                                                          |
| $(element).bigselectexport()                                      | Exports the data for this element, EG: If the name was 'testDataName' and it was a single select, the result is 'obj["testDataName"] = "value";' if it is a multi-select the result is 'obj["testDataName[]"] = "value1";obj["testDataName[]"] = "value2";'. |
| $(element).bigselectcurrent()                                     | Works the same as export, but works on a single element instead of multiple.                                                                                                                                                                                       |
| $(element).bigselectregenerate()                                  | Regenerates big select for the selected elements, useful for updating the contents of existing big selects.                                                                                                                                                        |
| $(element).bigselectset(mixed selectedItems, bool ignoreOnUpdate) | Sets newly selected items for this big select, takes either string for a single object, or array of strings for multiple. Useful for programmatically updating the selected items. If false is sent for ignoreOnUpdate any on change function assigned to the big select element will be ignored.                                                 |

