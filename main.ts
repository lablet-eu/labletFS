class FileData{
    name:string
    offset:number
    data:string[]
    constructor(name:string,offset:number){
        this.name=name
        this.offset=offset
        this.data=[]
    }
}

namespace labletFS{
    let isOpen:boolean=false
    let tx = SerialPin.P15
    let rx = SerialPin.P14
    let baud = 115200
    let timeout = 1000
    export function openConfiguredFS(){
        serial.redirect(tx,rx,baud)
        isOpen=true
    }
    export function readCommand(cmd:string):string{
        serial.writeLine(cmd)
        let t0 = control.millis()
        let t = t0
        let result = ""
        while (t - t0 < timeout) {
            let s = serial.readString()
            if (s.length <= 0) break
            result+=s
            t0 = t
            t = control.millis()
        }
        return result
    }
    export function list():String[]{
        let r=readCommand("ls")
        return r.split('\r\n')
    }
    export function readFile(name:string,offset:number):FileData{
        let fd=new FileData(name,offset)
        serial.writeLine("read "+name+" "+offset)
        let t0=control.millis()
        let t=t0
        while(t-t0<timeout){
            let s=serial.readString()
            if(s.length<=0)break
            fd.data.push(s)
            t0=t
            t=control.millis()
        }
        return fd
    }
    export function writeFile(name: string, offset: number): FileData {
        let fd = new FileData(name, offset)
        serial.writeLine("write " + name + " " + offset)
        let t0 = control.millis()
        let t = t0
        while (t - t0 < timeout) {
            let s = serial.readString()
            if (s.length <= 0) break
            fd.data.push(s)
            t0 = t
            t = control.millis()
        }
        return fd
    }
}