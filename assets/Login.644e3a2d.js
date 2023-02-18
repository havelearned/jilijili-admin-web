import{n as B,r as S,av as q,aw as A,ax as P,ay as Q,o as R,h as i,s as M,g as T,az as j,J as k,S as N,aA as z,aB as U,aC as D,_ as L,aD as O,u as G,aE as H,aF as J,j as K,k as Y,d as p,aq as E,aG as W,ap as F,aH as X,m as I,aj as Z,at as $,au as ee}from"./index.fc5ab6e9.js";var te=B({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validationSuccess","validationError"],setup(o,{slots:a,emit:d}){const s=T(),l=S(null);let u=0;const t=[];function x(e){const f=typeof e=="boolean"?e:o.noErrorFocus!==!0,b=++u,w=(n,r)=>{d("validation"+(n===!0?"Success":"Error"),r)},_=n=>{const r=n.validate();return typeof r.then=="function"?r.then(c=>({valid:c,comp:n}),c=>({valid:!1,comp:n,err:c})):Promise.resolve({valid:r,comp:n})};return(o.greedy===!0?Promise.all(t.map(_)).then(n=>n.filter(r=>r.valid!==!0)):t.reduce((n,r)=>n.then(()=>_(r).then(c=>{if(c.valid===!1)return Promise.reject(c)})),Promise.resolve()).catch(n=>[n])).then(n=>{if(n===void 0||n.length===0)return b===u&&w(!0),!0;if(b===u){const{comp:r,err:c}=n[0];if(c!==void 0&&console.error(c),w(!1,r),f===!0){const C=n.find(({comp:V})=>typeof V.focus=="function"&&j(V.$)===!1);C!==void 0&&C.comp.focus()}}return!1})}function v(){u++,t.forEach(e=>{typeof e.resetValidation=="function"&&e.resetValidation()})}function g(e){e!==void 0&&k(e);const f=u+1;x().then(b=>{f===u&&b===!0&&(o.onSubmit!==void 0?d("submit",e):e!==void 0&&e.target!==void 0&&typeof e.target.submit=="function"&&e.target.submit())})}function y(e){e!==void 0&&k(e),d("reset"),N(()=>{v(),o.autofocus===!0&&o.noResetFocus!==!0&&m()})}function m(){z(()=>{if(l.value===null)return;const e=l.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||l.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||l.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(l.value.querySelectorAll("[tabindex]"),f=>f.tabIndex>-1);e!=null&&e.focus({preventScroll:!0})})}q(A,{bindComponent(e){t.push(e)},unbindComponent(e){const f=t.indexOf(e);f>-1&&t.splice(f,1)}});let h=!1;return P(()=>{h=!0}),Q(()=>{h===!0&&o.autofocus===!0&&m()}),R(()=>{o.autofocus===!0&&m()}),Object.assign(s.proxy,{validate:x,resetValidation:v,submit:g,reset:y,focus:m,getValidationComponents:()=>t}),()=>i("form",{class:"q-form",ref:l,onSubmit:g,onReset:y},M(a.default))}});const oe=[i("g",{transform:"translate(20 50)"},[i("rect",{x:"-10",y:"-30",width:" 20",height:"60",fill:"currentColor",opacity:"0.6"},[i("animateTransform",{attributeName:"transform",type:"scale",from:"2",to:"1",begin:"0s",repeatCount:"indefinite",dur:"1s",calcMode:"spline",keySplines:"0.1 0.9 0.4 1",keyTimes:"0;1",values:"2;1"})])]),i("g",{transform:"translate(50 50)"},[i("rect",{x:"-10",y:"-30",width:" 20",height:"60",fill:"currentColor",opacity:"0.8"},[i("animateTransform",{attributeName:"transform",type:"scale",from:"2",to:"1",begin:"0.1s",repeatCount:"indefinite",dur:"1s",calcMode:"spline",keySplines:"0.1 0.9 0.4 1",keyTimes:"0;1",values:"2;1"})])]),i("g",{transform:"translate(80 50)"},[i("rect",{x:"-10",y:"-30",width:" 20",height:"60",fill:"currentColor",opacity:"0.9"},[i("animateTransform",{attributeName:"transform",type:"scale",from:"2",to:"1",begin:"0.2s",repeatCount:"indefinite",dur:"1s",calcMode:"spline",keySplines:"0.1 0.9 0.4 1",keyTimes:"0;1",values:"2;1"})])])];var ae=B({name:"QSpinnerFacebook",props:U,setup(o){const{cSize:a,classes:d}=D(o);return()=>i("svg",{class:d.value,width:a.value,height:a.value,viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"xMidYMid"},oe)}});const ne={name:"Login",setup(){const o=O(),a=G(),d=S(""),s=S(""),l=S(!1),u=H(),t=J();return{username:d,password:s,accept:l,onsubmit:(v,g)=>{o.loading.show({spinner:ae,spinnerColor:"blue",spinnerSize:140,backgroundColor:"gray",message:"\u6B63\u5728\u767B\u5F55",messageColor:"black"}),a.dispatch("login",{username:v,password:g}).then(()=>{a.dispatch("fetchCurrentUser").then(y=>{let m=y.roles.find(h=>h.name==="ROLE_SUPER_ADMIN");o.loading.hide(),m?u.push({path:t.query.redirect||"/"}):(a.dispatch("logout"),o.notify({position:"top",message:"\u4F60\u7684\u6743\u9650\u65E0\u6CD5\u8BBF\u95EE\u540E\u53F0",icon:"announcement",color:"negative"}))})})}}}},se=o=>($("data-v-c7c31e60"),o=o(),ee(),o),re={class:"login-page"},ie=se(()=>I("div",{class:"title"},"jilijiliMusic",-1));function le(o,a,d,s,l,u){return K(),Y("div",re,[p(W,{class:"my-card login-form-content"},{default:E(()=>[ie,p(te,{class:"q-gutter-md form",onSubmit:a[3]||(a[3]=t=>s.onsubmit(s.username,s.password))},{default:E(()=>[p(F,{filled:"",modelValue:s.username,"onUpdate:modelValue":a[0]||(a[0]=t=>s.username=t),label:"\u8D26\u53F7",hint:"input access","lazy-rules":"",rules:[t=>t&&t.length>0||"\u8D26\u53F7\u4E0D\u6B63\u786E"]},null,8,["modelValue","rules"]),p(F,{filled:"",modelValue:s.password,"onUpdate:modelValue":a[1]||(a[1]=t=>s.password=t),label:"\u5BC6\u7801",hint:"input password","lazy-rules":"",type:"password",rules:[t=>t&&t.length>0||"\u5BC6\u7801\u4E0D\u6B63\u786E"]},null,8,["modelValue","rules"]),p(X,{modelValue:s.accept,"onUpdate:modelValue":a[2]||(a[2]=t=>s.accept=t),label:"\u8BB0\u4F4F\u6211"},null,8,["modelValue"]),I("div",null,[p(Z,{class:"full-width",label:"\u767B\u5F55",type:"submit",color:"primary"})])]),_:1})]),_:1})])}var de=L(ne,[["render",le],["__scopeId","data-v-c7c31e60"]]);export{de as default};
