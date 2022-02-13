export class SliderKlue{
    private targetSlider : HTMLElement;
    private sliderMode: string = "block";
    private left: number = 0;
    private mouseDown: number =0;
    private clickable: HTMLDivElement;
    private moveable:HTMLElement;
    private copyID : string;
    private block:boolean = false;
    private blockValue:HTMLElement;
    public ikor:number[] = [];
    public currentPct:number = 1;
    public blockNumber:number;



    constructor(sliderQ:string,change:string,_opacity:boolean,_mode:string){
        if(_mode=="block"){
            this.block = true;
            this._onBlock(sliderQ,change,_opacity);
        }
        else if(_mode=="inline"){
            this.block = false;
            this._onInline(sliderQ,change,_opacity);
        }
        return this;
    }
    private _onBlock(sliderQ:string,change:string,_opacity?:boolean){
        this.targetSlider = document.querySelector(sliderQ) as HTMLElement;
        let copy = this.targetSlider.cloneNode(true) as HTMLElement;
        this.targetSlider.style.position = "relative";
        copy.className = "slider-klue-full";
        copy.id = copy.id+"-full";
        let copyChild = copy.children;
        let op = 0;

        this.targetSlider.appendChild(copy);
        if(copyChild.length >1 )
            op = 0.4/(copyChild.length-1);
        for(let i =0;i<copyChild.length;i++){
            let d = copyChild[i] as HTMLElement;
            copyChild[i].className = copyChild[i].className + " " + change;
            if(_opacity==true && op!=0 ){
                d.style.opacity = 0.6 + op*i +"";
            }
            this.ikor.push(d.offsetWidth);
            let m = window.getComputedStyle(d);
            this.ikor[i] += parseFloat(m["marginLeft"]) || 0;
            this.ikor[i] += parseFloat(m["marginRight"]) || 0;
        }
        this.clickable = document.createElement("div");
            this.clickable.style.position = "absolute";
            this.clickable.style.width = "100%";
            this.clickable.style.height = "100%";
            this.clickable.style.opacity = "0";
            this.clickable.style.zIndex = "2";
            this.clickable.style.left = "0";
            this.clickable.style.top = "0";
            this.clickable.style.display = "block";
            this.clickable.style.textAlign = "left";
            this.clickable.className = "slider-klue-clickable";
            this.clickable.id = copy.id + "-clickable";
        this.moveable = copy;
        this.clickable.addEventListener("mousedown",this._mouseEvent);
        this.clickable.addEventListener("mouseleave",this._mouseEvent);
        this.clickable.addEventListener("mouseup",this._mouseEvent);
        this.clickable.addEventListener("mousemove",this._mouseEvent);
        this.targetSlider.appendChild(this.clickable);
        return this;
    }

    private _onInline = (sliderQ:string,change:string,_opacity:boolean) => {
        this.targetSlider = document.querySelector(sliderQ) as HTMLElement;
        let copy:HTMLElement = this.targetSlider.cloneNode(true) as HTMLElement;
        let outer = document.createElement("div");
            outer.style.position = "absolute";
            outer.style.width = "100%";
            outer.style.height = "100%";
            outer.style.overflow = "hidden";
            outer.style.zIndex = "1";
            outer.style.left = "0";
            outer.style.top = "0";
            outer.style.display = "block";
            outer.style.textAlign = "left";
            outer.className = "slider-klue-outer";
            outer.id = copy.id + "-outer";
        this.targetSlider.style.position = "relative";
        copy.className = "slider-klue-full";
        copy.id = copy.id+"-full";
        let copyChild = copy.children;
        let op = 0;

        outer.appendChild(copy);
        this.targetSlider.appendChild(outer);
        if(copyChild.length >1 )
            op = 0.4/(copyChild.length-1);
        for(let i =0;i<copyChild.length;i++){
            copyChild[i].className = copyChild[i].className + " " + change;
            if(_opacity==true && op!=0 ){
                let d = copyChild[i] as HTMLElement;
                d.style.opacity = 0.6 + op*i +"";
            }
        }
        this.moveable = outer;
        copy.style.width = this.targetSlider.offsetWidth+"px";
        this.clickable = document.createElement("div");
            this.clickable.style.position = "absolute";
            this.clickable.style.width = "100%";
            this.clickable.style.height = "100%";
            this.clickable.style.opacity = "0";
            this.clickable.style.zIndex = "2";
            this.clickable.style.left = "0";
            this.clickable.style.top = "0";
            this.clickable.style.display = "block";
            this.clickable.style.textAlign = "left";
            this.clickable.className = "slider-klue-clickable";
            this.clickable.id = copy.id + "-clickable";

        this.clickable.addEventListener("mousedown",this._mouseEvent);
        this.clickable.addEventListener("mouseleave",this._mouseEvent);
        this.clickable.addEventListener("mouseup",this._mouseEvent);
        this.clickable.addEventListener("mousemove",this._mouseEvent);
        this.targetSlider.appendChild(this.clickable);
        return this;
    }
    private cumlativeLeft(_Element:HTMLElement){
        let left = 0;
        do {
            left += _Element.offsetLeft || 0;
            _Element = _Element.offsetParent as HTMLElement;
        } while(_Element);
        return left;
    }
    private changeBlock = (_event:MouseEvent,_target:HTMLElement) =>{
        let size = _event.pageX - this.left;
        let dz = _target.children;
        let j = 0;
        let i = 0;
        while(j<size){
            j += this.ikor[i++];
            if(i>100){
                j +=400;
            }
        }
        _target.style.width = j +"px";
        if(this.blockValue){
            switch(this.blockValue.tagName){
                case "input":
                    (this.blockValue as HTMLInputElement).value = "i";
                    break;
                default:
                    this.blockValue.innerHTML = ""+i;
                    break;
            }
        }
        this.blockNumber = i;
        this.currentPct = j/ this.targetSlider.offsetWidth;
        return j / this.targetSlider.offsetWidth;
    }

    private changeInline(_event:MouseEvent,_target:HTMLElement){
        let size = _event.pageX - this.left;
        _target.style.width = size +"px";
        this.currentPct =  size / this.targetSlider.offsetWidth;
    }
    private _mouseEvent  = (_event:MouseEvent)=> {
        switch(_event.type){
            case "mousedown":
                this.mouseDown = 1;
                this.left = this.cumlativeLeft(this.clickable);
                break;
            case "mouseleave":
                this.mouseDown =0;
                break;
            case "mouseup":
                this.mouseDown =0;
                if(this.block==true)
                    this.changeBlock(_event,this.moveable);
                else
                    this.changeInline(_event,this.moveable);
                break;
            case "mousemove":
                if(this.mouseDown ==1){
                    if(this.block ==true)
                        this.changeBlock(_event,this.moveable);
                    else
                        this.changeInline(_event,this.moveable);
                }
                break;
        }
    }

    setValue = (_value:number) =>{
        let a = this.targetSlider.offsetWidth * _value;
        if(this.block){
            let j = 0,
                i = 0;
            while(j<a){
                j += this.ikor[i++];
                if(i>100){
                    j +=400;
                }
            }
            a = j;
            if(this.blockValue){
                switch(this.blockValue.tagName){
                    case "input":
                        (this.blockValue as HTMLInputElement).value = "i";
                        break;
                    default:
                        this.blockValue.innerHTML = ""+i;
                        break;
                }
            }
            this.blockNumber = i;
        }

        this.moveable.style.width = a +"px";
        this.currentPct =  a / this.targetSlider.offsetWidth;
        return this;
    }
    bindBlockValue = (_id:string) =>{
        this.blockValue = document.querySelector(_id) as HTMLElement;
        return this;
    }
    holdValue = (_value?:number) =>{
        if(_value){
            this.setValue(_value);
        }
        this.clickable.removeEventListener("mousedown",this._mouseEvent);
        this.clickable.removeEventListener("mouseup",this._mouseEvent);
        this.clickable.removeEventListener("mouseleave",this._mouseEvent);
        this.clickable.removeEventListener("mousedown",this._mouseEvent);
        return this;
    }
}
