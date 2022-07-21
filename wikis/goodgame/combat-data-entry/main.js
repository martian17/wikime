

class InputMatrix extends ELEM{
    constructor(){
        
    }
}

let E = function(a,b,c,d){
    return new ELEM(a,b,c,d);
};

class InputSlots extends ELEM{
    values = [];
    constructor(n){
        super("div","class:slots");
        let that = this;
        let pm = this.add("div","class:pm;");
        let plus = pm.add("div",0,"+");
        let minus = pm.add("div",0,"-");
        plus.on("click",()=>{
            let inp = new ELEM("input","type:text;");
            let idx = that.values.length;
            that.values.push("");
            inp.on("input",()=>that.values[idx]=inp.e.value);
            //that.insertBefore(inp,pm);
            that.add(inp);
        });
        minus.on("click",()=>{
            if(!pm.getNext())return;
            that.children.getTail().remove();
            //pm.getPrev()?.remove();
            that.values.pop();
        });
        //[plus,minus].map(elem=>elem.on("click",e=>e.preventDefault()));
        for(let i = 0; i < n; i++){
            plus.e.click();
        }
    }
};


let main = async function(){
    let body = new ELEM(document.body);
    
    body.add("h2",0,"friendly forces");
    let friendly;
    let tb1;
    let tb2;
    {
        let tbody = body.add("table").add("tbody");
        tb1 = tbody;
        
        friendly = ["tools","troops","lost"].map((item)=>{
            tbody.add("tr").add("td","colspan:3",item,"font-size:1.5em;");
            let row = tbody.add("tr");
            return [1,2,1].map((n)=>row.add("td").add(new InputSlots(n)));
        });
    }
    body.add("h2",0,"enemy forces");
    let enemy;
    {
        let tbody = body.add("table").add("tbody");
        tb2 = tbody;
        
        enemy = ["tools","troops","lost"].map((item)=>{
            tbody.add("tr").add("td","colspan:3",item,"font-size:1.5em;");
            let row0 = tbody.add("tr");
            row0.add("td");
            let court = row0.add(new InputSlots(2));
            row0.add("td");
            let row1 = tbody.add("tr");
            let rest = [1,2,1].map((n)=>row1.add("td").add(new InputSlots(n)));
            return [court].concat(rest);
        });
    }
    
    body.add("h2",0,"tags");
    let tags = body.add("textarea");
    body.add("h2",0,"description");
    let description = body.add("textarea");
    
    body.add("h2",0,"JSON");
    let result = body.add("textarea",0,0,"width:500px;height:600px;");
    
    let getTTL = function(ttl){
        let [tools,troops,lost] = ttl;
        return {
            tools:tools.map(e=>e.values),
            troops:troops.map(e=>e.values),
            lost:lost.map(e=>e.values)
        }
    };
    
    [tb1,tb2,tags,description].map(tb=>tb.on("keydown",(e)=>{
        if(e.key !== "Enter")return;
        console.log("enter pressed");
        
        let data = {
            time:Date.now(),
            friendly:getTTL(friendly),
            enemy:getTTL(enemy),
            tags:tags.e.value.trim().split(/\s+/g).filter(s=>s!==""),
            description:description.e.value
        };
        let r = JSON.stringify(data,null,4);
        console.log(r);
        result.e.value = r;
    }));
    
    
};


main();