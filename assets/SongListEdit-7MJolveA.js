import{af as G,ag as B,ah as w,ai as F,aj as j,ak as H,al as q,am as K,a9 as M,an as Q,ao as W,ap as C,X as P,f as u,aq as D,d as O,e as A,c as h,w as r,p as X,ar as Y,h as L,_ as z,m as f,as as i,l as J,g as Z,u as ee,a6 as U,$ as te,L as R,r as S,a0 as ae,Q as le,a1 as se,a3 as oe,k as ue,a4 as I,a5 as ne,a7 as ie,a8 as E,S as $,s as re,V as de}from"./index-VkmrqhLY.js";import{_ as me}from"./TableSrc.vue_vue_type_script_setup_true_lang-C4zU_UST.js";const ce=G({...B(),...w(F(),["inline"])},"VCheckbox"),ve=j()({name:"VCheckbox",inheritAttrs:!1,props:ce(),emits:{"update:modelValue":s=>!0,"update:focused":s=>!0},setup(s,c){let{attrs:p,slots:o}=c;const n=H(s,"modelValue"),{isFocused:m,focus:a,blur:d}=q(s),g=K(),k=M(()=>s.id||`checkbox-${g}`);return Q(()=>{const[T,y]=W(p),N=C.filterProps(s),_=P.filterProps(s);return u(C,D({class:["v-checkbox",s.class]},T,N,{modelValue:n.value,"onUpdate:modelValue":V=>n.value=V,id:k.value,focused:m.value,style:s.style}),{...o,default:V=>{let{id:x,messagesId:l,isDisabled:e,isReadonly:t,isValid:b}=V;return u(P,D(_,{id:x.value,"aria-describedby":l.value,disabled:e.value,readonly:t.value},y,{error:b.value===!1,modelValue:n.value,"onUpdate:modelValue":v=>n.value=v,onFocus:a,onBlur:d}),o)}})}),{}}}),fe={style:{width:"200px"}},pe=O({__name:"SongListEditTableActions",props:{disabled:{type:Boolean,default:()=>!1},modelValue:{type:String,required:!0}},setup(s){const c=[{text:"Add Songs",value:i.ADD},{text:"Remove Songs",value:i.REMOVE},{text:"None",value:i.NONE}];return(p,o)=>(A(),h(Z,{dense:!0,justify:"space-between"},{default:r(()=>[u(L,{cols:"auto"},{default:r(()=>[X("div",fe,[u(Y,{label:"Operation Type",density:"compact","hide-details":!0,variant:"outlined",disabled:s.disabled,items:c,"model-value":s.modelValue,"onUpdate:modelValue":o[0]||(o[0]=n=>p.$emit("update:model-value",n)),"item-value":"value","item-title":"text"},null,8,["disabled","model-value"])])]),_:1}),u(L,{cols:"auto"},{default:r(()=>[u(z,{disabled:s.modelValue===f(i).NONE||s.disabled,color:"success",icon:"mdi-check",onClick:o[1]||(o[1]=n=>p.$emit("submit:change"))},{default:r(()=>[J(" Confirm ")]),_:1},8,["disabled"])]),_:1})]),_:1}))}}),be=O({__name:"SongListEditTable",setup(s){const c=ee(),p=[{title:"Anime",key:"animeName",sortable:!1},{title:"Title",key:"songTitle",sortable:!1},{title:"Artist",key:"artist",sortable:!1},{title:"Type",key:"type",sortable:!1},{title:"Source",key:"src",sortable:!1,width:U.TABLE_ACTION_WIDTH}],{currentPage:o,itemsPerPage:n}=te(R.SONG_LIST_EDIT_TABLE_ITEMS_PER_PAGE),m=S([]),a=S({anime:"",type:Object.values(ae),title:"",artist:""}),d=S(i.NONE),g=S(!1);le(()=>d.value,()=>{m.value=[]});const k=M(()=>c.songList.filter(l=>d.value===i.REMOVE?c.userSongList.includes(l.songId)&&E(a.value.anime,l.animeName.join(","))&&E(a.value.title,l.songTitle)&&E(a.value.artist,l.artist)&&a.value.type.includes(l.type):E(a.value.anime,l.animeName.join(","))&&E(a.value.title,l.songTitle)&&E(a.value.artist,l.artist)&&a.value.type.includes(l.type)));function T(l){return l?"mdi-checkbox-blank-off-outline":"mdi-checkbox-blank-outline"}function y(){return d.value===i.REMOVE?"mdi-minus-box":"mdi-checkbox-marked"}function N(){return d.value===i.REMOVE?"error":"success"}function _(l,e){return g.value||m.value.length>=50&&!e?!0:d.value===i.ADD&&c.userSongList.includes(l)}const V={[i.ADD]:$.ADD_USER_SONGS,[i.REMOVE]:$.REMOVE_USER_SONGS};function x(){if(m.value.length>0){g.value=!0;const l=V[d.value];re.emit(l,m.value,e=>{g.value=!1,e&&(m.value=[])})}}return(l,e)=>(A(),h(ie,{height:f(U).SONG_LIST_EDIT_TABLE_HEIGHT,page:f(o),"onUpdate:page":e[8]||(e[8]=t=>I(o)?o.value=t:null),"items-per-page":f(n),density:"compact",items:k.value,headers:p,"fixed-header":!0,"fixed-footer":!0,"show-select":d.value!==f(i).NONE,modelValue:m.value,"onUpdate:modelValue":e[9]||(e[9]=t=>m.value=t),"item-value":"songId","no-filter":!0},{"header.data-table-select":r(()=>[]),"item.data-table-select":r(({isSelected:t,toggleSelect:b,item:v})=>[u(ve,{"model-value":t({value:v.songId,selectable:!0}),"onUpdate:modelValue":ge=>b({value:v.songId,selectable:!0}),density:"compact","hide-details":"","true-icon":y(),color:N(),disabled:_(v.songId,t({value:v.songId,selectable:!0})),"false-icon":T(_(v.songId,t({value:v.songId,selectable:!0})))},null,8,["model-value","onUpdate:modelValue","true-icon","color","disabled","false-icon"])]),"item.animeName":r(({item:t})=>[u(se,{song:t},null,8,["song"])]),"item.src":r(({item:t})=>[u(me,{song:t},null,8,["song"])]),top:r(()=>[u(ue,{fluid:!0},{default:r(()=>[u(oe,{anime:a.value.anime,"onUpdate:anime":e[0]||(e[0]=t=>a.value.anime=t),title:a.value.title,"onUpdate:title":e[1]||(e[1]=t=>a.value.title=t),artist:a.value.artist,"onUpdate:artist":e[2]||(e[2]=t=>a.value.artist=t),type:a.value.type,"onUpdate:type":e[3]||(e[3]=t=>a.value.type=t)},null,8,["anime","title","artist","type"]),u(pe,{disabled:g.value,modelValue:d.value,"onUpdate:modelValue":e[4]||(e[4]=t=>d.value=t),"onSubmit:change":e[5]||(e[5]=t=>x())},null,8,["disabled","modelValue"])]),_:1})]),bottom:r(({pageCount:t})=>[u(ne,{"current-page":f(o),"onUpdate:currentPage":e[6]||(e[6]=b=>I(o)?o.value=b:null),"items-per-page":f(n),"onUpdate:itemsPerPage":e[7]||(e[7]=b=>I(n)?n.value=b:null),length:t,"local-storage-key":f(R).SONG_LIST_EDIT_TABLE_ITEMS_PER_PAGE},null,8,["current-page","items-per-page","length","local-storage-key"])]),_:1},8,["height","page","items-per-page","items","show-select","modelValue"]))}}),_e=O({__name:"SongListEdit",setup(s){return(c,p)=>(A(),h(de,{variant:"flat"},{default:r(()=>[u(be)]),_:1}))}});export{_e as default};
