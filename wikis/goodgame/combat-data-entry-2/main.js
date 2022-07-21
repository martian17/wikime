//util class / functions

let makeTable = function(w,h,table){
    table = table || new ELEM("table");
    let tbody = table.add("tbody");
    let arr = [];
    for(let i = 0; i < h; i++){
        let tr = tbody.add("tr");
        arr.push([]);
        let ar = arr[i];
        for(let j = 0; j < w; j++){
            ar[j] = tr.add("td");
        }
    }
    return [table,arr];
};

let objMap = function(obj,cb){
    let obj2 = {};
    for(let key in obj){
        obj2[key] = cb(obj[key],key);
    }
    return obj2;
};

class ELEMBUS extends ELEM{
    constructor(a,b,c,d){
        super(a,b,c,d);
        let bus = new Events();
        this.on = bus.on.bind(bus);
        this.emit = bus.emit.bind(bus);
    }
}


class Slots extends ELEMBUS{
    slots = [];
    constructor(n,slot_constructor){
        super("div","class:slots");
        let that = this;
        let pm = this.add("div","class:pm;");
        let plus = pm.add("div",0,"+");
        let minus = pm.add("div",0,"-");
        
        plus.on("click",()=>{
            let slot = that.add(new slot_constructor());
            console.log(slot);
            that.slots.push(slot);
        });
        minus.on("click",()=>{
            if(!pm.getNext())return;
            that.children.getTail().remove();
            that.slots.pop();
        });
        for(let i = 0; i < n; i++){
            plus.e.click();
        }
    }
};









//main code

/*
[i1,i2].map(input=>{
    input.on("keydown",e=>{
        if(e.key === "Enter")that.emit("enter");
    });
});
*/


class ItemSlot extends ELEMBUS{
    constructor(){
        super("div");
        let that = this;
        let i1 = this.add("input","type:text");
        let i2 = this.add("input","type:text");
        
        this.i1 = i1;
        this.i2 = i2;
    }
    get value(){
        let item,cnt,loss;
        let val = this.i1.e.value.trim().match(/^([0-9]+)\s*(.*)$/)?.slice(1,3);
        if(val){
            [cnt,item] = val;
            cnt = parseInt(cnt);
        }else{
            cnt = NaN;
            item = this.i1.e.value;
        }
        loss = parseInt(this.i2.e.value);
        return {item,cnt,loss};
    }
};

class ItemSlotAutoComplete extends ItemSlot{
    constructor(){
        super();
        let {i1,i2} = this;
        let tampered = false;
        i1.on("input",()=>{
            if(tampered)return;
            let val = i1.e.value.trim().match(/^([0-9]+)\s*(.*)$/)?.slice(1,3);
            if(!val)return;
            let [n,name] = val;
            i2.e.value = "-"+n;
        });
        i2.on("input",()=>{
            tampered = true;
        });
    }
};

class InputSlots extends Slots{
    constructor(n,{auto=false}={auto:false}){
        super(n,auto?ItemSlotAutoComplete:ItemSlot)
    }
    get value(){
        return this.slots.map(slot=>slot.value);
    }
};



class Flank extends ELEM{
    constructor(fn,en){
        super("table");
        let [_,rows] = makeTable(2,2,this);
        let friend_tools  = rows[0][0].add(new InputSlots(fn,{auto:true}));
        let friend_troops = rows[1][0].add(new InputSlots(fn));
        
        let enemy_tools   = rows[0][1].add(new InputSlots(en,{auto:true}));
        let enemy_troops  = rows[1][1].add(new InputSlots(en));
        
        this.inputs = {
            friend_tools,friend_troops,enemy_tools,enemy_troops
        };
    }
    get value(){
        let {inputs} = this;
        console.log(inputs.friend_tools.value);
        return objMap(inputs,input=>input.value);
    }
};


let main = async function(){
    let body = new ELEM(document.body);
    
    body.add("h2",0,"friendly forces");
    
    let [tableE,table] = makeTable(3,2);
    body.add(tableE);
    
    let left =   table[0][0].add(new Flank(1,1));
    let center = table[0][1].add(new Flank(2,2));
    let right =  table[0][2].add(new Flank(1,1));
    
    let court =  table[1][1].add(new Flank(2,2));
    
    //input areas below the table
    body.add("h2",0,"tags");
    let tags = body.add("textarea");
    body.add("h2",0,"description");
    let description = body.add("textarea");
    
    body.add("h2",0,"JSON");
    let result = body.add("textarea",0,0,"width:500px;height:600px;");
    
    
    [tableE,tags,description].map(tb=>tb.on("keydown",(e)=>{
        if(e.key !== "Enter")return;
        console.log("enter pressed");
        
        let data = {
            time:Date.now(),
            left:left.value,
            center:center.value,
            right:right.value,
            court:court.value,
            tags:tags.e.value.trim().split(/\s+/g).filter(s=>s!==""),
            description:description.e.value
        };
        let r = JSON.stringify(data);
        console.log(r);
        result.e.value = r;
    }));
};


main();