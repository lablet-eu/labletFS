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
//% color=#0a59a8 weight=100 icon="\uf07c" block="LabletFS";
namespace LabletFS{
    let isOpen:boolean=false
    let tx = SerialPin.P15
    let rx = SerialPin.P14
    let baud = 115200
    let timeout = 1000
    //% blockId="LabletFS_openDefaultFS"
    //% block="openDefaultFS"
    export function openDefaultFS(){
        serial.redirect(tx,rx,baud)
        isOpen=true
    }
    //% blockId="LabletFS_readCommand"
    //% block="readCommand $cmd"
    export function readCommand(cmd:string):string{
        serial.writeLine(cmd)
        let t0 = control.millis()
        let t = t0
        let result = ""
        while (t - t0 < timeout) {
            let s = serial.readString()
            if (s.length <= 0) break
            basic.showNumber(s.length)
            result+=s
            t0 = t
            t = control.millis()
        }
        return result
    }
    //% blockId="LabletFS_list"
    //% block="list content of directory"
    export function list():String[]{
        let r=readCommand("ls\r\n")
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