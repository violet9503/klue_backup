export class SvgKlue{
    private svgPentagon: HTMLElement;
    private g:SVGElement;
    private svgId:String;
    private points = {
        base : ["6", "1", "10.7552826", "4.45491503", "8.93892626", "10.045085", "3.06107374", "10.045085", "1.24471742", "4.45491503"],
        pointsAbility : []
    }
    private text:string[] = ["출석체크","학점","난이도","학습량","성취감"];
    private textAblility;

    constructor(_query){
        this.svgPentagon = document.querySelector(_query);
        this.svgId = this.svgPentagon.id;
        this.svgPentagon.setAttribute("width","323");
        this.svgPentagon.setAttribute("height","323");
        this.g = document.createElementNS('http://www.w3.org/2000/svg',"g");
        this.g.id = this.svgId+"-g";
        this.g.setAttribute("transform","translate(126,132)");        
        for(let i=5;i>=1;i--){
            let polygon = document.createElementNS('http://www.w3.org/2000/svg',"polygon");
            polygon.id = this.svgId+"-pentagon-"+i;
            polygon.setAttribute("points","");
            polygon.style.stroke="#9b9b9b";
            polygon.style.fill="#fff";
            polygon.style.strokeWidth="0.5";
            this.g.appendChild(polygon);
        }
        let polygon = document.createElementNS('http://www.w3.org/2000/svg',"polygon");
        polygon.id = this.svgId+"-pentagonAbility";
        polygon.setAttribute("style","stroke: rgba(253,136,77,.9);stroke-width: 2px;fill: rgba(253,136,77,.5);");
        this.g.appendChild(polygon);
        this.svgPentagon.appendChild(this.g);
        this.setPentagon(5);
        return this;
    }

    private setPentagon = (num) => {
        this.textAblility = num + 1;
        for (let i=1;i<=num;i++) {
            let pointsChildren = 'points' + i;
            this.points[pointsChildren] = new Array();
            for (let j=0;j<this.points.base.length;j++) {
                this.points[pointsChildren].push((parseFloat(this.points.base[j]) * (6 + i * 4)).toFixed(2));
                this.points[pointsChildren][j] = parseFloat(this.points[pointsChildren][j]) - (i * 24);
            }
            let a =this.svgPentagon.querySelector("#"+this.svgId +'-pentagon-' + i);
            a.setAttribute('points', a.getAttribute('points') + this.getStringify(this.points[pointsChildren]));
        }
        let t2d = num + 1;
        let tex = 'textPos';
        this.points[tex] = new Array();
        for(let j=0;j<this.points.base.length;j++){
                this.points[tex].push((parseFloat(this.points.base[j]) * (6 + ( t2d ) * 4 )).toFixed(2));
                this.points[tex][j] = parseFloat(this.points[tex][j]) - ( t2d * 24);
        }
        let g = this.svgPentagon.querySelector("#"+this.svgId+"-g");
        let swt = 1;
        this.points["textPos"][3] -= 18;
        this.points["textPos"][9] -= 18;
        for(let j=0;j<this.text.length;j++){
            let b = document.createElementNS('http://www.w3.org/2000/svg',"text");
            b.style.fill = "#9b9b9b";
            b.textContent = this.text[j];
            let xPos = parseFloat(this.points["textPos"][2*j]) - this.text[j].length*6;
            let yPos = parseFloat(this.points["textPos"][2*j+1]) +12;
            b.setAttribute("x", xPos + "");
            b.setAttribute("y", yPos + "");
            g.appendChild(b);
        }
    }
    private getStringify = (_array) =>{
        let r="";
        for(let i=0;i<_array.length;i++){
            r+=_array[i];
            r+=" ";
        }
        return r;
    }

   private getAbilityPoints = (_point,pos) =>{
        if(Number.isInteger(_point)){
            return this.points['points' + _point][pos*2] + ' ' + this.points['points' + _point][(pos*2)+1] + ' ';
        }
        else{
            let a =  Math.floor(_point);
            let b =  _point - a;
            let c =  this.points['points'+Math.ceil(_point)][pos*2] - this.points['points'+a][pos*2];
            let d =  this.points['points'+a][pos*2]+ b*c;
            let e =  this.points['points'+Math.ceil(_point)][(pos*2)+1] - this.points['points'+a][(pos*2)+1];
            let f =  this.points['points'+a][(pos*2)+1]+ b*e;
            return d + ' ' + f + ' ';
        }
   }
   public draw  = (p5 , p1, p2, p3, p4) => {
        let a = this.svgPentagon.querySelector("#"+this.svgId+'-pentagonAbility');
        let pentagonAbilityPoints = this.getAbilityPoints(p1,0)
                + this.getAbilityPoints(p2,1) 
                + this.getAbilityPoints(p3,2) 
                + this.getAbilityPoints(p4,3) 
                + this.getAbilityPoints(p5,4);
        a.setAttribute('points',pentagonAbilityPoints);
        return this;
    }

    public setSize = (_num) =>{
        this.svgPentagon.setAttribute("width",_num);
        this.svgPentagon.setAttribute("height",_num);
        let rate = _num / 323;
        let x = 126*rate;
        let y = 132*rate;
        this.g.setAttribute("transform","scale("+rate+") translate(126, 132)");
        return this;
    }

    public forbid = () => {
        let reset = this.svgPentagon.querySelector("#"+this.svgId+'-pentagonAbility');
        reset.setAttribute('points',"");
        let a = document.createElementNS('http://www.w3.org/2000/svg',"polygon");
        let b = this.g.querySelector("#"+this.svgId+"-pentagon-"+"5");
        let c = b.getAttribute('points');
        a.setAttribute('points',c);
        a.setAttribute("style","fill:rgba(23,23,23,0.7);");
        this.g.appendChild(a);
        let d = document.createElementNS('http://www.w3.org/2000/svg',"text");
        d.setAttribute("y","20");
        d.style.fill="white";
        d.style.fontSize="25px";
        let e = document.createElementNS('http://www.w3.org/2000/svg',"tspan");
        e.textContent = "열람권한이"
        e.setAttribute("x","-25");
        d.appendChild(e);
        let f = document.createElementNS('http://www.w3.org/2000/svg',"tspan");
        f.textContent = "없습니다"
        f.setAttribute("x","-15");
        f.setAttribute("dy","40");
        d.appendChild(f);
        this.g.appendChild(d);
        return this;
    }
    
    public prev = () => {
        let reset = this.svgPentagon.querySelector("#"+this.svgId+'-pentagonAbility');
        reset.setAttribute('points',"");
        let a = document.createElementNS('http://www.w3.org/2000/svg',"polygon");
        let b = this.g.querySelector("#"+this.svgId+"-pentagon-"+"5");
        let c = b.getAttribute('points');
        a.setAttribute('points',c);
        a.setAttribute("style","fill:rgba(23,23,23,0.7);");
        this.g.appendChild(a);
        let d = document.createElementNS('http://www.w3.org/2000/svg',"text");
        d.setAttribute("y","20");
        d.style.fill="white";
        d.style.fontSize="25px";
        let e = document.createElementNS('http://www.w3.org/2000/svg',"tspan");
        e.textContent = "예전 강의평가"
        e.setAttribute("x","-37");
        d.appendChild(e);
        let f = document.createElementNS('http://www.w3.org/2000/svg',"tspan");
        f.textContent = "입니다"
        f.setAttribute("x","-3");
        f.setAttribute("dy","40");
        d.appendChild(f);
        this.g.appendChild(d);
        return this;
    }
    public empty = () => {
        let reset = this.svgPentagon.querySelector("#"+this.svgId+'-pentagonAbility');
        reset.setAttribute('points',"");
        let a = document.createElementNS('http://www.w3.org/2000/svg',"polygon");
        let b = this.g.querySelector("#"+this.svgId+"-pentagon-"+"5");
        let c = b.getAttribute('points');
        a.setAttribute('points',c);
        a.setAttribute("style","fill:rgba(23,23,23,0.7);");
        this.g.appendChild(a);
        let d = document.createElementNS('http://www.w3.org/2000/svg',"text");
        d.setAttribute("y","20");
        d.style.fill="white";
        d.style.fontSize="25px";
        let e = document.createElementNS('http://www.w3.org/2000/svg',"tspan");
        e.textContent = "아직 강의평이"
        e.setAttribute("x","-37");
        d.appendChild(e);
        let f = document.createElementNS('http://www.w3.org/2000/svg',"tspan");
        f.textContent = "없습니다"
        f.setAttribute("x","-15");
        f.setAttribute("dy","40");
        d.appendChild(f);
        this.g.appendChild(d);
        return this;
    }
}