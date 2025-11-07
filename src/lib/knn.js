import { l2 } from "./math";

export class KNN {
  constructor(k=5){ this.k=k; this.data=[]; }
  add(sample){ this.data.push(sample); }
  bulk(arr){ this.data.push(...arr); }
  clear(){ this.data=[]; }

  predict(feat){
    if (this.data.length===0) return {label:"", conf:0};
    const d = this.data.map(s=>({label:s.label, d:l2(feat,s.feat)})).sort((a,b)=>a.d-b.d);
    const k = Math.min(this.k,d.length);
    const votes = {};
    for (let i=0;i<k;i++){
      votes[d[i].label] = (votes[d[i].label]||0) + 1/(d[i].d+1e-6);
    }
    let best="",score=-1,sum=0;
    for (const v of Object.values(votes)) sum+=v;
    for (const [lab,val] of Object.entries(votes)) if (val>score){best=lab;score=val;}
    return { label: best, conf: sum?score/sum:0 };
  }
}
