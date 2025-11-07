export function downloadJSON(filename, data){
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
}

export function loadJSONFile(file){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>res(JSON.parse(String(r.result)));
    r.onerror=rej;
    r.readAsText(file);
  });
}
