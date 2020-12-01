seek = 0;
//number error of today content
n_error = 1;
//number error of today content
n_codes = 10;

//cont to contents
const ATT = 1;
const DEC = 2;
const IF = 3;
const FOR = 4;
const WHI = 5;
const FUN = 6;
const MAIN = 7;

//flags to found content in code
var att_found = 0;
var dec_found = 0;
var if_found = 0;
var whi_found = 0;
var for_found = 0;
var fun_found = 0;
var main_found = 0;

//REGEX
const  regexatribut = /(int|float|char|double).*\=.*;/gm;
//const  regexdeclar =  /(int|float|char|double)\s\[A-Za-z]\;/gm;
const  regexdeclar =  /(int|float|char|double)\s[A-Za-z_].*\;/gm;
const  regexif = /\if.*\(.*\).*/gm;
const  regexif2 = /\if.*/gm;
const  regexfor = /(for).*\(.*\).*/gm;
const  regexfor2 = /(for).*/gm;
const  regexwhile = /(while).*\(.*\).*/gm;
const  regexwhile2 = /(while).*/gm;
const  regexfunction =  /(int|float|char|double)\s.*\(.*\).*/gm;
const  regexmain =  /(int|float|char|double).*\main.*\(.*\).*/gm;

var currentContent = null;
var currentLang = null;

		
$(document).ready(function(){
	
	currentContent = getContentToDay();
	currentLang = getLanguageCourse();
	
	getCompilation();
	
	console.log(getListItems());
	console.log(n_codes, n_error);
	console.log("ProgChat Blackboard Collab Started");
	
	setInterval(main, 1000);
	
	
	$("#textarea-sender").on('keypress',function(e) {
		if(e.which == 13) {
			var msg = $("#textarea-sender").val();
			$("#textarea-sender").val("");
			
			msg= msg.replace(/\>/g,'&gt;');
			msg= msg.replace(/\</g,'&lt;');
			
			
			var html = "<div class='msg'><div class='perfil'><span class='foto'></span></div><div class='content-chat'><div class='name'>Usuario</div><div class='chat-message__body'>";
			
			html += msg;

			html +="</div></div></div>";
		
			$("#container-mgs").append( html );
			
			$("#container-mgs").animate({scrollTop: $("#container-mgs").prop("scrollHeight")});
		}
	});
});



function main(){
	
	var checkmsg = document.getElementById("msg"+(seek-1));
	
	//restarted chat
	if((checkmsg == undefined) || (checkmsg == null) || (checkmsg == "")){
		seek = 0;
	}
	
	
	var msg = document.getElementsByClassName("chat-message__body");
	
	//console.log( "cheking "+ msg.length);
	for(i = seek; i< msg.length; i++){
		var text = msg[i].innerText;
		msg[i].id = "msg" + i;
		
		if( text.includes("//code") ){
			
				//console.log(text);
				
				//eval code
				evalCode(text, msg[i].id );
				//get trip of contents
			    text = getTrip( text );
				
				//replace < and > 
				text= text.replace(/\>/g,'&gt;');
				text= text.replace(/\</g,'&lt;');
				
				//remove "acentos"
				text = removerAcentos(text);
				//encode to UTF-8
				text = decodeURIComponent(escape(text));
				
				//text = decodeURIComponent(unescape( unescape(text)));
				var chtml = "<pre><code class='"+currentLang.name+"' id='cod"+i+"'>"+text+"</code></pre>";
				
				chtml += "<span class='downcode' id='dowcod"+i+"' ref='cod"+i+"' > <span class='down' ></span> Download </span>";
				msg[i].innerHTML= chtml;

				hljs.highlightBlock(document.getElementById("cod"+i));
				
				$("#dowcod"+i).click( function(){
					var text = $( "#" + $(this).attr("ref") ).text()
					console.log( text );
					var blob = new Blob([text], {type: "text/plain"});
					saveAs(blob, "arquivo."+currentLang.extension);
						
				});
			
		}
		seek++;
	}
}

