import{b0 as d,b1 as i,b2 as l,b3 as m}from"./index-CfBULS3w.js";const p=m('<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>');function v(a,s){const o=d(p);o.innerHTML=i,a.append(o);const e=document.createElement("span");e.classList.add("vds-google-cast-info"),a.append(e);const n=document.createElement("span");n.classList.add("vds-google-cast-device-name"),l(()=>{const{remotePlaybackInfo:c}=s,t=c();return t!=null&&t.deviceName&&(n.textContent=t.deviceName,e.append("Google Cast on ",n)),()=>{e.textContent=""}})}export{v as insertContent};
