let prettyPrint = function(obj,cb,tabs){
    let depth = 0;
    let _continue = {};
    let pp = function(name,val,depth){
        let str = "";
        let ret = cb(name,val,depth,_continue);
        if(ret !== continue){
            return ret;
        }
        if(val instanceof Array){
            
            for(let i = 0; i < val){
                
            }
        }
    }
    return pp("",obj,0);
};



prettyPrint([[0,1,2,3]],(name,val,depth,_continue)=>{
    if(val.map(v=>(typeof v === "number") || (typeof v === "string" && v.length < 20)).reduce((a,b)=>a&&b)){
        return JSON.stringify(val);
    }
    return _continue;
});