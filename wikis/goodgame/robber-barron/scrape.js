//url: https://goodgameempire.fandom.com/wiki/Robber_Baron_Castle_Level_1-10

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

let levels = splitContain([...document.querySelector(".mw-parser-output").children],e=>e.nodeName==="H2").body.map(level=>{
    let result = splitContain(level,e=>e.nodeName==="H3");
    return {
        name:result.pre[0].children[0].textContent,
        pretext:result.pre.slice(1).map(e=>e.textContent).join("\n"),
        sub:result.body.map(sub=>{
            let tables = [];
            sub.map(node=>{
                [...node.getElementsByTagName("tbody")].map(tbody=>{
                    tables.push(tbody);
                });
            });
            return {
                name:sub[0].children[0].textContent,
                body:sub.slice(1).map(e=>e.outerHTML),
                tables:tables.map(e=>e.outerHTML)
            };
        })
    };
});

console.log(JSON.stringify(levels));
