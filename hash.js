var Hash = function(){
	var table={};
	var all;
	var oldData;

	this.on = function(page,fn){
		table[page]=fn;
	}

	this.onAll = function(fn){
		all=fn;
	}

	var def = "index";
  	
	this.setDefault = function(page){
		def = page;
	}

	this.run = function(page){
		table[page]();
	}

	var hashsplit = function(hash){
		var data = {};
		data['sub'] = {};
		data['var'] = null;
		data['page'] = null;
		data['hash'] = null;
		
		if(hash==""){
			data['page'] = def;
			return data;
		}
		hash = hash.split('!');
		if(typeof hash[1] !== "undefined"){
			data['hash'] = hash[1];
		}
		if(hash[0]==""){
			data['page'] = def;
			return data;
		}
		if(hash[0].charAt(0)=='#'){
			data['page'] = def;
			hash = hash[0].split('#');
			//todo ##var&r=l
			hash = hash[1].split('&');
			if(hash[0] == ""){
				return data;
			}
			var v=hash[0].split('=');
			if(typeof v[1] !== "undefined"){
				data['var'] = null;
				data['sub'][v[0]] = v[1];
			}else{
				data['var'] = v[0];
			}
			for(var i=1;i<hash.length;i++){
				var v2 = hash[i].split('=');
				data['sub'][v2[0]] = v2[1];
			}
		}else{
			hash=hash[0].split(':');
			if(typeof hash[1] !== "undefined"){
				data['page'] = hash[0];
				hash = hash[1].split('&');
				if(hash[0] == ""){
					return data;
				}
				var v=hash[0].split('=');
				if(typeof v[1] !== "undefined"){
					data['var'] = null;
					data['sub'][v[0]] = v[1];
				}else{
					data['var'] = v[0];
				}
				for(var i=1;i<hash.length;i++){
					var v2 = hash[i].split('=');
					data['sub'][v2[0]] = v2[1];
				}
			}else{
				data['page'] = hash[0];
				data['var'] = null;
			}
		}

		return data;
	}

	var onChange = function(){
		var loc = location.hash;
		loc = loc.substring(1);
		var data = hashsplit(loc);
		var pdh;
		if(typeof all !== "undefined"){
			pdh = all(data);
		}
		if(typeof table[data['page']] !== "undefined"){
			pdh = table[data['page']](data);
		}
		oldData = data;
		if(pdh!==true){
			document.getElementById(data['hash']).scrollIntoView();
		}
	}

	this.get = function(hash){
		return hashsplit(hash);
	}

	window.onhashchange = onChange;
}