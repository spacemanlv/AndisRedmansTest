(function($) {
    /*var constants = {
        type: 1
    };*/
    
    $.tree = function(element, options) {
        this.options = {};
        this.element = element;
		this.data = options.data;

        this.init = function(element, options) {
            this.options = $.extend({}, $.tree.defaultOptions, options); 
			if(this.options.data == null || objectLength(options.data) == 0){
				this.options.data = {
					0: {
						name: "",
						childs: {}
					}
				};
				this.data = this.options.data;
			}
            createTree(element, this.options);
        };
        
        element.data('tree', this);
        this.init(element, options);
    };
    
    $.tree.defaultOptions = {
		data: [],
		onAddNode: function () { return true; },
		onRemoveNode: function () { return true; },
		onUpdateNode: function () { return true; }
    }

    $.fn.tree = function(options) {
        return this.each(function() {
            (new $.tree($(this), options));
        });
    };

    //Private function
    function createTree(element, options) {
        var treeObj = createSkeleton();
		if(objectLength(options.data) > 0){
			buildTreeChildNodes(element, treeObj, options.data, 0);
		}
        $(element).html(treeObj);
    };
	
	function buildTreeChildNodes(tree, element, data, level, path){
		for (var i in data) {
			var newPath = path != undefined ? path + "-" + i : i;
			if(data[i] != null){
				var node = createNode(tree, data[i], level, newPath);
				$(element).append(node);
				if(objectLength(data[i].childs) > 0){
					buildTreeChildNodes(tree, node, data[i].childs, level + 1, newPath);
				}
			}
		}
	};
	
	//UI CREATE FUNCTIONS
	function createNode(tree, data, level, path) {
		var marginStep = 20;
		var marginLeft = marginStep * level;
		var nodeHtml = "<div data-navigation-id='" + path + "'>";
		nodeHtml += "<table><tr>";
		nodeHtml += "<td><input data-action-update='1' style='margin-left: " + marginLeft + "px' type='text' value='" + data.name + "'/></td>";
		nodeHtml += "<td><input data-action-type='add' type='button' value='+'></td>";
		if(level > 0)
			nodeHtml += "<td><input data-action-type='remove' type='button' value='-'></td>";
		nodeHtml += "</tr></table>";
		nodeHtml += '</div>';
		nodeHtml = $(nodeHtml);
		$(nodeHtml).find("[data-action-update]").keyup(function(event){
			var node = $(this).parents("[data-navigation-id]");
			var path = node.attr("data-navigation-id");
			var pathArray = path.split("-");
			var treeData = tree.data('tree').data;
			var nodeObject = treeData[pathArray[0]];
			for(var i = 1; i < pathArray.length; i++){
				nodeObject = nodeObject.childs[pathArray[i]];
			}
			nodeObject.name = $(this).val();
			
			tree.data('tree').options.onUpdateNode(treeData);
		});
		$(nodeHtml).find("[data-action-type]").click(function(event){
			switch ($(this).attr("data-action-type")) {
			case "add":
				var node = $(this).parents("[data-navigation-id]");
				var path = node.attr("data-navigation-id");
				var pathArray = path.split("-");
				var treeData = tree.data('tree').data;
				var nodeObject = treeData[pathArray[0]];
				var level = 1;
				var emptyNodeData = {name: "", childs: []};
				if(pathArray.length > 1){
					for(var i = 1; i < pathArray.length; i++){
						nodeObject = nodeObject.childs[pathArray[i]];
						if(i == (pathArray.length - 1)){
							nodeObject.childs[objectLength(nodeObject.childs)] = emptyNodeData;
						}
						level++;
					}
				}
				else{
					nodeObject.childs[objectLength(nodeObject.childs)] = emptyNodeData;
				}
				var currentNode = tree.find("[data-navigation-id='" + path + "']");
				var newIndex = currentNode.find(">[data-navigation-id]").length;
				//create element and append it
				var newNode = createNode(tree, emptyNodeData, level, path + "-" + newIndex);
				currentNode.append(newNode);
				currentNode.find("[data-action-update]:last").focus();
				//call callback function
				tree.data('tree').options.onAddNode(treeData);
				break;
			case "remove":
				var node = $(this).parents("[data-navigation-id]");
				var path = node.attr("data-navigation-id");
				var pathArray = path.split("-");
				var treeData = tree.data('tree').data;
				var nodeObject = treeData[pathArray[0]];
				if(pathArray.length > 1){
					for(var i = 1; i < pathArray.length; i++){
						if(i + 1 == pathArray.length){
							delete nodeObject.childs[pathArray[i]];
						}
						else
							nodeObject = nodeObject.childs[pathArray[i]];
					}
				}
				else{
					delete treeData[pathArray[0]];
				}
				tree.find("[data-navigation-id='" + path + "']").remove();
				//call callback function
				tree.data('tree').options.onRemoveNode(treeData);
				break;
			}
		});
        return nodeHtml;
	};
    
    function createSkeleton() {
        var skeleton = '<div class="ui-tree">';
        skeleton += '</div>';
        return $(skeleton);
    };
	
	function objectLength(obj){
		return Object.keys(obj).length;
	};

})(jQuery);