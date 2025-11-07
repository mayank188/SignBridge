export function l2(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; }
  return Math.sqrt(s);
}

// min-max normalize x,y pairs to [-0.5,0.5]
export function normalizeKeypoints(vec) {
  if (!vec || vec.length === 0) return [];
  let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
  for (let i=0;i<vec.length;i+=2){
    minX=Math.min(minX,vec[i]);  maxX=Math.max(maxX,vec[i]);
    minY=Math.min(minY,vec[i+1]);maxY=Math.max(maxY,vec[i+1]);
  }
  const rx=Math.max(1e-6,maxX-minX), ry=Math.max(1e-6,maxY-minY);
  const out=new Array(vec.length);
  for (let i=0;i<vec.length;i+=2){
    out[i]   =(vec[i]-minX)/rx - 0.5;
    out[i+1] =(vec[i+1]-minY)/ry - 0.5;
  }
  return out;
}