function getTrip(text){
	
	textarr = text.split('\n');
	textreturn = new Array();
	let j = 0;
	//console.log( getLevelStudent());
	
	for(let i = 0; i < textarr.length; i++){
		
		
		//FOR CORRETO
		if( regexfor.exec(textarr[i]) != null){
			if( (currentContent== FOR) || (getLevelStudent(FOR) > 50)){
				if(for_found)
				textreturn[j++] = "//Esta e uma declaracao de loop FOR";	
				else
					textreturn[j++] = "/*\nEsta e uma declaracao de loop FOR \nUm loop repete a execucao de um trecho de codigo.\nA sintaxe dele e: \nfor( atribuicao inical; condicao para ele continuar executando; acao relizada a cada interacao) \nApos isso todo o codigo dentro do corpo, defindo por { }, e repetido.\nVeja um exemplos: \nfor(i = 0; i < 10; i++){ \n   printf('indice = \%d');\n }\n*/";
					
				for_found = 1;	
			}
		
		//FOR ERRO
		}else if( regexfor2.exec(textarr[i]) != null){
			
			textreturn[j] = "/*\nIdentificamos que talvez voce queira criar um FOR. \n";
			
			if(for_found)
				textreturn[j++] += "Reveja o seu codigo ou, se necessitar, use a dica no for anterior\n*/";
			else
				textreturn[j++] += "A sintaxe dele e: \nfor( atribuicao inical; condicao para ele continuar executando; acao relizada a cada interacao) \nApos isso todo o codigo dentro do corpo,defindo { }.\nVeja um exemplos: \nfor(i = 0; i < 10; i++){ \n   printf('indice = \%d'); \n }\n*/";
		
		
		}else if( regexatribut.exec(textarr[i]) != null){
			
			if((currentContent == ATT) || (getLevelStudent(ATT) > 50)){
				
				if(att_found)
					textreturn[j++] = "/*\nEsta e uma ATRIBUICAO*/";	
				else
					textreturn[j++] = "/*\nEsta e uma ATRIBUICAO\nAtribuicoes permitem colocar um valor em uma variavel.\nA sintaxe dela e:\ntipo (apenas se estiver declarando tambem) nome_variavel = valor_ser_atribuido.\nVeja dois exemplos: \nint i = 10;\ni=100;\n*/";
				
				att_found = 1;
				
			
			}
		}else if( regexdeclar.exec(textarr[i]) != null){
			if((currentContent== DEC) || (getLevelStudent(DEC) > 50))
				if(dec_found)
					textreturn[j++] = "/*\nEsta e uma DECLARACAO\n*/";	
				else
					textreturn[j++] = "/*\nEsta e uma DECLARACAO\nDeclaracoes permitem criar variaveis de tipos distintos.\nA sintaxe dela e:\ntipo nome_da_variavel.\nVeja um exemplo: \nint i;\n*/";
			
			dec_found = 1;
			
		}else if( regexif.exec(textarr[i]) != null){
			if((currentContent == IF) || (getLevelStudent(IF) > 50)){
				if(if_found)
					textreturn[j++] = "/*\nEsta e uma CONDICIONAL IF \n*/";	
				else
					textreturn[j++] = "/*\nEsta e uma  CONDICIONAL IF\nCondicionais permitem mudar o fluxo do codigo de acordo com alguma avaliacao/condicao.\nA sintaxe dela e:\nif( condicao ).\nApos isso, todo o codigo dentro do corpo, definido por { } \nVeja um exemplo: \nif(i>100){\n   print('valor menor que 100');\n}\n*/";
				
				if_found = 1;
			}
		
		}else if( regexif2.exec(textarr[i]) != null){
				
			textreturn[j] = "/*\nIdentificamos que talvez voce queira criar um IF. \n";
			
			if(if_found)
				textreturn[j++] += "Reveja o seu codigo ou, se necessitar, use a dica no if anterior\n*/";
			else
				textreturn[j++] += "Condicionais permitem mudar o fluxo do codigo de acordo com alguma avaliacao/condicao.\nA sintaxe dela e:\nif( condicao ).\nApos isso, todo o codigo dentro do corpo, definido por { } \nVeja um exemplo: \nif(i>100){\n   print('valor menor que 100');\n}\n*/";
				
				
			
		
		}else if( regexmain.exec(textarr[i]) != null){
			
			if((currentContent== MAIN) || (getLevelStudent(MAIN) > 50))
				if(!main_found)
					textreturn[j++] = "/*\nEsta e a FUNCAO MAIN.\nEsta e a funcao  principal do seu codigo. \n*/";	
				
				main_found = 1;
		
		}else if( regexfunction.exec(textarr[i]) != null){
			if((currentContent == FUN) || (getLevelStudent(FUN) > 50))
				if(fun_found)
					textreturn[j++] = "// *** Esta e uma FUNCAO *** ";	
				else
					textreturn[j++] = "/* Esta e uma  FUNCAO  \nfuncoes permitem escrever trechos de codigo que podem ser retutilizados. \nFuncoes podem ter algum valor a ser retornado. \nA sintaxe dela e:\ntipo nome_fucao()\nApos isso, todo o codigo dentro do corpo, definido por { } sera executado na chamada\n\nVeja um exemplo: \nint somar(int a,int b){\n   return a+b;\n}\n*/";
				
				fun_found = 1;
		
		}else if( regexwhile.exec(textarr[i]) != null){
			if((currentContent == WHI) || (getLevelStudent(WHI) > 50))
				if(fun_found)
					textreturn[j++] = "//Esta e um declaracao de loop WHILE";	
				else
					textreturn[j++] = "/*\nEsta e uma declaracao de loop WHILE. \nUm loop repete a execucao de mum trecho de codigo.\nA sintaxe dele e: \nwhile( condicao ) \nApos isso, todo o codigo dentro do corpo, defindo { } sera repetido ate que a condicao seja falsa.\nVeja um exemplos: \nwhile(i > 10){ \n   printf('indice = \%d');\n   i++; \n}\n*/";
				
				fun_found = 1;
		
		}else if( regexwhile2.exec(textarr[i]) != null){
			
			textreturn[j] = "/*\nIdentificamos que talvez voce queira criar um WHILE.\n"
		
			if(whi_found)
				textreturn[j++] += "Reveja o seu codigo ou, se necessitar, use a dica no while anterior\n*";			
			else
				textreturn[j++] += "Um loop repete a execucao de mum trecho de codigo.\nA sintaxe dele e: \nwhile( condicao ) \nApos isso, todo o codigo dentro do corpo, defindo { } sera repetido ate que a condicao seja falsa.\nVeja um exemplos: \nwhile(i > 10){ \n   printf('indice = \%d');\n   i++; \n}\n*/";
				
			whi_found = 1;
		
		}
		
		textreturn[j++] = textarr[i];
		
		
	}	
	
	textreturn[ textreturn.length ] = "//Data: " + getCurrentDate()+ "- " + getContentName ( currentContent );
	
	var textret = "";
	for(let i = 0; i < textreturn.length; i++){
		textret += textreturn[i] + "\n";
	}
	
	return textret;
}

