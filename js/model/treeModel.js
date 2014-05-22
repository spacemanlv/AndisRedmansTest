var treeModel = treeModel
|| {
	data: null,
	localStorageKey: "treeDataJSON",
	init: function(sUrl) {
		if(localStorage.getItem("treeDataJSON"))
			this.data = JSON.parse(localStorage.getItem(this.localStorageKey));
	},
	
	getTreeData: function(){
		return this.data;
	},
	
	setTreeData: function(data){
		localStorage.setItem(this.localStorageKey, JSON.stringify(data));
	},
};
