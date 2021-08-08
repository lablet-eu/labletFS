class FileData{
    name:string
    offset:number
    data:NumberFormat.UInt8LE[]
    constructor(name:string,offset:number){
        this.name=name
        this.offset=offset
        this.data=[]
    }
}

namespace labletFS{
    export function openFS(){
        
    }
    export function readFile(name:string,offset:number):FileData{
        let fd=new FileData(name,offset)

        return fd
    }
}