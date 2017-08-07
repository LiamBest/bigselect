/*
MIT License

Copyright (c) 2017 Liam Best

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
!function ($)
{
	"use strict";
	function BigSelect(element)
	{
		this.$container = element;

		this.$button = null;
		this.$dropdown = null;
		this.$seachInput = null;

		this.contentName = element.dataset.contentName;
		this.fieldName = element.dataset.fieldName;
		this.readonly = (element.dataset.readonly === "true");
		this.type = element.dataset.type;
		this.onChange = element.dataset.onChange;

		this.selectedItems = [];
		try
		{
			if (this.$container.dataset.selected)
			{
				var items = JSON.parse(this.$container.dataset.selected);

				for (var i = 0; i < items.length; i++)
				{
					var itemName = '';
					if (typeof(items[i]) === 'object')
					{
						itemName = JSON.stringify(items[i]);
					}
					else
					{
						itemName = items[i];
					}

					if (BigSelectData.getDataName(this.contentName, itemName) !== false)
					{
						this.selectedItems.push(itemName);
					}
				}
			}
		}
		catch (error)
		{
			console.log("Failed to parse JSON from " + this.fieldName + ", got: " + this.$container.dataset.selected + ", reason: " + error.message);
		}

		this.init();
	}

	BigSelect.prototype = {
		constructor: BigSelect,
		init: function ()
		{
			this.$container.className += " dropdown";
			this.generateButton();
		},
		generateButton: function ()
		{
			var buttonText = [];
			if (this.selectedItems.length > 0)
			{
				for (var i = 0; i < this.selectedItems.length; i++)
				{
					var itemName = BigSelectData.getDataName(this.contentName, this.selectedItems[i]);
					if (itemName === false)
					{
						continue;
					}

					if (i < this.selectedItems.length - 1)
					{
						buttonText.push(crel("span", {"class": "text-label"}, itemName + ","));
						buttonText.push(crel("br"));
					}
					else
					{
						buttonText.push(crel("span", {"class": "text-label"}, itemName + " "));
					}
				}
			}

			if (buttonText.length === 0)
			{
				buttonText.push(crel("span", {"class": "text-label"}, "- "));
			}

			var buttonClass = "bs dropdown-toggle btn btn-default";
			if (this.readonly)
			{
				buttonClass += " disabled";
			}

			var button = crel("button", {
					"class": buttonClass,
					"aria-expanded": false,
					"data-toggle": "dropdown"
				},
				buttonText,
				crel("b", {"class": "caret"})
			);
			button.addEventListener("click", this.onDropdown.bind(this));

			if (!this.$button)
			{
				this.$button = button;
				this.$container.appendChild(this.$button);
			}
			else
			{
				this.$container.replaceChild(button, this.$button);
				this.$button = button;
			}
		},
		onDropdown: function (event)
		{
			if (!this.$dropdown && !this.readonly)
			{
				var dropdown = BigSelectData.getElements(this.contentName, this.type);
				if (dropdown === false)
				{
					console.log('Could not find elements for ' + this.contentName);
					return;
				}
				dropdown = dropdown.cloneNode(true);

				var i;
				var listElements = dropdown.getElementsByTagName("a");
				for (i = 0; i < listElements.length; i++)
				{
					listElements[i].addEventListener("click", this.itemChecked.bind(this));
				}

				if (this.selectedItems.length > 0)
				{
					for (i = 0; i < this.selectedItems.length; i++)
					{
						var selectBoxes = dropdown.getElementsByClassName(this.selectedItems[i]);
						if (!selectBoxes[0])
						{
							console.log("Unable to find box for " + this.selectedItems[i]);
							continue;
						}
						selectBoxes[0].checked = true;
					}
				}

				this.$dropdown = dropdown;
				this.$container.appendChild(this.$dropdown);

				this.buildSearch();
			}
			event.preventDefault();
		},
		buildSearch: function ()
		{
			var search = crel("li", {"class": "big-select-filter"},
				crel("div", {"class": "input-group"},
					crel("span", {"class": "input-group-addon"},
						crel("i", {"class": "glyphicon glyphicon-search"})
					),
					crel("input", {
						"class": "form-control big-select-search",
						"type": "text",
						"placeholder": "Search"
					}),
					crel("span", {"class": "input-group-btn"},
						crel("button", {
								"class": "btn btn-default big-select-clear-filter",
								"type": "button"
							},
							crel("i", {"class": "glyphicon glyphicon-remove-circle"})
						)
					)
				)
			);
			search.addEventListener("click", function (event)
			{
				event.stopPropagation();
			});
			this.$seachInput = search.getElementsByClassName("big-select-search")[0];
			this.$seachInput.oninput = this.filterItems.bind(this);

			search.getElementsByClassName("big-select-clear-filter")[0].addEventListener("click", this.clearFilter.bind(this));
			this.$search = search;

			if (this.$dropdown.childNodes.length > 0)
			{
				this.$dropdown.insertBefore(this.$search, this.$dropdown.childNodes[0]);
			}
			else
			{
				this.$dropdown.appendChild(this.$search);
			}
		},
		filterItems: function (event)
		{
			if (typeof(event) !== "undefined" && event.which === 13)
			{
				event.preventDefault();
			}

			var searchString = String(this.$seachInput.value).toLowerCase();

			for (var i = 1; i < this.$dropdown.childNodes.length; i++)
			{
				var currentItem = this.$dropdown.childNodes[i];
				var fieldName = String(currentItem.getElementsByClassName("itemName")[0].innerHTML).toLowerCase();

				if (fieldName.indexOf(searchString) > -1)
				{
					currentItem.style.display = "block";
				}
				else
				{
					currentItem.style.display = "none";
				}
			}
		},
		clearFilter: function ()
		{
			this.$seachInput.value = '';
			this.filterItems();
		},
		itemChecked: function (event)
		{
			var i;
			var inputs = this.$container.getElementsByTagName("input");
			if (event.target.type === "checkbox")
			{
				event.stopPropagation();

				var newSelectedItems = [];
				for (i = 0; i < inputs.length; i++)
				{
					if (inputs[i].checked === true)
					{
						newSelectedItems.push(inputs[i].value);
					}
				}
			}
			else if (event.target.type === "radio")
			{
				for (i = 0; i < inputs.length; i++)
				{
					if (inputs[i].value === event.target.value)
					{
						newSelectedItems = [event.target.value];
					}
					else
					{
						inputs[i].checked = false;
					}
				}
			}
			else
			{
				event.stopPropagation();
				return;
			}

			if (this.$container.className.indexOf("changed-input") === -1)
			{
				this.$container.className += " changed-input";
			}

			this.setSelectedItems(newSelectedItems);
		},
		setSelectedItems: function (newSelectedItems, ignoreOnChange)
		{
			this.selectedItems = newSelectedItems;
			this.generateButton();

			if (this.onChange && ignoreOnChange !== true)
			{
				if (window[this.onChange])
				{
					window[this.onChange].call(null, newSelectedItems);
				}
			}
		}
	};

	$.fn.bigselect = function ()
	{
		return this.each(function ()
		{
			var data = $(this).data("bigselect");

			if (!data)
			{
				data = new BigSelect(this);
				$(this).data("bigselect", data);
			}
		});
	};

	$.fn.bigselectregenerate = function ()
	{
		return this.each(function ()
		{
			var data = new BigSelect(this);
			$(this).data("bigselect", data);
		});
	};

	$.fn.bigselectexport = function ()
	{
		var exportData = {};
		this.each(function ()
		{
			var currentItem = $(this).data("bigselect");

			if (currentItem)
			{
				if (currentItem.type === "multi")
				{
					exportData[currentItem.fieldName] = currentItem.selectedItems;
				}
				else
				{
					exportData[currentItem.fieldName] = currentItem.selectedItems[0];
				}

				if (exportData[currentItem.fieldName] === undefined)
				{
					exportData[currentItem.fieldName] = "";
				}
			}
		});
		return exportData;
	};

	$.fn.bigselectcurrent = function ()
	{
		var currentItem = $(this).data("bigselect");

		if (currentItem)
		{
			if (currentItem.type === "multi")
			{
				return currentItem.selectedItems;
			}
			else
			{
				return currentItem.selectedItems[0];
			}
		}
	};

	$.fn.bigselectset = function (newSelectedItems, ignoreOnChange)
	{
		var currentItem = $(this).data("bigselect");

		if (currentItem)
		{
			currentItem.setSelectedItems(newSelectedItems, ignoreOnChange);
		}
	};

	$.fn.bigselect.Constructor = BigSelect;

}(window.jQuery);

var BigSelectData = {
	generatedContent: [],
	add: function (contentName, contentData)
	{
		if (BigSelectData.generatedContent[contentName])
		{
			console.log("Content already exists for " + contentName);
			return;
		}

		var multiContentItems = [];
		var singleContentItems = [];
		for (var itemId in contentData)
		{
			if (contentData.hasOwnProperty(itemId))
			{
				var itemName = contentData[itemId]['adminDisplayName'];
				multiContentItems.push(
					crel("li",
						crel("a",
							crel("label",
								{"class": "checkbox"},
								crel("input", {
									"type": "checkbox",
									"value": itemId,
									"class": itemId
								}),
								crel("span", {"class": "itemName"}, itemName)
							)
						)
					)
				);
				singleContentItems.push(
					crel("li",
						crel("a",
							crel("label",
								{"class": "radio"},
								crel("input", {
									"type": "radio",
									"value": itemId,
									"class": itemId
								}),
								crel("span", {"class": "itemName"}, itemName)
							)
						)
					)
				);
			}
		}

		BigSelectData.generatedContent[contentName] = {
			"multi": crel("ul", {"class": "big-select-container dropdown-menu"}, multiContentItems),
			"single": crel("ul", {"class": "big-select-container dropdown-menu"}, singleContentItems),
			"data": contentData
		};
		BigSelectData.generatedContent[contentName]["multi"].addEventListener("click", function (e)
		{
			e.stopPropagation();
		});
	},
	getDataName: function (contentName, itemId)
	{
		if (!this.generatedContent[contentName] || !this.generatedContent[contentName]["data"][itemId])
		{
			return false;
		}

		return this.generatedContent[contentName]["data"][itemId]['adminDisplayName'];
	},
	getElements: function (contentName, type)
	{
		if (!this.generatedContent[contentName])
		{
			return false;
		}

		return this.generatedContent[contentName][type];
	}
};

