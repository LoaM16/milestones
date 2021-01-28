(async e=>{const t=require("axios"),i=require("fs").promises,l=require("path");let n,a=l.join(__dirname,"delete for new data.json"),o=l.join(__dirname,"delete for new account.json");try{n=require(a),require(o)}catch(e){const t=require("fnbr").Client;try{var r={deviceAuth:require(o)}}catch(e){r={authorizationCode:async e=>t.consoleQuestion("\nLogge dich bei epicgames ein und gehe zu:\nhttps://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code \nHalte die Webseite geöffnet und gib hier den Code ein: ")}}const l=new t({auth:r,debug:e=>e});l.on("deviceauth:created",e=>i.writeFile(o,JSON.stringify(e,null,2))),console.log("\n- starting fortnite"),await l.login(),console.log("\n- downloading profile"),n=(await l.Http.send(!0,"POST",`https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${l.user.id}/client/QueryProfile?profileId=athena&rvn=-1`,`bearer ${l.Auth.auths.token}`,{"Content-Type":"application/json"},{})).response,await i.writeFile(a,JSON.stringify(n,null,2)),await l.logout()}console.log("\n- checking cache folder");let s=l.join(__dirname,"cache");await i.mkdir(s,{recursive:!0}),console.log("\n- searching active quests");let c=Object.values(n.profileChanges[0].profile.items).map(e=>({templateId:e.templateId.split(":")[1].toLowerCase(),reached:e.attributes[Object.keys(e.attributes).find(e=>e.startsWith("completion_"))]||0})).filter(e=>e.templateId.match(/quest_s15_milestone.*q\d+$/)).sort((e,t)=>e.templateId>t.templateId?1:e.templateId<t.templateId?-1:0),d=["quest_s15_milestone_complete_cquest_q00","quest_s15_milestone_complete_equest_q00","quest_s15_milestone_complete_lquest_q00","quest_s15_milestone_complete_rquest_q00","quest_s15_milestone_complete_ucquest_q00"],u=[/q\d+/g,"q00"],f=Array.from(new Set(c.map(e=>e.templateId.replace(...u)))).filter(e=>!d.includes(e));c=Object.fromEntries(f.map(e=>{let t=c.filter(t=>t.templateId.replace(...u)===e).filter((e,t,i)=>e.reached===Math.max(...i.map(e=>e.reached)));return[e,{name:null,reached:t[0].reached,quests:t.map(e=>e.templateId),count:new Array}]})),console.log("\n- downloading file list");let p=l.join(s,"all_files.json");try{var h=require(p)}catch(e){h=(await t("https://benbotfn.tk/api/v1/files")).data;await i.writeFile(p,JSON.stringify(h,null,2))}h=h.filter(e=>f.some(t=>e.toLowerCase().replace(...u).includes(t)));for(let e in c){let n=Object.keys(c).length,a=Object.keys(c).indexOf(e);a%10&&a+1!==n||console.log(`\n- downloading quests ... ${a&&a+1!==n?a:a+1} / ${n}`);for(let n of c[e].quests){let a=h.find(e=>e.toLowerCase().includes(n));if(!a){console.log(n);continue}let o=l.join(s,`${n}.json`);try{var m=require(o)}catch(e){let l=`https://benbotfn.tk/api/v1/assetProperties?lang=de&path=${a}`;m=(await t(l)).data.export_properties[0];await i.writeFile(o,JSON.stringify(m,null,2))}c[e].name=m.DisplayName.finalText,c[e].count.push(m.Objectives[0].Count)}}c=Object.values(c).filter(e=>!e.count.includes(e.reached)).map(e=>({id:e.quests.reverse()[0],name:e.name,done:e.reached,next:e.count.join(", ")})),await i.writeFile("output.json",JSON.stringify(c,null,2)),console.log("\n- rendering image");const g=require("canvas"),w=require("canvas-txt").default;let q=Math.sqrt(c.length),y=Math.ceil(q),_=Math.trunc(q);q-_>.5&&(_=y);let b=300,v=200,j=10,O=4,x=10,S=40,C=new g.createCanvas(y*b+(y-1)*j,_*v+(_-1)*j),I=C.getContext("2d"),k=I.createLinearGradient(0,0,0,C.height);k.addColorStop(0,"#09b0ff"),k.addColorStop(1,"#0942b4"),I.fillStyle=k,I.fillRect(0,0,C.width,C.height);for(let e of Array(c.length).keys()){let t={x:e%y*(b+j),y:Math.trunc(e/y)*(v+j),width:b,height:v};I.fillStyle="#00c3ff",I.fillRect(...Object.values(t)),t={x:t.x+O,y:t.y+O,width:t.width-2*O,height:t.height-2*O},I.fillStyle="#0086e6",I.fillRect(...Object.values(t)),I.fillStyle="white",w.fontSize=21;let i=c[e].name+"\n\nDONE: "+c[e].done+"\n\nNEXT: "+c[e].next;w.drawText(I,i,t.x+x,t.y+x,b-2*x,v-3*x-S+O),t={x:t.x-O+x,y:t.y-O+v-x-S,width:b-2*x,height:S},I.fillStyle="#0065ad",I.fillRect(...Object.values(t));let l=c[e].next.split(", "),n=t.width/l.reverse()[0];I.fillStyle="#00c3ff",t.width=c[e].done*n,I.fillRect(...Object.values(t));for(let e of l.slice(0,-1))I.fillStyle="#0086e6",I.fillRect(t.x+e*n-O/2,t.y,O,t.height)}let N=C.toBuffer();await i.writeFile("output.png",N)})();