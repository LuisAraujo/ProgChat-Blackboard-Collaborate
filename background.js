
// Quando estiver instalando/atualizando:
chrome.runtime.onInstalled.addListener(function() {
	// Remover as regras de mudança de página:
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    	// Para adicionar a regra abaixo:
        chrome.declarativeContent.onPageChanged.addRules([{
        	// Se:
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                	// A url da página conter:
                    pageUrl: { urlContains: 'https://ca.bbcollab.com/collab/ui/session/'}
                }) ],
			// Nesse caso, mostramos a Page Action da extensão:
            actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }]); 
    });
});

