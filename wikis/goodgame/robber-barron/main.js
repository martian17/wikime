let splitContain = function(arr,cb){
    let pre = [];
    let body = [];
    let section = null;
    for(let i = 0; i < arr.length; i++){
        let elem = arr[i];
        if(cb(arr[i])){
            section = [];
            body.push(section);
        }
        if(!section){
            pre.push(elem);
            continue;
        }
        section.push(elem);
    }
    return {pre,body};
};



let levels = null;
let body = new ELEM(document.body);


let addUrl = async function(url){
    levels = await (await fetch(url)).json();
    let subs = levels.map(l=>l.sub).reduceRight((a,b)=>b.concat(a));
    for(let i = 0; i < subs.length; i++){
        let sube = body.add("div",0,0,"width:440px;overflow:hidden;float:left;");
        let sub = subs[i];
        sube.add("h3",0,sub.name.split(/\s+/g)[1]);
        sube.add("table",0,sub.tables[1],"width:430px");
        
        let last = splitContain(sub.body,str=>{
            return str.slice(0,6) === "<table"
        }).body.pop().slice(1).join("\n");
        sube.add("div",0,last);
    }
};

let main = async function(){
    await addUrl("./robber-barron.json");
    body.add("div",0,0,"width:100vw;height:0px;float:left;border-top:solid 1px #888;margin:50px 0px;");
    await addUrl("./robber-barron-11-15.json");
    body.add("div",0,0,"width:100vw;height:0px;float:left;border-top:solid 1px #888;margin:50px 0px;");
    await addUrl("./robber-barron-16-20.json");
};
/*
let main = async function(){
    levels = await (await fetch("./robber-barron.json")).json();
    let body = new ELEM(document.body);
    let subs = levels.map(l=>l.sub).reduceRight((a,b)=>b.concat(a));
    for(let i = 0; i < subs.length; i++){
        let sube = body.add("div",0,0,"width:440px;overflow:hidden;float:left;");
        let sub = subs[i];
        sube.add("h3",0,sub.name.split(/\s+/g)[1]);
        sube.add("table",0,sub.tables[1],"width:430px");
        
        let last = splitContain(sub.body,str=>{
            return str.slice(0,6) === "<table"
        }).body.pop().slice(1).join("\n");
        sube.add("div",0,last);
        //sub.tables.map(t=>{
        //    sube.add("table",0,t);
        //});
    }
};
*/

main();








