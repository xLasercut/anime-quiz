import{d as m,a as T,u as f,B as p,F as D,m as N,c as O,w as t,x as a,U as k,f as r,H as C,i as g,b as A,aa as B,D as R,s as I,S as w,E as x,e as i,l as o,q as V}from"./index-VkmrqhLY.js";const U=m({__name:"SongStatsEditPanel",setup(v){const S=T(),c=f(),n=p(),u=g(V.OPEN_DIALOG),d=A();function l(){n.updateSongStatsInEdit({songId:"",playCount:0}),n.updateEditMode(B.NEW),u(R.SONG_STATS_EDIT,"New Song Stats")}function E(){c.updateSongStatsRecords({}),I.emit(w.UPDATE_STORE_SONG_STATS_RECORDS)}function _(){d.push(x.LOBBY)}return(G,e)=>(i(),D(C,null,[N(S).clientData.admin?(i(),O(a,{key:0,icon:"mdi-plus",color:"success",onClick:e[0]||(e[0]=s=>l())},{default:t(()=>[o("New Song Stats ")]),_:1})):k("",!0),r(a,{icon:"mdi-refresh",color:"info",onClick:e[1]||(e[1]=s=>E())},{default:t(()=>[o("Reload")]),_:1}),r(a,{icon:"mdi-backspace-reverse-outline",color:"warning",onClick:e[2]||(e[2]=s=>_())},{default:t(()=>[o("Back")]),_:1})],64))}});export{U as default};
