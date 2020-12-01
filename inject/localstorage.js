var meuStorage = localStorage;

function saveItem(name, content){
	
	name = "PROGCHAT_"+name;	
	localStorage.setItem(name, content);	
}

function getItem(name){
	return localStorage.getItem("PROGCHAT_"+name);
}

function deleteItem(name){
	name = "PROGCHAT_"+name;
	localStorage.removeItem(name);
}



function getListItems(){
	var a = [];
	for( key in localStorage){
		if(key.indexOf("PROGCHAT_") != -1)
			a.push(key);
	}
	return a;
}

function clearAll(){
	
	for( key in localStorage){
		if(key.indexOf("PROGCHAT_") != -1){
			localStorage.setItem(key, "0|0");	
		}
	}

}
