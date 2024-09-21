import{d as y,a as P,u as G,B as k,i as b,C as R,Y as U,L as g,r as B,Z as $,a7 as E,f as c,c as v,w as i,g as l,$ as M,a1 as V,m as x,p as o,a2 as S,a3 as h,a4 as f,a5 as j,a6 as _,a8 as I,D as A,s as w,S as H,V as Y}from"./index-CfBULS3w.js";import{_ as F}from"./TableAction.vue_vue_type_script_setup_true_lang-KkVr8t3S.js";const K=y({__name:"SongStatsEditTable",setup(C){const m=P(),u=G(),d=k(),T=b(R.OPEN_DIALOG),{currentPage:n,itemsPerPage:p}=U(g.SONG_STATS_EDIT_TABLE_ITEMS_PER_PAGE),a=B({anime:"",type:Object.values($),title:"",artist:""}),D=E(()=>{const s=[{title:"Anime",key:"animeName",sortable:!1},{title:"Title",key:"songTitle",sortable:!1},{title:"Artist",key:"artist",sortable:!1},{title:"Type",key:"type",sortable:!1},{title:"Play Count",key:"playCount",sortable:!0}];return m.clientData.admin&&s.push({title:"Action",key:"action",sortable:!1,width:f.TABLE_ACTION_WIDTH}),s}),N=E(()=>{const s=[];for(const t of u.songList)t.songId in u.songStatsRecords&&_(a.value.anime,t.animeName.join(","))&&_(a.value.title,t.songTitle)&&_(a.value.artist,t.artist)&&a.value.type.includes(t.type)&&s.push({...t,playCount:u.songStatsRecords[t.songId]});return s});function O(s){d.updateSongStatsInEdit({songId:s.songId,playCount:s.playCount}),d.updateEditMode(I.EDIT),T(A.SONG_STATS_EDIT,"Edit Song Stats")}function L(s){d.updateSongStatsInEdit({songId:s.songId,playCount:s.playCount}),d.updateEditMode(I.DELETE),T(A.SONG_STATS_EDIT,"Delete Song Stats")}return(s,t)=>(c(),v(j,{headers:D.value,items:N.value,page:o(n),"onUpdate:page":t[6]||(t[6]=e=>S(n)?n.value=e:null),"items-per-page":o(p),height:o(f).ADMIN_TABLE_HEIGHT,"fixed-header":!0,"fixed-footer":!0,density:"compact","no-filter":!0},{"item.animeName":i(({item:e})=>[l(M,{song:e},null,8,["song"])]),"item.action":i(({item:e})=>[l(F,{"onItem:edit":r=>O(e),"onItem:delete":r=>L(e)},null,8,["onItem:edit","onItem:delete"])]),top:i(()=>[l(x,{fluid:!0},{default:i(()=>[l(V,{anime:a.value.anime,"onUpdate:anime":t[0]||(t[0]=e=>a.value.anime=e),title:a.value.title,"onUpdate:title":t[1]||(t[1]=e=>a.value.title=e),artist:a.value.artist,"onUpdate:artist":t[2]||(t[2]=e=>a.value.artist=e),type:a.value.type,"onUpdate:type":t[3]||(t[3]=e=>a.value.type=e)},null,8,["anime","title","artist","type"])]),_:1})]),bottom:i(({pageCount:e})=>[l(h,{"current-page":o(n),"onUpdate:currentPage":t[4]||(t[4]=r=>S(n)?n.value=r:null),"items-per-page":o(p),"onUpdate:itemsPerPage":t[5]||(t[5]=r=>S(p)?p.value=r:null),length:e,"local-storage-key":o(g).SONG_STATS_EDIT_TABLE_ITEMS_PER_PAGE},null,8,["current-page","items-per-page","length","local-storage-key"])]),_:1},8,["headers","items","page","items-per-page","height"]))}}),q=y({__name:"SongStatsEdit",setup(C){return w.emit(H.UPDATE_STORE_SONG_STATS_RECORDS),(m,u)=>(c(),v(Y,{variant:"flat"},{default:i(()=>[l(K)]),_:1}))}});export{q as default};
