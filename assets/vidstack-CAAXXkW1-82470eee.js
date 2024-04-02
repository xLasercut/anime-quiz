import{R as g,I as p,B as u,S as m,d as C,_ as h,n as f}from"./index-ae4e1e10.js";function w(){return"https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"}function v(){var a;return!!((a=window.cast)!=null&&a.framework)}function E(){var a,e;return!!((e=(a=window.chrome)==null?void 0:a.cast)!=null&&e.isAvailable)}function l(){return s().getCastState()===cast.framework.CastState.CONNECTED}function s(){return window.cast.framework.CastContext.getInstance()}function d(){return s().getCurrentSession()}function y(){var a;return(a=d())==null?void 0:a.getSessionObj().media[0]}function P(a){var t;return((t=y())==null?void 0:t.media.contentId)===(a==null?void 0:a.src)}function S(){return{language:"en-US",autoJoinPolicy:chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,receiverApplicationId:chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,resumeSavedSession:!0,androidReceiverCompatible:!0}}function _(a){return`Google Cast Error Code: ${a}`}function A(a,e){return g(s(),a,e)}class I{constructor(){this.name="google-cast"}get cast(){return s()}mediaType(){return"video"}canPlay(e){return p&&!u&&m(e)}async prompt(e){var i;let t,o,r;try{t=await this.Pl(e),this.aa||(this.aa=new cast.framework.RemotePlayer,new cast.framework.RemotePlayerController(this.aa)),o=e.player.createEvent("google-cast-prompt-open",{trigger:t}),e.player.dispatchEvent(o),this.pm(e,"connecting",o),await this.Rl(C(e.$props.googleCast)),e.$state.remotePlaybackInfo.set({deviceName:(i=d())==null?void 0:i.getCastDevice().friendlyName}),l()&&this.pm(e,"connected",o)}catch(n){const c=n instanceof Error?n:this.Oo((n+"").toUpperCase(),"Prompt failed.");throw r=e.player.createEvent("google-cast-prompt-error",{detail:c,trigger:o??t,cancelable:!0}),e.player.dispatch(r),this.pm(e,l()?"connected":"disconnected",r),c}finally{e.player.dispatch("google-cast-prompt-close",{trigger:r??o??t})}}async load(e){if(!this.aa)throw Error("[vidstack] google cast player was not initialized");return new(await h(()=>import("./vidstack-google-cast-b27e0bb7.js"),["assets/vidstack-google-cast-b27e0bb7.js","assets/index-ae4e1e10.js","assets/index-c1c1c46e.css","assets/vidstack-Bo6FErSD-80bd93a1.js"])).GoogleCastProvider(this.aa,e)}async Pl(e){if(v())return;const t=e.player.createEvent("google-cast-load-start");e.player.dispatch(t),await f(w()),await customElements.whenDefined("google-cast-launcher");const o=e.player.createEvent("google-cast-loaded",{trigger:t});if(e.player.dispatch(o),!E())throw this.Oo("CAST_NOT_AVAILABLE","Google Cast not available on this platform.");return o}async Rl(e){this.Tl(e);const t=await this.cast.requestSession();if(t)throw this.Oo(t.toUpperCase(),_(t))}Tl(e){var t;(t=this.cast)==null||t.setOptions({...S(),...e})}pm(e,t,o){const r={type:"google-cast",state:t};e.delegate.c("remote-playback-change",r,o)}Oo(e,t){const o=Error(t);return o.code=e,o}}const k=Object.freeze(Object.defineProperty({__proto__:null,GoogleCastLoader:I},Symbol.toStringTag,{value:"Module"}));export{d as a,y as b,_ as c,s as g,P as h,A as l,k as v};
