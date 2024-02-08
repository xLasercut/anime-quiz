import{v as k,C as o,P as d,t as E,D as u,d as c,l as T,e as p,R as y,L as v}from"./index-c9f48ec7.js";import{R as C}from"./vidstack-XrFM82kz-43520f6f.js";import{g as A,a as S,b,h as g,l as L,c as w}from"./vidstack-gLplQLIT-eb6312be.js";class I{constructor(t){this.Ul=new chrome.cast.media.MediaInfo(t.src,t.type)}build(){return this.Ul}Xl(t){return t.includes("live")?this.Ul.streamType=chrome.cast.media.StreamType.LIVE:this.Ul.streamType=chrome.cast.media.StreamType.BUFFERED,this}Yl(t){return this.Ul.tracks=t.map(this.Il),this}Zl(t,e){return this.Ul.metadata=new chrome.cast.media.GenericMediaMetadata,this.Ul.metadata.title=t,this.Ul.metadata.images=[{url:e}],this}Il(t,e){const s=new chrome.cast.media.Track(e,chrome.cast.media.TrackType.TEXT);return s.name=t.label,s.trackContentId=t.src,s.trackContentType="text/vtt",s.language=t.language,s.subtype=t.kind.toUpperCase(),s}}const m=chrome.cast.media.TrackType.TEXT,f=chrome.cast.media.TrackType.AUDIO;class D{constructor(t,e,s){this.xm=t,this.b=e,this.zm=s}Hm(){const t=this.Km.bind(this);T(this.b.audioTracks,"change",t),T(this.b.textTracks,"mode-change",t),p(this.Lm.bind(this))}wm(){return this.b.$state.textTracks().filter(t=>t.src&&t.type==="vtt")}Cm(){return this.b.$state.audioTracks()}Wl(t){var s;const e=((s=this.xm.mediaInfo)==null?void 0:s.tracks)??[];return t?e.filter(a=>a.type===t):e}Dm(){const t=[],e=this.Cm().find(a=>a.selected),s=this.wm().filter(a=>a.mode==="showing");if(e){const a=this.Wl(f),r=this.ym(a,e);r&&t.push(r.trackId)}if(s!=null&&s.length){const a=this.Wl(m);if(a.length)for(const r of s){const i=this.ym(a,r);i&&t.push(i.trackId)}}return t}Lm(){const t=this.wm();if(!this.xm.isMediaLoaded)return;const e=this.Wl(m);for(const s of t)if(!this.ym(e,s)){y(()=>{var r;return(r=this.zm)==null?void 0:r.call(this)});break}}Mm(t){if(!this.xm.isMediaLoaded)return;const e=this.Cm(),s=this.wm(),a=this.Wl(f),r=this.Wl(m);for(const i of a){if(this.Em(e,i))continue;const n={id:i.trackId.toString(),label:i.name,language:i.language,kind:i.subtype??"main",selected:!1};this.b.audioTracks[v.oa](n,t)}for(const i of r){if(this.Em(s,i))continue;const n={id:i.trackId.toString(),src:i.trackContentId,label:i.name,language:i.language,kind:i.subtype.toLowerCase()};this.b.textTracks.add(n,t)}}Km(t){if(!this.xm.isMediaLoaded)return;const e=this.Dm(),s=new chrome.cast.media.EditTracksInfoRequest(e);this.Jm(s).catch(a=>{})}Jm(t){const e=b();return new Promise((s,a)=>e==null?void 0:e.editTracksInfo(t,s,a))}Em(t,e){return t.find(s=>this.Fm(s,e))}ym(t,e){return t.find(s=>this.Fm(e,s))}Fm(t,e){return e.name===t.label&&e.language===t.language&&e.subtype.toLowerCase()===t.kind.toLowerCase()}}class G{constructor(t,e){this.aa=t,this.b=e,this.$$PROVIDER_TYPE="GOOGLE_CAST",this.scope=k(),this.V=null,this.mc="disconnected",this.Va=0,this.Fa=0,this.Ga=new o(0,0),this.Hb=new o(0,0),this.Da=new C(this.bd.bind(this)),this.vm=null,this.Am=!1,this.yb=new D(this.aa,this.b,this.zm.bind(this))}get c(){return this.b.delegate.c}get type(){return"google-cast"}get currentSrc(){return this.V}get player(){return this.aa}get cast(){return A()}get session(){return S()}get media(){return b()}get hasActiveSession(){return g(this.V)}setup(){this.sm(),this.tm(),this.yb.Hm(),this.c("provider-setup",this)}sm(){L(cast.framework.CastContextEventType.CAST_STATE_CHANGED,this.qm.bind(this))}tm(){const t=cast.framework.RemotePlayerEventType,e={[t.IS_CONNECTED_CHANGED]:this.qm,[t.IS_MEDIA_LOADED_CHANGED]:this.Jl,[t.CAN_CONTROL_VOLUME_CHANGED]:this.em,[t.CAN_SEEK_CHANGED]:this.fm,[t.DURATION_CHANGED]:this.wg,[t.IS_MUTED_CHANGED]:this.ab,[t.VOLUME_LEVEL_CHANGED]:this.ab,[t.IS_PAUSED_CHANGED]:this.jm,[t.LIVE_SEEKABLE_RANGE_CHANGED]:this.ic,[t.PLAYER_STATE_CHANGED]:this.km};this.dm=e;const s=this.lm.bind(this);for(const a of d(e))this.aa.controller.addEventListener(a,s);E(()=>{for(const a of d(e))this.aa.controller.removeEventListener(a,s)})}async play(){var t;if(!(!this.aa.isPaused&&!this.Am)){if(this.Am){await this.Gm(!1,0);return}(t=this.aa.controller)==null||t.playOrPause()}}async pause(){var t;this.aa.isPaused||(t=this.aa.controller)==null||t.playOrPause()}getMediaStatus(t){return new Promise((e,s)=>{var a;(a=this.media)==null||a.getStatus(t,e,s)})}setMuted(t){var s;(t&&!this.aa.isMuted||!t&&this.aa.isMuted)&&((s=this.aa.controller)==null||s.muteOrUnmute())}setCurrentTime(t){var e;this.aa.currentTime=t,this.c("seeking",t),(e=this.aa.controller)==null||e.seek()}setVolume(t){var e;this.aa.volumeLevel=t,(e=this.aa.controller)==null||e.setVolumeLevel()}async loadSource(t){var a;if(((a=this.vm)==null?void 0:a.src)!==t&&(this.vm=null),g(t)){this.um(),this.V=t;return}this.c("load-start");const e=this.am(t),s=await this.session.loadMedia(e);if(s){this.V=null,this.c("error",Error(w(s)));return}this.V=t}destroy(){this.H(),this.rm()}H(){this.vm||(this.Fa=0,this.Ga=new o(0,0),this.Hb=new o(0,0)),this.Da.ra(),this.Va=0,this.vm=null}um(){var i,h;const t=new u("resume-session",{detail:this.session});this.Jl(t);const{muted:e,volume:s,remotePlaybackInfo:a}=this.b.$state,r=a();this.setCurrentTime(Math.max(this.aa.currentTime,((i=r==null?void 0:r.savedState)==null?void 0:i.currentTime)??0)),this.setMuted(e()),this.setVolume(s()),((h=r==null?void 0:r.savedState)==null?void 0:h.paused)===!1&&this.play()}rm(){this.cast.endCurrentSession(!0);const{remotePlaybackLoader:t}=this.b.$state;t.set(null)}Ml(){this.b.$state.remotePlaybackInfo.set({savedState:{paused:this.aa.isPaused,currentTime:this.aa.currentTime}}),this.rm()}bd(){this.im()}lm(t){this.dm[t.type].call(this,t)}qm(t){const e=this.cast.getCastState(),s=e===cast.framework.CastState.CONNECTED?"connected":e===cast.framework.CastState.CONNECTING?"connecting":"disconnected";if(this.mc===s)return;const a={type:"google-cast",state:s},r=this.Vl(t);this.mc=s,this.c("remote-playback-change",a,r),s==="disconnected"&&this.Ml()}Jl(t){if(!!!this.aa.isMediaLoaded)return;const s=c(this.b.$state.source);Promise.resolve().then(()=>{if(s!==c(this.b.$state.source)||!this.aa.isMediaLoaded)return;this.H();const a=this.aa.duration;this.Hb=new o(0,a);const r={provider:this,duration:a,buffered:this.Ga,seekable:this.gm()},i=this.Vl(t);this.c("loaded-metadata",void 0,i),this.c("loaded-data",void 0,i),this.c("can-play",r,i),this.em(),this.fm(t);const{volume:h,muted:n}=this.b.$state;this.setVolume(h()),this.setMuted(n()),this.Da.Bb(),this.yb.Mm(i),this.yb.Km(i)})}em(){this.b.$state.canSetVolume.set(this.aa.canControlVolume)}fm(t){const e=this.Vl(t);this.c("stream-type-change",this.mm(),e)}mm(){var e;return((e=this.aa.mediaInfo)==null?void 0:e.streamType)===chrome.cast.media.StreamType.LIVE?this.aa.canSeek?"live:dvr":"live":"on-demand"}im(){if(this.vm)return;const t=this.aa.currentTime;if(t===this.Va)return;const e=this.Fa,s=this.cm(t),a={currentTime:t,played:s};this.c("time-update",a),t>e&&this.ic(),this.b.$state.seeking()&&this.c("seeked",t),this.Va=t}cm(t){return this.Fa>=t?this.Ga:this.Ga=new o(0,this.Fa=t)}wg(t){if(!this.aa.isMediaLoaded||this.vm)return;const e=this.aa.duration,s=this.Vl(t);this.Hb=new o(0,e),this.c("duration-change",e,s)}ab(t){if(!this.aa.isMediaLoaded)return;const e={muted:this.aa.isMuted,volume:this.aa.volumeLevel},s=this.Vl(t);this.c("volume-change",e,s)}jm(t){const e=this.Vl(t);this.aa.isPaused?this.c("pause",void 0,e):this.c("play",void 0,e)}ic(t){const e={seekable:this.gm(),buffered:this.Ga},s=t?this.Vl(t):void 0;this.c("progress",e,s)}km(t){const e=this.aa.playerState,s=chrome.cast.media.PlayerState;if(this.Am=e===s.IDLE,e===s.PAUSED)return;const a=this.Vl(t);switch(e){case s.PLAYING:this.c("playing",void 0,a);break;case s.BUFFERING:this.c("waiting",void 0,a);break;case s.IDLE:this.Da.ra(),this.c("pause"),this.c("end");break}}gm(){return this.aa.liveSeekableRange?new o(this.aa.liveSeekableRange.start,this.aa.liveSeekableRange.end):this.Hb}Vl(t){return t instanceof Event?t:new u(t.type,{detail:t})}Dl(t){const{streamType:e,title:s,poster:a}=this.b.$state;return new I(t).Zl(s(),a()).Xl(e()).Yl(this.yb.wm()).build()}am(t){var r,i,h,n;const e=this.Dl(t),s=new chrome.cast.media.LoadRequest(e),a=this.b.$state.remotePlaybackInfo();return s.autoplay=(((r=this.vm)==null?void 0:r.paused)??((i=a==null?void 0:a.savedState)==null?void 0:i.paused))===!1,s.currentTime=((h=this.vm)==null?void 0:h.time)??((n=a==null?void 0:a.savedState)==null?void 0:n.currentTime)??0,s}async Gm(t,e){const s=c(this.b.$state.source);this.vm={src:s,paused:t,time:e},await this.loadSource(s)}zm(){this.Gm(this.aa.isPaused,this.aa.currentTime).catch(t=>{})}}export{G as GoogleCastProvider};
