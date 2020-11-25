seek = 0;

$(document).ready(function(){
	console.log("ProgChat Blackboard Collab Started");
});

setInterval( function(){

	var msg = document.getElementsByClassName("chat-message__body");
	//console.log( "cheking "+ msg.length);
	for(i = seek; i< msg.length; i++){
		var text = msg[i].innerText;
		msg[i].id = "msg" + i;
		
		if( text.includes("//code") ){
				text = decodeURIComponent(escape(text));
				var chtml = "<pre><code class='c' id='cod"+i+"'>"+text+"</code></pre>";
				
				chtml += "<span id='dowcod"+i+"' ref='cod"+i+"' style='color:#22f; text-decoration: underline'> Download </span>";
				msg[i].innerHTML= chtml;

				hljs.highlightBlock(document.getElementById("cod"+i));
				
				$("#dowcod"+i).click( function(){
					var text = $( "#" + $(this).attr("ref") ).text()
					console.log( text );
					var blob = new Blob([text], {type: "text/plain"});
					saveAs(blob, "arquivo.c");
						
				});
			
		}
	//	console.log( msg[i].innerText );
	
		seek++;
	}
}, 1000);