function getContentToDay(){
	var datecur = getCurrentDate();
	//make request
	var data = '{"date": "00/00/000", "content":"if"}';
	var json = JSON.parse(data);
	var content = 0;
	
	if(json.content == "if"){
		content = IF;
	}if(json.content == "for"){
		content = FOR;
	}else if(json.content == "att"){
		content = ATT;
	}else if(json.content == "dec"){
		content = DEC;
	}else if(json.content == "whi"){
		content = WHI;
	}else if(json.content == "fun"){
		content = FUN;
	}else if(json.content == "main"){
		content = MAIN;
	}

	return content; 
}
/*
* @name GetLanguageCourse
* @desc Get the language used in a course, e.g., C, Python, Java
*/
function getLanguageCourse(){
	var data = '{"course": "Algoritmo", "lang":"c", "extension":"c"}';
	var json = JSON.parse(data);
	
	return json;
}
/*
* @name GetCurrentDate
* @desc Get the current date in format: dd/mm/yyyy
*/
function getCurrentDate(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

function getLevelStudent(content){
	if((content == undefined) || (content == null))
		content = currentContent;
	
	var arr_code = getCompilationOtherContents(content);
	var percent = (arr_code[1] * 100 / arr_code[0]);
	console.log(content + " " +percent + "%");
	
	return  percent;
}

/*
* @name setCompilation
* @desc Add the genral compilation and error compilation numbers.
*/
function setCompilation(error){
	currentContent;
	n_codes++;
	if(error)
		n_error++;
	
	saveCompilation();
}

function saveCompilation(){
	saveItem(currentContent, n_codes + "|" + n_error);
}

function getCompilation(){
	
	var ncodes = getItem(currentContent);
	console.log(ncodes);
	if(ncodes!=null){
		var arr_ncodes = ncodes.split("|");
		n_codes = parseInt( arr_ncodes[0] );
		n_error = parseInt( arr_ncodes[1] );
	}
}


function getCompilationOtherContents(content){
	
	var ncodes = getItem(content);

	if(ncodes!=null){
		var arr_ncodes = ncodes.split("|");
		var n_codes = parseInt( arr_ncodes[0] );
		var n_error = parseInt( arr_ncodes[1] );
	}
	
	return [n_codes, n_error];
}

function evalCode(text, idcode){
	
	
	$.ajax({
        url: "http://192.168.0.102/API-ExecuteCode/api.php",
        url: "http://localhost/API-ExecuteCode/api.php",
        type: 'POST',
        data: {code: text},
        //data: {code: "teste"},
        success: function(data) {
			json = JSON.parse(data);
			if(json.status == "noerror"){
				$("#" + idcode).append("<span style=color:#090>  &#10004; Correto!</span>");
				setCompilation(0);
			}else if(json.status == "error"){
				$("#" + idcode).append("<span style=color:#900>  &#10006; Erro!</span>");
				setCompilation(1);
			}
			//console.log(data);		
        },
		
		error: function(data){
			console.log(data);
		}
        
    });
	
}


function getContentName(content){
	
	if(content == DEC)
		return "declaracao de varaveis";
	else if(content == ATT)
		return "atribucao de valores";
	else if(content == IF)
		return "condicionais if";
	else if(content == FOR)
		return "loops com for";
	else if(content == WHI)
		return "loops com while";
	else if(content == FUN)
		return "funcoes";
	else if(content == MAIN)
		return "funcao main";
	
	
}
function removerAcentos(str) {
	let base64map="eyLDgSI6IkEiLCLEgiI6IkEiLCLhuq4iOiJBIiwi4bq2IjoiQSIsIuG6sCI6IkEiLCLhurIiOiJBIiwi4bq0IjoiQSIsIseNIjoiQSIsIsOCIjoiQSIsIuG6pCI6IkEiLCLhuqwiOiJBIiwi4bqmIjoiQSIsIuG6qCI6IkEiLCLhuqoiOiJBIiwiw4QiOiJBIiwix54iOiJBIiwiyKYiOiJBIiwix6AiOiJBIiwi4bqgIjoiQSIsIsiAIjoiQSIsIsOAIjoiQSIsIuG6oiI6IkEiLCLIgiI6IkEiLCLEgCI6IkEiLCLEhCI6IkEiLCLDhSI6IkEiLCLHuiI6IkEiLCLhuIAiOiJBIiwiyLoiOiJBIiwiw4MiOiJBIiwi6pyyIjoiQUEiLCLDhiI6IkFFIiwix7wiOiJBRSIsIseiIjoiQUUiLCLqnLQiOiJBTyIsIuqctiI6IkFVIiwi6py4IjoiQVYiLCLqnLoiOiJBViIsIuqcvCI6IkFZIiwi4biCIjoiQiIsIuG4hCI6IkIiLCLGgSI6IkIiLCLhuIYiOiJCIiwiyYMiOiJCIiwixoIiOiJCIiwixIYiOiJDIiwixIwiOiJDIiwiw4ciOiJDIiwi4biIIjoiQyIsIsSIIjoiQyIsIsSKIjoiQyIsIsaHIjoiQyIsIsi7IjoiQyIsIsSOIjoiRCIsIuG4kCI6IkQiLCLhuJIiOiJEIiwi4biKIjoiRCIsIuG4jCI6IkQiLCLGiiI6IkQiLCLhuI4iOiJEIiwix7IiOiJEIiwix4UiOiJEIiwixJAiOiJEIiwixosiOiJEIiwix7EiOiJEWiIsIseEIjoiRFoiLCLDiSI6IkUiLCLElCI6IkUiLCLEmiI6IkUiLCLIqCI6IkUiLCLhuJwiOiJFIiwiw4oiOiJFIiwi4bq+IjoiRSIsIuG7hiI6IkUiLCLhu4AiOiJFIiwi4buCIjoiRSIsIuG7hCI6IkUiLCLhuJgiOiJFIiwiw4siOiJFIiwixJYiOiJFIiwi4bq4IjoiRSIsIsiEIjoiRSIsIsOIIjoiRSIsIuG6uiI6IkUiLCLIhiI6IkUiLCLEkiI6IkUiLCLhuJYiOiJFIiwi4biUIjoiRSIsIsSYIjoiRSIsIsmGIjoiRSIsIuG6vCI6IkUiLCLhuJoiOiJFIiwi6p2qIjoiRVQiLCLhuJ4iOiJGIiwixpEiOiJGIiwix7QiOiJHIiwixJ4iOiJHIiwix6YiOiJHIiwixKIiOiJHIiwixJwiOiJHIiwixKAiOiJHIiwixpMiOiJHIiwi4bigIjoiRyIsIsekIjoiRyIsIuG4qiI6IkgiLCLIniI6IkgiLCLhuKgiOiJIIiwixKQiOiJIIiwi4rGnIjoiSCIsIuG4piI6IkgiLCLhuKIiOiJIIiwi4bikIjoiSCIsIsSmIjoiSCIsIsONIjoiSSIsIsSsIjoiSSIsIsePIjoiSSIsIsOOIjoiSSIsIsOPIjoiSSIsIuG4riI6IkkiLCLEsCI6IkkiLCLhu4oiOiJJIiwiyIgiOiJJIiwiw4wiOiJJIiwi4buIIjoiSSIsIsiKIjoiSSIsIsSqIjoiSSIsIsSuIjoiSSIsIsaXIjoiSSIsIsSoIjoiSSIsIuG4rCI6IkkiLCLqnbkiOiJEIiwi6p27IjoiRiIsIuqdvSI6IkciLCLqnoIiOiJSIiwi6p6EIjoiUyIsIuqehiI6IlQiLCLqnawiOiJJUyIsIsS0IjoiSiIsIsmIIjoiSiIsIuG4sCI6IksiLCLHqCI6IksiLCLEtiI6IksiLCLisakiOiJLIiwi6p2CIjoiSyIsIuG4siI6IksiLCLGmCI6IksiLCLhuLQiOiJLIiwi6p2AIjoiSyIsIuqdhCI6IksiLCLEuSI6IkwiLCLIvSI6IkwiLCLEvSI6IkwiLCLEuyI6IkwiLCLhuLwiOiJMIiwi4bi2IjoiTCIsIuG4uCI6IkwiLCLisaAiOiJMIiwi6p2IIjoiTCIsIuG4uiI6IkwiLCLEvyI6IkwiLCLisaIiOiJMIiwix4giOiJMIiwixYEiOiJMIiwix4ciOiJMSiIsIuG4viI6Ik0iLCLhuYAiOiJNIiwi4bmCIjoiTSIsIuKxriI6Ik0iLCLFgyI6Ik4iLCLFhyI6Ik4iLCLFhSI6Ik4iLCLhuYoiOiJOIiwi4bmEIjoiTiIsIuG5hiI6Ik4iLCLHuCI6Ik4iLCLGnSI6Ik4iLCLhuYgiOiJOIiwiyKAiOiJOIiwix4siOiJOIiwiw5EiOiJOIiwix4oiOiJOSiIsIsOTIjoiTyIsIsWOIjoiTyIsIseRIjoiTyIsIsOUIjoiTyIsIuG7kCI6Ik8iLCLhu5giOiJPIiwi4buSIjoiTyIsIuG7lCI6Ik8iLCLhu5YiOiJPIiwiw5YiOiJPIiwiyKoiOiJPIiwiyK4iOiJPIiwiyLAiOiJPIiwi4buMIjoiTyIsIsWQIjoiTyIsIsiMIjoiTyIsIsOSIjoiTyIsIuG7jiI6Ik8iLCLGoCI6Ik8iLCLhu5oiOiJPIiwi4buiIjoiTyIsIuG7nCI6Ik8iLCLhu54iOiJPIiwi4bugIjoiTyIsIsiOIjoiTyIsIuqdiiI6Ik8iLCLqnYwiOiJPIiwixYwiOiJPIiwi4bmSIjoiTyIsIuG5kCI6Ik8iLCLGnyI6Ik8iLCLHqiI6Ik8iLCLHrCI6Ik8iLCLDmCI6Ik8iLCLHviI6Ik8iLCLDlSI6Ik8iLCLhuYwiOiJPIiwi4bmOIjoiTyIsIsisIjoiTyIsIsaiIjoiT0kiLCLqnY4iOiJPTyIsIsaQIjoiRSIsIsaGIjoiTyIsIsiiIjoiT1UiLCLhuZQiOiJQIiwi4bmWIjoiUCIsIuqdkiI6IlAiLCLGpCI6IlAiLCLqnZQiOiJQIiwi4rGjIjoiUCIsIuqdkCI6IlAiLCLqnZgiOiJRIiwi6p2WIjoiUSIsIsWUIjoiUiIsIsWYIjoiUiIsIsWWIjoiUiIsIuG5mCI6IlIiLCLhuZoiOiJSIiwi4bmcIjoiUiIsIsiQIjoiUiIsIsiSIjoiUiIsIuG5niI6IlIiLCLJjCI6IlIiLCLisaQiOiJSIiwi6py+IjoiQyIsIsaOIjoiRSIsIsWaIjoiUyIsIuG5pCI6IlMiLCLFoCI6IlMiLCLhuaYiOiJTIiwixZ4iOiJTIiwixZwiOiJTIiwiyJgiOiJTIiwi4bmgIjoiUyIsIuG5oiI6IlMiLCLhuagiOiJTIiwixaQiOiJUIiwixaIiOiJUIiwi4bmwIjoiVCIsIsiaIjoiVCIsIsi+IjoiVCIsIuG5qiI6IlQiLCLhuawiOiJUIiwixqwiOiJUIiwi4bmuIjoiVCIsIsauIjoiVCIsIsWmIjoiVCIsIuKxryI6IkEiLCLqnoAiOiJMIiwixpwiOiJNIiwiyYUiOiJWIiwi6pyoIjoiVFoiLCLDmiI6IlUiLCLFrCI6IlUiLCLHkyI6IlUiLCLDmyI6IlUiLCLhubYiOiJVIiwiw5wiOiJVIiwix5ciOiJVIiwix5kiOiJVIiwix5siOiJVIiwix5UiOiJVIiwi4bmyIjoiVSIsIuG7pCI6IlUiLCLFsCI6IlUiLCLIlCI6IlUiLCLDmSI6IlUiLCLhu6YiOiJVIiwixq8iOiJVIiwi4buoIjoiVSIsIuG7sCI6IlUiLCLhu6oiOiJVIiwi4busIjoiVSIsIuG7riI6IlUiLCLIliI6IlUiLCLFqiI6IlUiLCLhuboiOiJVIiwixbIiOiJVIiwixa4iOiJVIiwixagiOiJVIiwi4bm4IjoiVSIsIuG5tCI6IlUiLCLqnZ4iOiJWIiwi4bm+IjoiViIsIsayIjoiViIsIuG5vCI6IlYiLCLqnaAiOiJWWSIsIuG6giI6IlciLCLFtCI6IlciLCLhuoQiOiJXIiwi4bqGIjoiVyIsIuG6iCI6IlciLCLhuoAiOiJXIiwi4rGyIjoiVyIsIuG6jCI6IlgiLCLhuooiOiJYIiwiw50iOiJZIiwixbYiOiJZIiwixbgiOiJZIiwi4bqOIjoiWSIsIuG7tCI6IlkiLCLhu7IiOiJZIiwixrMiOiJZIiwi4bu2IjoiWSIsIuG7viI6IlkiLCLIsiI6IlkiLCLJjiI6IlkiLCLhu7giOiJZIiwixbkiOiJaIiwixb0iOiJaIiwi4bqQIjoiWiIsIuKxqyI6IloiLCLFuyI6IloiLCLhupIiOiJaIiwiyKQiOiJaIiwi4bqUIjoiWiIsIsa1IjoiWiIsIsSyIjoiSUoiLCLFkiI6Ik9FIiwi4bSAIjoiQSIsIuG0gSI6IkFFIiwiypkiOiJCIiwi4bSDIjoiQiIsIuG0hCI6IkMiLCLhtIUiOiJEIiwi4bSHIjoiRSIsIuqcsCI6IkYiLCLJoiI6IkciLCLKmyI6IkciLCLKnCI6IkgiLCLJqiI6IkkiLCLKgSI6IlIiLCLhtIoiOiJKIiwi4bSLIjoiSyIsIsqfIjoiTCIsIuG0jCI6IkwiLCLhtI0iOiJNIiwiybQiOiJOIiwi4bSPIjoiTyIsIsm2IjoiT0UiLCLhtJAiOiJPIiwi4bSVIjoiT1UiLCLhtJgiOiJQIiwiyoAiOiJSIiwi4bSOIjoiTiIsIuG0mSI6IlIiLCLqnLEiOiJTIiwi4bSbIjoiVCIsIuKxuyI6IkUiLCLhtJoiOiJSIiwi4bScIjoiVSIsIuG0oCI6IlYiLCLhtKEiOiJXIiwiyo8iOiJZIiwi4bSiIjoiWiIsIsOhIjoiYSIsIsSDIjoiYSIsIuG6ryI6ImEiLCLhurciOiJhIiwi4bqxIjoiYSIsIuG6syI6ImEiLCLhurUiOiJhIiwix44iOiJhIiwiw6IiOiJhIiwi4bqlIjoiYSIsIuG6rSI6ImEiLCLhuqciOiJhIiwi4bqpIjoiYSIsIuG6qyI6ImEiLCLDpCI6ImEiLCLHnyI6ImEiLCLIpyI6ImEiLCLHoSI6ImEiLCLhuqEiOiJhIiwiyIEiOiJhIiwiw6AiOiJhIiwi4bqjIjoiYSIsIsiDIjoiYSIsIsSBIjoiYSIsIsSFIjoiYSIsIuG2jyI6ImEiLCLhupoiOiJhIiwiw6UiOiJhIiwix7siOiJhIiwi4biBIjoiYSIsIuKxpSI6ImEiLCLDoyI6ImEiLCLqnLMiOiJhYSIsIsOmIjoiYWUiLCLHvSI6ImFlIiwix6MiOiJhZSIsIuqctSI6ImFvIiwi6py3IjoiYXUiLCLqnLkiOiJhdiIsIuqcuyI6ImF2Iiwi6py9IjoiYXkiLCLhuIMiOiJiIiwi4biFIjoiYiIsIsmTIjoiYiIsIuG4hyI6ImIiLCLhtawiOiJiIiwi4baAIjoiYiIsIsaAIjoiYiIsIsaDIjoiYiIsIsm1IjoibyIsIsSHIjoiYyIsIsSNIjoiYyIsIsOnIjoiYyIsIuG4iSI6ImMiLCLEiSI6ImMiLCLJlSI6ImMiLCLEiyI6ImMiLCLGiCI6ImMiLCLIvCI6ImMiLCLEjyI6ImQiLCLhuJEiOiJkIiwi4biTIjoiZCIsIsihIjoiZCIsIuG4iyI6ImQiLCLhuI0iOiJkIiwiyZciOiJkIiwi4baRIjoiZCIsIuG4jyI6ImQiLCLhta0iOiJkIiwi4baBIjoiZCIsIsSRIjoiZCIsIsmWIjoiZCIsIsaMIjoiZCIsIsSxIjoiaSIsIsi3IjoiaiIsIsmfIjoiaiIsIsqEIjoiaiIsIsezIjoiZHoiLCLHhiI6ImR6Iiwiw6kiOiJlIiwixJUiOiJlIiwixJsiOiJlIiwiyKkiOiJlIiwi4bidIjoiZSIsIsOqIjoiZSIsIuG6vyI6ImUiLCLhu4ciOiJlIiwi4buBIjoiZSIsIuG7gyI6ImUiLCLhu4UiOiJlIiwi4biZIjoiZSIsIsOrIjoiZSIsIsSXIjoiZSIsIuG6uSI6ImUiLCLIhSI6ImUiLCLDqCI6ImUiLCLhursiOiJlIiwiyIciOiJlIiwixJMiOiJlIiwi4biXIjoiZSIsIuG4lSI6ImUiLCLisbgiOiJlIiwixJkiOiJlIiwi4baSIjoiZSIsIsmHIjoiZSIsIuG6vSI6ImUiLCLhuJsiOiJlIiwi6p2rIjoiZXQiLCLhuJ8iOiJmIiwixpIiOiJmIiwi4bWuIjoiZiIsIuG2giI6ImYiLCLHtSI6ImciLCLEnyI6ImciLCLHpyI6ImciLCLEoyI6ImciLCLEnSI6ImciLCLEoSI6ImciLCLJoCI6ImciLCLhuKEiOiJnIiwi4baDIjoiZyIsIselIjoiZyIsIuG4qyI6ImgiLCLInyI6ImgiLCLhuKkiOiJoIiwixKUiOiJoIiwi4rGoIjoiaCIsIuG4pyI6ImgiLCLhuKMiOiJoIiwi4bilIjoiaCIsIsmmIjoiaCIsIuG6liI6ImgiLCLEpyI6ImgiLCLGlSI6Imh2Iiwiw60iOiJpIiwixK0iOiJpIiwix5AiOiJpIiwiw64iOiJpIiwiw68iOiJpIiwi4bivIjoiaSIsIuG7iyI6ImkiLCLIiSI6ImkiLCLDrCI6ImkiLCLhu4kiOiJpIiwiyIsiOiJpIiwixKsiOiJpIiwixK8iOiJpIiwi4baWIjoiaSIsIsmoIjoiaSIsIsSpIjoiaSIsIuG4rSI6ImkiLCLqnboiOiJkIiwi6p28IjoiZiIsIuG1uSI6ImciLCLqnoMiOiJyIiwi6p6FIjoicyIsIuqehyI6InQiLCLqna0iOiJpcyIsIsewIjoiaiIsIsS1IjoiaiIsIsqdIjoiaiIsIsmJIjoiaiIsIuG4sSI6ImsiLCLHqSI6ImsiLCLEtyI6ImsiLCLisaoiOiJrIiwi6p2DIjoiayIsIuG4syI6ImsiLCLGmSI6ImsiLCLhuLUiOiJrIiwi4baEIjoiayIsIuqdgSI6ImsiLCLqnYUiOiJrIiwixLoiOiJsIiwixpoiOiJsIiwiyawiOiJsIiwixL4iOiJsIiwixLwiOiJsIiwi4bi9IjoibCIsIsi0IjoibCIsIuG4tyI6ImwiLCLhuLkiOiJsIiwi4rGhIjoibCIsIuqdiSI6ImwiLCLhuLsiOiJsIiwixYAiOiJsIiwiyasiOiJsIiwi4baFIjoibCIsIsmtIjoibCIsIsWCIjoibCIsIseJIjoibGoiLCLFvyI6InMiLCLhupwiOiJzIiwi4bqbIjoicyIsIuG6nSI6InMiLCLhuL8iOiJtIiwi4bmBIjoibSIsIuG5gyI6Im0iLCLJsSI6Im0iLCLhta8iOiJtIiwi4baGIjoibSIsIsWEIjoibiIsIsWIIjoibiIsIsWGIjoibiIsIuG5iyI6Im4iLCLItSI6Im4iLCLhuYUiOiJuIiwi4bmHIjoibiIsIse5IjoibiIsIsmyIjoibiIsIuG5iSI6Im4iLCLGniI6Im4iLCLhtbAiOiJuIiwi4baHIjoibiIsIsmzIjoibiIsIsOxIjoibiIsIseMIjoibmoiLCLDsyI6Im8iLCLFjyI6Im8iLCLHkiI6Im8iLCLDtCI6Im8iLCLhu5EiOiJvIiwi4buZIjoibyIsIuG7kyI6Im8iLCLhu5UiOiJvIiwi4buXIjoibyIsIsO2IjoibyIsIsirIjoibyIsIsivIjoibyIsIsixIjoibyIsIuG7jSI6Im8iLCLFkSI6Im8iLCLIjSI6Im8iLCLDsiI6Im8iLCLhu48iOiJvIiwixqEiOiJvIiwi4bubIjoibyIsIuG7oyI6Im8iLCLhu50iOiJvIiwi4bufIjoibyIsIuG7oSI6Im8iLCLIjyI6Im8iLCLqnYsiOiJvIiwi6p2NIjoibyIsIuKxuiI6Im8iLCLFjSI6Im8iLCLhuZMiOiJvIiwi4bmRIjoibyIsIserIjoibyIsIsetIjoibyIsIsO4IjoibyIsIse/IjoibyIsIsO1IjoibyIsIuG5jSI6Im8iLCLhuY8iOiJvIiwiyK0iOiJvIiwixqMiOiJvaSIsIuqdjyI6Im9vIiwiyZsiOiJlIiwi4baTIjoiZSIsIsmUIjoibyIsIuG2lyI6Im8iLCLIoyI6Im91Iiwi4bmVIjoicCIsIuG5lyI6InAiLCLqnZMiOiJwIiwixqUiOiJwIiwi4bWxIjoicCIsIuG2iCI6InAiLCLqnZUiOiJwIiwi4bW9IjoicCIsIuqdkSI6InAiLCLqnZkiOiJxIiwiyqAiOiJxIiwiyYsiOiJxIiwi6p2XIjoicSIsIsWVIjoiciIsIsWZIjoiciIsIsWXIjoiciIsIuG5mSI6InIiLCLhuZsiOiJyIiwi4bmdIjoiciIsIsiRIjoiciIsIsm+IjoiciIsIuG1syI6InIiLCLIkyI6InIiLCLhuZ8iOiJyIiwiybwiOiJyIiwi4bWyIjoiciIsIuG2iSI6InIiLCLJjSI6InIiLCLJvSI6InIiLCLihoQiOiJjIiwi6py/IjoiYyIsIsmYIjoiZSIsIsm/IjoiciIsIsWbIjoicyIsIuG5pSI6InMiLCLFoSI6InMiLCLhuaciOiJzIiwixZ8iOiJzIiwixZ0iOiJzIiwiyJkiOiJzIiwi4bmhIjoicyIsIuG5oyI6InMiLCLhuakiOiJzIiwiyoIiOiJzIiwi4bW0IjoicyIsIuG2iiI6InMiLCLIvyI6InMiLCLJoSI6ImciLCLhtJEiOiJvIiwi4bSTIjoibyIsIuG0nSI6InUiLCLFpSI6InQiLCLFoyI6InQiLCLhubEiOiJ0IiwiyJsiOiJ0IiwiyLYiOiJ0Iiwi4bqXIjoidCIsIuKxpiI6InQiLCLhuasiOiJ0Iiwi4bmtIjoidCIsIsatIjoidCIsIuG5ryI6InQiLCLhtbUiOiJ0IiwixqsiOiJ0IiwiyogiOiJ0IiwixaciOiJ0Iiwi4bW6IjoidGgiLCLJkCI6ImEiLCLhtIIiOiJhZSIsIsedIjoiZSIsIuG1tyI6ImciLCLJpSI6ImgiLCLKriI6ImgiLCLKryI6ImgiLCLhtIkiOiJpIiwiyp4iOiJrIiwi6p6BIjoibCIsIsmvIjoibSIsIsmwIjoibSIsIuG0lCI6Im9lIiwiybkiOiJyIiwiybsiOiJyIiwiyboiOiJyIiwi4rG5IjoiciIsIsqHIjoidCIsIsqMIjoidiIsIsqNIjoidyIsIsqOIjoieSIsIuqcqSI6InR6Iiwiw7oiOiJ1Iiwixa0iOiJ1Iiwix5QiOiJ1Iiwiw7siOiJ1Iiwi4bm3IjoidSIsIsO8IjoidSIsIseYIjoidSIsIseaIjoidSIsIsecIjoidSIsIseWIjoidSIsIuG5syI6InUiLCLhu6UiOiJ1IiwixbEiOiJ1IiwiyJUiOiJ1Iiwiw7kiOiJ1Iiwi4bunIjoidSIsIsawIjoidSIsIuG7qSI6InUiLCLhu7EiOiJ1Iiwi4burIjoidSIsIuG7rSI6InUiLCLhu68iOiJ1IiwiyJciOiJ1IiwixasiOiJ1Iiwi4bm7IjoidSIsIsWzIjoidSIsIuG2mSI6InUiLCLFryI6InUiLCLFqSI6InUiLCLhubkiOiJ1Iiwi4bm1IjoidSIsIuG1qyI6InVlIiwi6p24IjoidW0iLCLisbQiOiJ2Iiwi6p2fIjoidiIsIuG5vyI6InYiLCLKiyI6InYiLCLhtowiOiJ2Iiwi4rGxIjoidiIsIuG5vSI6InYiLCLqnaEiOiJ2eSIsIuG6gyI6InciLCLFtSI6InciLCLhuoUiOiJ3Iiwi4bqHIjoidyIsIuG6iSI6InciLCLhuoEiOiJ3Iiwi4rGzIjoidyIsIuG6mCI6InciLCLhuo0iOiJ4Iiwi4bqLIjoieCIsIuG2jSI6IngiLCLDvSI6InkiLCLFtyI6InkiLCLDvyI6InkiLCLhuo8iOiJ5Iiwi4bu1IjoieSIsIuG7syI6InkiLCLGtCI6InkiLCLhu7ciOiJ5Iiwi4bu/IjoieSIsIsizIjoieSIsIuG6mSI6InkiLCLJjyI6InkiLCLhu7kiOiJ5IiwixboiOiJ6Iiwixb4iOiJ6Iiwi4bqRIjoieiIsIsqRIjoieiIsIuKxrCI6InoiLCLFvCI6InoiLCLhupMiOiJ6IiwiyKUiOiJ6Iiwi4bqVIjoieiIsIuG1tiI6InoiLCLhto4iOiJ6IiwiypAiOiJ6IiwixrYiOiJ6IiwiyYAiOiJ6Iiwi76yAIjoiZmYiLCLvrIMiOiJmZmkiLCLvrIQiOiJmZmwiLCLvrIEiOiJmaSIsIu+sgiI6ImZsIiwixLMiOiJpaiIsIsWTIjoib2UiLCLvrIYiOiJzdCIsIuKCkCI6ImEiLCLigpEiOiJlIiwi4bWiIjoiaSIsIuKxvCI6ImoiLCLigpIiOiJvIiwi4bWjIjoiciIsIuG1pCI6InUiLCLhtaUiOiJ2Iiwi4oKTIjoieCJ9";
	let Latinise={};
	Latinise.latin_map=JSON.parse(decodeURIComponent(escape(atob(base64map))));
	return str.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a});
}