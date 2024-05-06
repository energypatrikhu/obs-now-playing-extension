(function () {
	'use strict';

	let a;function s(n){new MutationObserver(()=>{const t=location.href;a!==t&&(a=t,n&&n(a));}).observe(document.body,{childList:!0,subtree:!0});}const l="http://127.0.0.1:2442/api/nowPlaying";let[r,i,e]=[null,null,null],o=!1;async function c(n,t){await fetch(l,{method:"POST",body:JSON.stringify({videoId:n,time:t}),headers:{"Content-Type":"application/json"}});}s(async n=>{!n.includes("watch")||o||(o=!0,e=new URLSearchParams(window.location.search).get("v"),e===null)||e!==r&&(r=e,console.log(`VideoID changed from '${i}' to '${e}'`),console.log("Data changed, sending new data to server"),await c(e,Date.now()),i=e,o=!1);});

})();
