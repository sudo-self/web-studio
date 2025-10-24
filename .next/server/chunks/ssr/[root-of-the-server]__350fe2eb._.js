module.exports=[32679,(a,b,c)=>{},26196,(a,b,c)=>{a.r(32679);var d=a.r(83572),e=function(a){return a&&"object"==typeof a&&"default"in a?a:{default:a}}(d),f="undefined"!=typeof process&&process.env&&!0,g=function(a){return"[object String]"===Object.prototype.toString.call(a)},h=function(){function a(a){var b=void 0===a?{}:a,c=b.name,d=void 0===c?"stylesheet":c,e=b.optimizeForSpeed,h=void 0===e?f:e;i(g(d),"`name` must be a string"),this._name=d,this._deletedRulePlaceholder="#"+d+"-deleted-rule____{}",i("boolean"==typeof h,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=h,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0,this._nonce=null}var b,c=a.prototype;return c.setOptimizeForSpeed=function(a){i("boolean"==typeof a,"`setOptimizeForSpeed` accepts a boolean"),i(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=a,this.inject()},c.isOptimizeForSpeed=function(){return this._optimizeForSpeed},c.inject=function(){var a=this;i(!this._injected,"sheet already injected"),this._injected=!0,this._serverSheet={cssRules:[],insertRule:function(b,c){return"number"==typeof c?a._serverSheet.cssRules[c]={cssText:b}:a._serverSheet.cssRules.push({cssText:b}),c},deleteRule:function(b){a._serverSheet.cssRules[b]=null}}},c.getSheetForTag=function(a){if(a.sheet)return a.sheet;for(var b=0;b<document.styleSheets.length;b++)if(document.styleSheets[b].ownerNode===a)return document.styleSheets[b]},c.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},c.insertRule=function(a,b){return i(g(a),"`insertRule` accepts only strings"),"number"!=typeof b&&(b=this._serverSheet.cssRules.length),this._serverSheet.insertRule(a,b),this._rulesCount++},c.replaceRule=function(a,b){this._optimizeForSpeed;var c=this._serverSheet;if(b.trim()||(b=this._deletedRulePlaceholder),!c.cssRules[a])return a;c.deleteRule(a);try{c.insertRule(b,a)}catch(d){f||console.warn("StyleSheet: illegal rule: \n\n"+b+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),c.insertRule(this._deletedRulePlaceholder,a)}return a},c.deleteRule=function(a){this._serverSheet.deleteRule(a)},c.flush=function(){this._injected=!1,this._rulesCount=0,this._serverSheet.cssRules=[]},c.cssRules=function(){return this._serverSheet.cssRules},c.makeStyleTag=function(a,b,c){b&&i(g(b),"makeStyleTag accepts only strings as second parameter");var d=document.createElement("style");this._nonce&&d.setAttribute("nonce",this._nonce),d.type="text/css",d.setAttribute("data-"+a,""),b&&d.appendChild(document.createTextNode(b));var e=document.head||document.getElementsByTagName("head")[0];return c?e.insertBefore(d,c):e.appendChild(d),d},b=[{key:"length",get:function(){return this._rulesCount}}],function(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}(a.prototype,b),a}();function i(a,b){if(!a)throw Error("StyleSheet: "+b+".")}var j=function(a){for(var b=5381,c=a.length;c;)b=33*b^a.charCodeAt(--c);return b>>>0},k={};function l(a,b){if(!b)return"jsx-"+a;var c=String(b),d=a+c;return k[d]||(k[d]="jsx-"+j(a+"-"+c)),k[d]}function m(a,b){var c=a+(b=b.replace(/\/style/gi,"\\/style"));return k[c]||(k[c]=b.replace(/__jsx-style-dynamic-selector/g,a)),k[c]}var n=function(){function a(a){var b=void 0===a?{}:a,c=b.styleSheet,d=void 0===c?null:c,e=b.optimizeForSpeed,f=void 0!==e&&e;this._sheet=d||new h({name:"styled-jsx",optimizeForSpeed:f}),this._sheet.inject(),d&&"boolean"==typeof f&&(this._sheet.setOptimizeForSpeed(f),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var b=a.prototype;return b.add=function(a){var b=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(a.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed());var c=this.getIdAndRules(a),d=c.styleId,e=c.rules;if(d in this._instancesCounts){this._instancesCounts[d]+=1;return}var f=e.map(function(a){return b._sheet.insertRule(a)}).filter(function(a){return -1!==a});this._indices[d]=f,this._instancesCounts[d]=1},b.remove=function(a){var b=this,c=this.getIdAndRules(a).styleId;if(function(a,b){if(!a)throw Error("StyleSheetRegistry: "+b+".")}(c in this._instancesCounts,"styleId: `"+c+"` not found"),this._instancesCounts[c]-=1,this._instancesCounts[c]<1){var d=this._fromServer&&this._fromServer[c];d?(d.parentNode.removeChild(d),delete this._fromServer[c]):(this._indices[c].forEach(function(a){return b._sheet.deleteRule(a)}),delete this._indices[c]),delete this._instancesCounts[c]}},b.update=function(a,b){this.add(b),this.remove(a)},b.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},b.cssRules=function(){var a=this,b=this._fromServer?Object.keys(this._fromServer).map(function(b){return[b,a._fromServer[b]]}):[],c=this._sheet.cssRules();return b.concat(Object.keys(this._indices).map(function(b){return[b,a._indices[b].map(function(a){return c[a].cssText}).join(a._optimizeForSpeed?"":"\n")]}).filter(function(a){return!!a[1]}))},b.styles=function(a){var b,c;return b=this.cssRules(),void 0===(c=a)&&(c={}),b.map(function(a){var b=a[0],d=a[1];return e.default.createElement("style",{id:"__"+b,key:"__"+b,nonce:c.nonce?c.nonce:void 0,dangerouslySetInnerHTML:{__html:d}})})},b.getIdAndRules=function(a){var b=a.children,c=a.dynamic,d=a.id;if(c){var e=l(d,c);return{styleId:e,rules:Array.isArray(b)?b.map(function(a){return m(e,a)}):[m(e,b)]}}return{styleId:l(d),rules:Array.isArray(b)?b:[b]}},b.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(a,b){return a[b.id.slice(2)]=b,a},{})},a}(),o=d.createContext(null);function p(){return new n}function q(){return d.useContext(o)}o.displayName="StyleSheetContext",e.default.useInsertionEffect||e.default.useLayoutEffect;var r=void 0;function s(a){var b=r||q();return b&&b.add(a),null}s.dynamic=function(a){return a.map(function(a){return l(a[0],a[1])}).join(" ")},c.StyleRegistry=function(a){var b=a.registry,c=a.children,f=d.useContext(o),g=d.useState(function(){return f||b||p()})[0];return e.default.createElement(o.Provider,{value:g},c)},c.createStyleRegistry=p,c.style=s,c.useStyleRegistry=q},56583,(a,b,c)=>{b.exports=a.r(26196).style},47118,a=>{"use strict";a.s(["default",()=>g],47118);var b=a.i(83572);let c=a=>{let b=a.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,b,c)=>c?c.toUpperCase():b.toLowerCase());return b.charAt(0).toUpperCase()+b.slice(1)},d=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim();var e={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let f=(0,b.forwardRef)(({color:a="currentColor",size:c=24,strokeWidth:f=2,absoluteStrokeWidth:g,className:h="",children:i,iconNode:j,...k},l)=>(0,b.createElement)("svg",{ref:l,...e,width:c,height:c,stroke:a,strokeWidth:g?24*Number(f)/Number(c):f,className:d("lucide",h),...!i&&!(a=>{for(let b in a)if(b.startsWith("aria-")||"role"===b||"title"===b)return!0})(k)&&{"aria-hidden":"true"},...k},[...j.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(i)?i:[i]])),g=(a,e)=>{let g=(0,b.forwardRef)(({className:g,...h},i)=>(0,b.createElement)(f,{ref:i,iconNode:e,className:d(`lucide-${c(a).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${a}`,g),...h}));return g.displayName=c(a),g}},87464,a=>{"use strict";a.s(["X",()=>b],87464);let b=(0,a.i(47118).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},68299,a=>{"use strict";a.s(["default",()=>R],68299);var b=a.i(413),c=a.i(83572),d=a.i(47118);let e=(0,d.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),f=(0,d.default)("lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]),g={"Layout & Structure":["Create a responsive hero section with a call-to-action button","Build a modern navigation bar with dropdown menus","Design a footer with social media links and contact information","Create a multi-column card layout for services","Build a sidebar navigation for admin dashboards","Design a full-screen landing page with smooth scrolling","Create a grid-based portfolio layout","Build a split-screen layout for comparison pages","Design a sticky header that changes on scroll","Create a masonry grid layout for image galleries"],"UI Components":["Create a modern button with hover effects","Build a responsive card component with image and text","Design a modal dialog with overlay","Create a progress bar with animated filling","Build a toggle switch component","Design a breadcrumb navigation","Create a pagination component","Build a tooltip that appears on hover","Design a loading spinner animation","Create a notification toast component"],"Forms & Inputs":["Create a contact form with validation","Build a login/signup form with social buttons","Design a search bar with autocomplete","Create a multi-step form wizard","Build a file upload component with drag-and-drop","Design a date picker with calendar","Create a range slider for price filtering","Build a color picker component","Design a rating stars component","Create a tags input field"],"Data Display":["Create a data table with sorting and filtering","Build a chart/graph component for analytics","Design a timeline for events or history","Create a statistics dashboard with metrics","Build a comparison table for pricing plans","Design a user profile card with avatar","Create a comment section with nested replies","Build a product catalog with filters","Design a weather widget","Create a countdown timer"],"Interactive Elements":["Create an image carousel/slider","Build an accordion FAQ section","Design a tabbed interface","Create a drag-and-drop sortable list","Build a zoomable image gallery","Design a video player with controls","Create a map integration with markers","Build a drawing canvas","Design a quiz/interactive assessment","Create a real-time chat interface"],"E-commerce":["Create a product card with add-to-cart","Build a shopping cart sidebar","Design a product quick view modal","Create a wishlist/heart button","Build a product filter sidebar","Design a checkout process form","Create a order tracking component","Build a product review section","Design a size/color selector","Create a related products carousel"],"Blog & Content":["Create a blog post card layout","Build a featured posts slider","Design a newsletter signup section","Create a author bio component","Build a related articles section","Design a table of contents sidebar","Create a code syntax highlighter","Build a social sharing buttons","Design a comment form with preview","Create a reading progress indicator"]};function h({onPromptSelect:a}){let[d,h]=(0,c.useState)(!1),[i,j]=(0,c.useState)("down"),k=(0,c.useRef)(null),l=(0,c.useRef)(null);return(0,c.useEffect)(()=>{let a=()=>{if(l.current){let a=l.current.getBoundingClientRect();window.innerHeight,a.bottom,a.top>window.innerHeight/2?j("up"):j("down")}};if(d)return a(),window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[d]),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsxs)("button",{ref:l,onClick:()=>h(!d),className:"btn btn-outline btn-sm flex items-center gap-2",children:[(0,b.jsx)(f,{size:14}),"Prompts",(0,b.jsx)(e,{size:14,className:`transition-transform ${d?"rotate-180":""}`})]}),d&&(0,b.jsxs)("div",{ref:k,className:`absolute left-0 w-96 bg-black border border-border-primary rounded-lg shadow-lg z-50 flex flex-col max-h-[80vh] ${"down"===i?"top-full mt-2":"bottom-full mb-2"}`,children:[(0,b.jsx)("div",{className:"p-4 flex-shrink-0 border-b border-border-primary",children:(0,b.jsxs)("h4",{className:"text-sm font-semibold text-text-primary mb-3 flex items-center gap-2",children:[(0,b.jsx)(f,{size:16}),"AI Builder Prompts"]})}),(0,b.jsx)("div",{className:"overflow-y-auto flex-1 p-4 space-y-4",children:Object.entries(g).map(([c,d])=>(0,b.jsxs)("div",{children:[(0,b.jsx)("h5",{className:"text-xs font-medium text-text-secondary uppercase tracking-wide mb-2",children:c}),(0,b.jsx)("div",{className:"space-y-1",children:d.map((c,d)=>(0,b.jsx)("button",{onClick:()=>{a(c),h(!1)},className:"w-full text-left p-2 text-sm text-text-primary hover:bg-surface-secondary rounded transition-colors",children:c},d))})]},c))})]})]})}let i=(0,d.default)("github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);var j=a.i(87464);let k=(0,d.default)("file-text",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]),l=({onAuthSuccess:a})=>(0,b.jsxs)("button",{onClick:()=>{let a=process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;if(!a)return void console.error("GitHub Client ID not found");let b=`${window.location.origin}/auth/github/callback`,c=Math.random().toString(36).substring(2),d=`https://github.com/login/oauth/authorize?client_id=${a}&redirect_uri=${encodeURIComponent(b)}&scope=${encodeURIComponent("repo public_repo workflow")}&state=${c}`;window.location.href=d},className:"btn btn-primary flex items-center justify-center gap-2",children:[(0,b.jsx)(i,{size:16}),"Connect GitHub Account"]}),m=({showGithubModal:a,setShowGithubModal:d,githubToken:e,setGithubToken:f,githubUser:g,setGithubUser:h,githubForm:k,setGithubForm:l,isCreatingRepo:m,handleCreateRepo:p,fetchUserInfo:q})=>{let[r,s]=(0,c.useState)(null),t=async()=>{if(e)try{await p(),s({html_url:`https://github.com/${g?.login}/${k.name}`,pages_url:k.deployPages?`https://${g?.login}.github.io/${k.name}/`:void 0})}catch(a){console.error(a)}};return a&&(0,b.jsx)("div",{className:"modal-overlay",onClick:()=>!m&&d(!1),children:(0,b.jsxs)("div",{className:"modal-content",onClick:a=>a.stopPropagation(),role:"dialog","aria-labelledby":"github-modal-title","aria-modal":"true",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-8",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 bg-accent-color bg-opacity-10 rounded-lg","aria-hidden":"true",children:(0,b.jsx)(i,{size:20,className:"text-accent-color"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{id:"github-modal-title",className:"text-lg font-semibold text-text-primary",children:"Create a GitHub Repository"}),(0,b.jsx)("p",{className:"text-xs text-text-muted mt-1",children:"Deploy your Website with GitHub Pages"})]})]}),(0,b.jsx)("button",{onClick:()=>d(!1),className:"btn btn-primary btn-sm btn-icon hover:bg-component-hover transition-colors",disabled:m,"aria-label":"Close modal",children:(0,b.jsx)(j.X,{size:16})})]}),e?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(o,{githubUser:g,githubForm:k,setGithubForm:l,isCreatingRepo:m,onDisconnect:()=>{localStorage.removeItem("github_access_token"),f(null),h(null)},onCreateRepo:t,onCancel:()=>d(!1)}),r&&(0,b.jsxs)("div",{className:"mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm space-y-1",children:[(0,b.jsxs)("p",{children:["Repository created successfully! ",(0,b.jsx)("br",{}),"URL: ",(0,b.jsx)("a",{href:r.html_url,target:"_blank",className:"text-blue-600 underline",children:r.html_url})]}),r.pages_url&&(0,b.jsxs)("p",{children:["Pages: ",(0,b.jsx)("a",{href:r.pages_url,target:"_blank",className:"text-blue-600 underline",children:r.pages_url})]})]})]}):(0,b.jsx)(n,{onAuthSuccess:a=>{f(a),localStorage.setItem("github_access_token",a),q(a)}})]})})},n=({onAuthSuccess:a})=>(0,b.jsxs)("div",{className:"text-center py-6",children:[(0,b.jsx)("div",{className:"p-4 bg-component-bg rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center",children:(0,b.jsx)(i,{size:24,className:"text-text-muted"})}),(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsx)("h4",{className:"text-text-primary font-medium mb-2",children:"Connect to GitHub"}),(0,b.jsx)("p",{className:"text-sm text-text-muted",children:"Connect your GitHub account to create repositories and deploy with GitHub Pages"})]}),(0,b.jsx)(l,{onAuthSuccess:a})]}),o=({githubUser:a,githubForm:c,setGithubForm:d,isCreatingRepo:e,onDisconnect:f,onCreateRepo:g,onCancel:h})=>(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsx)(p,{githubUser:a,onDisconnect:f,isCreatingRepo:e}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)(q,{label:"Repo Name",value:c.name,onChange:a=>d(b=>({...b,name:a})),placeholder:"my-awesome-project",disabled:e,required:!0}),(0,b.jsx)(q,{label:"Description",value:c.description,onChange:a=>d(b=>({...b,description:a})),placeholder:"Project created with AI Web Studio",disabled:e}),(0,b.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[(0,b.jsx)(r,{id:"deploy-pages",label:"Deploy to Pages",description:"Auto-deploy with GitHub Pages",checked:c.deployPages,onChange:a=>d(b=>({...b,deployPages:a})),disabled:e}),(0,b.jsx)(r,{id:"is-public",label:"Public Repo",description:"Visible to everyone",checked:c.isPublic,onChange:a=>d(b=>({...b,isPublic:a})),disabled:e})]}),(0,b.jsx)(s,{githubForm:c,githubUser:a})]}),(0,b.jsx)(t,{isCreatingRepo:e,isValid:c.name.trim().length>0,onCreateRepo:g,onCancel:h})]}),p=({githubUser:a,onDisconnect:c,isCreatingRepo:d})=>(0,b.jsx)("div",{className:"bg-component-bg rounded-xl border border-panel-border p-4",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("img",{src:a?.avatar_url,alt:`${a?.login}'s GitHub avatar`,className:"w-10 h-10 rounded-full border-2 border-panel-border"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-sm font-semibold text-text-primary",children:a?.login}),(0,b.jsxs)("div",{className:"text-xs text-text-muted flex items-center gap-1",children:[(0,b.jsx)("div",{className:"w-2 h-2 bg-green-500 rounded-full","aria-hidden":"true"}),"Connected to GitHub"]})]})]}),(0,b.jsx)("button",{onClick:c,className:"text-xs text-text-muted hover:text-accent-color transition-colors px-3 py-1 rounded-lg hover:bg-component-hover disabled:opacity-50",disabled:d,children:"Disconnect"})]})}),q=({label:a,value:c,onChange:d,placeholder:e,disabled:f,required:g})=>(0,b.jsxs)("div",{children:[(0,b.jsxs)("label",{className:"block text-sm font-medium text-text-primary mb-2",children:[a,g&&(0,b.jsx)("span",{className:"text-red-400 ml-1",children:"*"})]}),(0,b.jsx)("input",{type:"text",value:c,onChange:a=>d(a.target.value),placeholder:e,disabled:f,required:g,className:"w-full p-3 border border-panel-border rounded-lg bg-component-bg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"})]}),r=({id:a,label:c,description:d,checked:e,onChange:f,disabled:g})=>(0,b.jsxs)("label",{className:"flex items-center gap-3 p-3 bg-component-bg rounded-lg border border-panel-border hover:border-accent-color transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",children:[(0,b.jsx)("input",{type:"checkbox",id:a,checked:e,onChange:a=>f(a.target.checked),disabled:g,className:"rounded border-panel-border bg-component-bg text-accent-color focus:ring-accent-color focus:ring-2 focus:ring-offset-2 focus:ring-offset-component-bg"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("div",{className:"text-sm font-medium text-text-primary",children:c}),(0,b.jsx)("div",{className:"text-xs text-text-muted",children:d})]})]}),s=({githubForm:a,githubUser:c})=>(0,b.jsxs)("div",{className:"bg-component-bg rounded-xl border border-panel-border overflow-hidden",children:[(0,b.jsx)("div",{className:"p-4 border-b border-panel-border",children:(0,b.jsxs)("p",{className:"font-semibold text-text-primary flex items-center gap-2",children:[(0,b.jsx)(k,{size:16}),"Files to be created"]})}),(0,b.jsxs)("div",{className:"p-4",children:[(0,b.jsxs)("ul",{className:"space-y-3",children:[(0,b.jsxs)("li",{className:"flex items-center gap-3 p-2 rounded-lg hover:bg-component-hover transition-colors",children:[(0,b.jsx)("div",{className:"w-2 h-2 bg-blue-500 rounded-full","aria-hidden":"true"}),(0,b.jsx)("code",{className:"text-sm text-text-primary font-medium",children:"index.html"}),(0,b.jsx)("span",{className:"text-xs text-text-muted ml-auto",children:"Your website"})]}),(0,b.jsxs)("li",{className:"flex items-center gap-3 p-2 rounded-lg hover:bg-component-hover transition-colors",children:[(0,b.jsx)("div",{className:"w-2 h-2 bg-green-500 rounded-full","aria-hidden":"true"}),(0,b.jsx)("code",{className:"text-sm text-text-primary font-medium",children:"README.md"}),(0,b.jsx)("span",{className:"text-xs text-text-muted ml-auto",children:"Project documentation"})]}),a.deployPages&&(0,b.jsxs)("li",{className:"flex items-center gap-3 p-2 rounded-lg hover:bg-component-hover transition-colors",children:[(0,b.jsx)("div",{className:"w-2 h-2 bg-purple-500 rounded-full","aria-hidden":"true"}),(0,b.jsx)("code",{className:"text-sm text-text-primary font-medium",children:".github/workflows/deploy.yml"}),(0,b.jsx)("span",{className:"text-xs text-text-muted ml-auto",children:"Deployment workflow"})]})]}),a.deployPages&&a.name&&(0,b.jsxs)("div",{className:"mt-4 p-3 bg-accent-color bg-opacity-5 rounded-lg border border-accent-color border-opacity-20",children:[(0,b.jsx)("p",{className:"text-sm text-text-primary font-medium mb-1",children:"Your website will be available at:"}),(0,b.jsxs)("code",{className:"text-xs text-accent-color break-all bg-black bg-opacity-20 px-2 py-1 rounded",children:["https://",c?.login,".github.io/",a.name,"/"]})]})]})]}),t=({isCreatingRepo:a,isValid:c,onCreateRepo:d,onCancel:e})=>(0,b.jsxs)("div",{className:"flex gap-3 pt-2",children:[(0,b.jsx)("button",{className:"btn btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed",onClick:e,disabled:a,children:"Cancel"}),(0,b.jsx)("button",{className:"btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",onClick:d,disabled:a||!c,children:a?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"}),"Creating..."]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(i,{size:16}),"Create Repository"]})})]}),u=(0,d.default)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]),v=(0,d.default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),w=(0,d.default)("wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",key:"1ngwbx"}]]),x=(0,d.default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]),y=(0,d.default)("square-stack",[["path",{d:"M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",key:"4i38lg"}],["path",{d:"M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",key:"mlte4a"}],["rect",{width:"8",height:"8",x:"14",y:"14",rx:"2",key:"1fa9i4"}]]),z=(0,d.default)("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]),A=(0,d.default)("image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]),B=(0,d.default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]),C=(0,d.default)("tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]),D=(0,d.default)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]),E=(0,d.default)("type",[["path",{d:"M12 4v16",key:"1654pz"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",key:"e0r10z"}],["path",{d:"M9 20h6",key:"s66wpe"}]]),F=(0,d.default)("bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]),G=(0,d.default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),H=(0,d.default)("navigation",[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]]),I=(0,d.default)("panel-left",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}]]),J=(0,d.default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]),K=(0,d.default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]),L=(0,d.default)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),M=(0,d.default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]),N=(0,d.default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);var O=a.i(19403);let P={header:(0,b.jsx)(k,{size:16}),hero:(0,b.jsx)(u,{size:16}),about:(0,b.jsx)(v,{size:16}),services:(0,b.jsx)(w,{size:16}),contact:(0,b.jsx)(x,{size:16}),footer:(0,b.jsx)(y,{size:16}),card:(0,b.jsx)(z,{size:16}),gallery:(0,b.jsx)(A,{size:16}),seo:(0,b.jsx)(B,{size:16}),"seo-schema":(0,b.jsx)(C,{size:16}),"social-icons":(0,b.jsx)(D,{size:16}),"feature-icons":(0,b.jsx)(u,{size:16}),"font-icons":(0,b.jsx)(E,{size:16}),navbar:(0,b.jsx)(H,{size:16}),sidebar:(0,b.jsx)(I,{size:16}),pricing:(0,b.jsx)(z,{size:16}),testimonials:(0,b.jsx)(D,{size:16}),stats:(0,b.jsx)(J,{size:16}),"login-form":(0,b.jsx)(K,{size:16}),newsletter:(0,b.jsx)(K,{size:16}),team:(0,b.jsx)(D,{size:16}),faq:(0,b.jsx)(L,{size:16}),breadcrumb:(0,b.jsx)(H,{size:16}),modal:(0,b.jsx)(y,{size:16}),progress:(0,b.jsx)(M,{size:16}),timeline:(0,b.jsx)(N,{size:16}),"primary-button":(0,b.jsx)(y,{size:16}),"secondary-button":(0,b.jsx)(y,{size:16}),"button-group":(0,b.jsx)(y,{size:16}),"readme-basic":(0,b.jsx)(k,{size:16}),"readme-advanced":(0,b.jsx)(k,{size:16}),"search-bar":(0,b.jsx)(B,{size:16}),"toggle-switch":(0,b.jsx)(G,{size:16}),"mega-menu":(0,b.jsx)(H,{size:16}),"breadcrumb-advanced":(0,b.jsx)(H,{size:16})},Q=(a,b)=>{let[d,e]=(0,c.useState)(()=>b);return(0,c.useEffect)(()=>{},[a,d]),[d,e]};function R({onInsert:a,onAiInsert:d,onOpenSettings:e,onResizeStart:f,currentCode:g="",framework:j}){let{settings:l}=(0,O.useSettings)(),[n,o]=(0,c.useState)(""),[p,q]=(0,c.useState)(!1),[r,s]=(0,c.useState)(""),[t,u]=(0,c.useState)("response"),[v,w]=(0,c.useState)([]),[x,y]=(0,c.useState)(""),[z,A]=(0,c.useState)(null),[C,D]=(0,c.useState)(!1),[E,H]=(0,c.useState)(!1),[I,J]=(0,c.useState)(!1),[K,L]=Q("component-favorites",new Set),[M,N]=Q("recent-components",[]),[R,U]=(0,c.useState)({name:"web-studio-project",description:"Project created with AI Web Studio",isPublic:!0,deployPages:!0}),{githubToken:V,setGithubToken:W,githubUser:X,setGithubUser:Y,fetchUserInfo:Z}=(()=>{let[a,b]=(0,c.useState)(null),[d,e]=(0,c.useState)(null);(0,c.useEffect)(()=>{},[]);let f=async a=>{try{let b=await fetch("https://api.github.com/user",{headers:{Authorization:`Bearer ${a}`,Accept:"application/vnd.github.v3+json"}});if(b.ok){let a=await b.json();e(a)}}catch(a){console.error("Failed to fetch user info:",a)}};return{githubToken:a,setGithubToken:b,githubUser:d,setGithubUser:e,fetchUserInfo:f}})(),$=(0,c.useMemo)(()=>{if(!x)return T;let a={};return Object.entries(T).forEach(([b,c])=>{let d=c.filter(a=>{let b=S[a];return a.toLowerCase().includes(x.toLowerCase())||b.description.toLowerCase().includes(x.toLowerCase())||b.tags.some(a=>a.toLowerCase().includes(x.toLowerCase()))});d.length>0&&(a[b]=d)}),a},[x]),_=async()=>{if(!V)return void alert("Please connect to GitHub first");J(!0);let a=window.open("","_blank","width=400,height=200");a&&(a.document.write('<p style="font-family:sans-serif; padding: 20px;">Creating repository…</p>'),a.document.close());try{let b={html:g||`<!DOCTYPE html>
<html>
<head>
    <title>${R.name}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1 {
            color: #2c5aa0;
            margin-bottom: 1rem;
        }
        .badge {
            display: inline-block;
            background: #2c5aa0;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${R.name}</h1>
        <p>${R.description}</p>
        <div class="badge">AI Web Studio</div>
        <p>This project was created using <a href="https://studio.jessejesse.com" target="_blank">studio.jessejesse.com</a></p>
    </div>
</body>
</html>`},c=((a,b,c,d)=>{let e=b?`## GitHub Pages Deployment

Your site will be automatically deployed to GitHub Pages at:

https://${c?.login}.github.io/${d.name}/

The deployment will start automatically when you push to the main branch.`:`## Deployment

To deploy this site to GitHub Pages:
1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose "main" branch and "/" root folder
4. Click Save`,f=[`# ${d.name}`,"",`${d.description}`,'\n<img src="https://img.shields.io/badge/made%20with-studio.jessejesse.com-blue?style=flat" alt="made with studio.jessejesse.com" />\n\n## About\n\nThis project was created with [studio.jessejesse.com](https://studio.jessejesse.com) - an AI-powered development studio.\n\n## Getting Started\n\nOpen index.html in your browser to view the project.\n',e,"\n---\n*Created with AI Web Studio*"].join("\n"),g=[{path:"index.html",content:a.html},{path:"README.md",content:f}];return b&&g.push({path:".github/workflows/deploy.yml",content:`# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`}),g})(b,R.deployPages,X,R),d=await fetch("/api/github/create-repo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:R.name,description:R.description,isPublic:R.isPublic,deployPages:R.deployPages,files:c,accessToken:V})}),e=await d.json();if(e.success){let b=`
          <div style="font-family:sans-serif; padding: 20px;">
            <p>Repository created successfully!</p>
            <p>URL: <a href="${e.html_url}" target="_blank" style="color:blue">${e.html_url}</a></p>
            ${e.pages_url?`<p>Pages: <a href="${e.pages_url}" target="_blank" style="color:blue">${e.pages_url}</a></p>`:""}
          </div>
        `;a&&(a.document.open(),a.document.write(b),a.document.close()),H(!1)}else throw Error(e.error||"Failed to create repository")}catch(b){console.error("GitHub repo creation failed:",b),a&&a.close(),alert(`Failed to create repository: ${b.message}`)}finally{J(!1)}},aa=async()=>{if(n.trim()&&!C&&!p){D(!0),q(!0),s("");try{let a="react"===j?`You are an expert React developer. Create a React component with JSX and inline styles for: "${n}"
CRITICAL REQUIREMENTS FOR REACT:
- Return ONLY the React JSX code with inline styles (style={{}})
- No explanations, no markdown formatting, no backticks
- Make it a functional component
- Use modern React patterns
- Include proper event handlers if needed
- Make it responsive and production-ready
- Ensure good color contrast
- Make it work on all screen sizes
- Use camelCase for style properties
- Include proper JSX syntax`:`You are an expert web developer. Create responsive HTML with inline CSS for: "${n}"
CRITICAL REQUIREMENTS FOR HTML:
- Return ONLY the HTML code with inline styles
- No explanations, no markdown formatting, no backticks
- Make it modern, responsive, and production-ready
- Use semantic HTML where possible
- Include proper hover/focus states
- Ensure good color contrast
- Make it work on all screen sizes`,b=await fetch("https://llm.jessejesse.workers.dev/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:a}]})});if(!b.ok){let a=await b.text();throw Error(`Worker API error: ${b.status} - ${a}`)}let c=b.body?.getReader();if(!c)throw Error("No response body received");let e="",f=new TextDecoder;for(;;){let{done:a,value:b}=await c.read();if(a)break;for(let a of f.decode(b).split("\n"))if(a.startsWith("data: ")&&"data: [DONE]"!==a)try{let b=JSON.parse(a.slice(6));b.response&&(e+=b.response,s(e))}catch(a){}}if(c.releaseLock(),!e.trim())throw Error("Worker returned empty response");let g=e.replace(/```(html|css|js|jsx)?/gi,"").replace(/```/g,"").replace(/^`|`$/g,"").trim();s(g);let h=new Date().toLocaleTimeString();d(`
<!-- AI Generated ${"react"===j?"React":"HTML"} (${h}): ${n.substring(0,50)}... -->
${g}
`),"chat"===t&&w(a=>[...a,{role:"user",content:n},{role:"assistant",content:g}]),o("")}catch(b){console.error("AI request failed:",b);let a="An error occurred";b instanceof Error&&(a=b.message.includes("Failed to fetch")?"Network error. Check your connection and API endpoint.":b.message.includes("403")?"Access denied. Check your worker configuration.":b.message.includes("429")?"Rate limit exceeded. Wait a moment before trying again.":b.message.includes("404")?"API endpoint not found. Check your worker URL.":b.message),s(`Error: ${a}`)}finally{q(!1),setTimeout(()=>D(!1),1e3)}}};return(0,b.jsxs)("div",{className:"flex flex-col h-full overflow-hidden relative",children:[f&&(0,b.jsx)("div",{className:"absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-accent-color hover:bg-opacity-50 transition-colors",onMouseDown:f}),(0,b.jsxs)("div",{className:"!p-2 border-b border-panel-border",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsx)("div",{className:"flex items-center gap-3",children:(0,b.jsx)("h3",{className:"m-0 text-xs font-semibold",children:"studio.JesseJesse.com"})}),(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsx)("button",{onClick:()=>y(x?"":" "),className:"!p-1.5 hover:bg-component-hover rounded transition-colors",title:"Search",children:(0,b.jsx)(B,{size:15})}),(0,b.jsx)("button",{onClick:e,className:"!p-1.5 hover:bg-component-hover rounded transition-colors",title:"Settings",children:(0,b.jsx)(G,{size:15})})]})]}),""!==x&&(0,b.jsxs)("div",{className:"mt-2 relative",children:[(0,b.jsx)("input",{type:"text",placeholder:"Type to search components...",value:x,onChange:a=>y(a.target.value),className:"w-full pl-2 pr-6 py-1 bg-component-bg border border-panel-border rounded text-xs focus:outline-none focus:border-accent-color text-foreground",autoFocus:!0}),(0,b.jsx)("button",{onClick:()=>y(""),className:"absolute right-1 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-foreground text-xs",children:"×"})]})]}),(0,b.jsx)("div",{className:"flex-1 overflow-auto min-h-0",children:(0,b.jsx)("div",{className:"components-list",children:Object.entries($).map(([c,d])=>(0,b.jsxs)("div",{className:"component-category",children:[(0,b.jsx)("div",{className:"category-title",children:c}),d.map(c=>(0,b.jsxs)("div",{className:"component-item group",onClick:()=>(b=>{let c=S[b];c&&(N(a=>{let c=a.filter(a=>a!==b);return[b,...c].slice(0,10)}),a(c.code))})(c),children:[(0,b.jsx)("div",{className:"component-icon",children:P[c]||(0,b.jsx)(k,{size:16})}),(0,b.jsx)("span",{className:"component-name flex-1",children:c.split("-").map(a=>a[0].toUpperCase()+a.slice(1)).join(" ")})]},c))]},c))})}),(0,b.jsxs)("div",{className:"ai-section",children:[(0,b.jsx)("div",{className:"panel-header",children:(0,b.jsx)("div",{className:"flex items-center justify-between w-full",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(h,{onPromptSelect:o}),(0,b.jsxs)("button",{className:"btn btn-outline btn-sm flex items-center gap-2",onClick:()=>H(!0),children:[(0,b.jsx)(i,{size:14}),"Create Repo"]})]})})}),(0,b.jsxs)("div",{className:"mode-toggle",children:[(0,b.jsxs)("label",{className:"mode-option",children:[(0,b.jsx)("input",{type:"radio",value:"response",checked:"response"===t,onChange:()=>u("response"),disabled:p||C}),"Stateless"]}),(0,b.jsxs)("label",{className:"mode-option",children:[(0,b.jsx)("input",{type:"radio",value:"chat",checked:"chat"===t,onChange:()=>u("chat"),disabled:p||C}),"Chat Mode"]})]}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)("textarea",{className:"prompt-textarea",placeholder:"describe what to create...",value:n,onChange:a=>o(a.target.value),onKeyDown:a=>{"Enter"===a.key&&(a.ctrlKey||a.metaKey)&&(a.preventDefault(),!C&&!p&&n.trim()&&aa())},disabled:p||C}),(0,b.jsxs)("div",{className:"text-xs text-text-muted mt-1 px-1 flex justify-between",children:[(0,b.jsx)("span",{children:"@cf/meta/llama-3.3-70b-instruct-fp8-fast"}),(p||C)&&(0,b.jsx)("span",{className:"text-accent-color",children:"●"})]})]}),(0,b.jsxs)("button",{className:"btn btn-accent",onClick:a=>{a.preventDefault(),a.stopPropagation(),!C&&!p&&n.trim()&&aa()},disabled:p||C||!n.trim(),style:{opacity:p||C||!n.trim()?.5:1},children:[(0,b.jsx)(F,{size:16}),p?"Generating...":C?"Please wait...":"Ask AI"]}),r&&(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"response-label",children:"AI Response"}),(0,b.jsx)("div",{className:"ai-response",children:r})]}),"chat"===t&&v.length>0&&(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"response-label flex justify-between items-center",children:[(0,b.jsx)("span",{children:"Chat History"}),(0,b.jsx)("button",{onClick:()=>w([]),className:"text-xs text-text-muted hover:text-foreground",children:"Clear"})]}),(0,b.jsx)("div",{className:"chat-history",children:v.map((a,c)=>(0,b.jsxs)("div",{className:`chat-message ${a.role}`,children:[(0,b.jsx)("div",{className:`message-role ${a.role}`,children:a.role.toUpperCase()}),(0,b.jsx)("div",{children:a.content})]},c))})]})]}),(0,b.jsx)(m,{showGithubModal:E,setShowGithubModal:H,githubToken:V,setGithubToken:W,githubUser:X,setGithubUser:Y,githubForm:R,setGithubForm:U,isCreatingRepo:I,handleCreateRepo:_,fetchUserInfo:Z})]})}let S={header:{code:`<!-- Header Component -->
    <header style="background-color: #333; color: white; padding: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
        <h1 style="margin: 0;">My Website</h1>
        <nav>
          <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Home</a>
          <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">About</a>
          <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Contact</a>
        </nav>
      </div>
    </header>`,description:"Website header with navigation",tags:["layout","navigation","header"]},hero:{code:`<!-- Hero Section -->
    <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">World Wide Web</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">We create amazing digital experiences</p>
        <button style="background: white; color: #333; border: none; padding: 12px 30px; font-size: 1rem; border-radius: 5px; cursor: pointer;">Get Started</button>
      </div>
    </section>`,description:"Hero section with call-to-action",tags:["layout","hero","cta"]},about:{code:`<!-- About Section -->
    <section style="padding: 4rem 2rem; background-color: #f9f9f9;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">About Us</h2>
        <p style="line-height: 1.6; margin-bottom: 1rem; color: #666;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p style="line-height: 1.6; color: #666;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
      </div>
    </section>`,description:"About section with company information",tags:["layout","content","about"]},services:{code:`<!-- Services Section -->
    <section style="padding: 4rem 2rem; background-color: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Our Services</h2>
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem;">
          <div style="flex: 1; min-width: 250px; background: #f9f9f9; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="color: #333;">Web Design</h3>
            <p style="color: #666;">Beautiful and responsive web designs.</p>
          </div>
          <div style="flex: 1; min-width: 250px; background: #f9f9f9; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="color: #333;">Development</h3>
            <p style="color: #666;">Custom web applications.</p>
          </div>
        </div>
      </div>
    </section>`,description:"Services showcase section",tags:["layout","content","services"]},contact:{code:`<!-- Contact Form -->
    <section style="padding: 4rem 2rem; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Contact Us</h2>
        <form style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 5px; color: #333;">Name</label>
            <input type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 5px; color: #333;">Email</label>
            <input type="email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <button type="submit" style="background: #333; color: white; border: none; padding: 12px 30px; border-radius: 4px; cursor: pointer; width: 100%;">Send Message</button>
        </form>
      </div>
    </section>`,description:"Contact form section",tags:["forms","contact"]},footer:{code:`<!-- Footer -->
    <footer style="background-color: #333; color: white; padding: 2rem; text-align: center;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <p>&copy; 2024 My Website. All rights reserved.</p>
        <div style="margin-top: 1rem;">
          <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Privacy Policy</a>
          <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Terms of Service</a>
        </div>
      </div>
    </footer>`,description:"Website footer",tags:["layout","footer"]},card:{code:`<!-- Card Component -->
    <div style="background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 300px; margin: 0 auto;">
      <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Card Image" style="width: 100%; height: auto;">
      <div style="padding: 1.5rem;">
        <h3 style="margin-bottom: 0.5rem; color: #333;">Card Title</h3>
        <p style="color: #666; margin-bottom: 1rem;">This is a sample card with example content.</p>
        <button style="background: #333; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Learn More</button>
      </div>
    </div>`,description:"Card component with image and text",tags:["ui","card","content"]},gallery:{code:`<!-- Image Gallery -->
    <section style="padding: 2rem; background-color: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Image Gallery</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
          <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;">
          <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;">
        </div>
      </div>
    </section>`,description:"Image gallery grid",tags:["content","gallery","images"]},seo:{code:`<!-- SEO Meta Tags -->
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Website Title</title>
      <meta name="description" content="Your website description for SEO">
      <meta name="keywords" content="your, keywords, here">
      <meta name="author" content="Your Name">
      <meta property="og:title" content="Your Website Title">
      <meta property="og:description" content="Your website description">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://yourwebsite.com">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="Your Website Title">
      <meta name="twitter:description" content="Your website description">
      <link rel="canonical" href="https://yourwebsite.com">
    </head>`,description:"SEO meta tags for head section",tags:["seo","meta","head"]},"seo-schema":{code:`<!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Your Website Name",
      "url": "https://yourwebsite.com",
      "description": "Your website description",
      "publisher": {
        "@type": "Organization",
        "name": "Your Organization"
      }
    }
    </script>`,description:"Schema.org structured data",tags:["seo","schema","structured-data"]},"social-icons":{code:`<!-- Social Media Icons with Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <div style="display: flex; gap: 15px; justify-content: center; padding: 2rem;">
      <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
        <i class="fab fa-facebook"></i>
      </a>
      <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
        <i class="fab fa-instagram"></i>
      </a>
      <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
        <i class="fab fa-linkedin"></i>
      </a>
      <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
        <i class="fab fa-youtube"></i>
      </a>
    </div>`,description:"Social media icons",tags:["icons","social","ui"]},"feature-icons":{code:`<!-- Feature Icons Section -->
    <section style="padding: 4rem 2rem; background-color: #f8fafc;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Our Features</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
          <div style="text-align: center;">
            <div style="margin-bottom: 1rem; color: #667eea;">
              <i class="fas fa-bolt" style="font-size: 48px;"></i>
            </div>
            <h3 style="color: #333; margin-bottom: 1rem;">Fast Performance</h3>
            <p style="color: #666;">Lightning fast loading times and smooth interactions.</p>
          </div>
          <div style="text-align: center;">
            <div style="margin-bottom: 1rem; color: #667eea;">
              <i class="fas fa-shield-alt" style="font-size: 48px;"></i>
            </div>
            <h3 style="color: #333; margin-bottom: 1rem;">Secure</h3>
            <p style="color: #666;">Enterprise-grade security for your peace of mind.</p>
          </div>
          <div style="text-align: center;">
            <div style="margin-bottom: 1rem; color: #667eea;">
              <i class="fas fa-mobile-alt" style="font-size: 48px;"></i>
            </div>
            <h3 style="color: #333; margin-bottom: 1rem;">Responsive</h3>
            <p style="color: #666;">Looks great on all devices and screen sizes.</p>
          </div>
        </div>
      </div>
    </section>`,description:"Feature showcase with icons",tags:["content","features","icons"]},"font-icons":{code:`<!-- Font Awesome Icons (CDN) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <div style="display: flex; gap: 20px; justify-content: center; padding: 2rem;">
      <i class="fas fa-home" style="font-size: 24px; color: #333;"></i>
      <i class="fas fa-envelope" style="font-size: 24px; color: #333;"></i>
      <i class="fas fa-phone" style="font-size: 24px; color: #333;"></i>
      <i class="fas fa-share-alt" style="font-size: 24px; color: #333;"></i>
    </div>`,description:"Font Awesome icons",tags:["icons","ui"]},navbar:{code:`<!-- Modern Navigation Bar -->
    <nav style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 1rem 2rem;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 1.5rem; font-weight: bold; color: #333;">Logo</div>
        <div style="display: flex; gap: 2rem;">
          <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Home</a>
          <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">About</a>
          <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Services</a>
          <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Contact</a>
        </div>
        <button style="background: #667eea; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer;">Get Started</button>
      </div>
    </nav>`,description:"Modern navigation bar",tags:["navigation","header","ui"]},sidebar:{code:`<!-- Sidebar Navigation -->
    <div style="display: flex; min-height: 400px;">
      <aside style="width: 250px; background: #2d3748; color: white; padding: 2rem;">
        <h3 style="margin-bottom: 2rem;">Menu</h3>
        <nav style="display: flex; flex-direction: column; gap: 1rem;">
          <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px; background: #4a5568;">Dashboard</a>
          <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Profile</a>
          <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Settings</a>
          <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Messages</a>
        </nav>
      </aside>
      <main style="flex: 1; padding: 2rem; background: #f7fafc;">
        <h2>Main Content Area</h2>
        <p>Your content goes here...</p>
      </main>
    </div>`,description:"Sidebar navigation layout",tags:["layout","navigation","sidebar"]},pricing:{code:`<!-- Pricing Cards -->
    <section style="padding: 4rem 2rem; background: #f8fafc;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Choose Your Plan</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #333;">Basic</h3>
            <div style="font-size: 2rem; font-weight: bold; color: #667eea; margin: 1rem 0;">$19<span style="font-size: 1rem; color: #666;">/month</span></div>
            <ul style="list-style: none; padding: 0; margin: 2rem 0;">
              <li style="padding: 0.5rem 0;">5 Projects</li>
              <li style="padding: 0.5rem 0;">10GB Storage</li>
              <li style="padding: 0.5rem 0;">Basic Support</li>
            </ul>
            <button style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; width: 100%;">Get Started</button>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 8px 15px rgba(0,0,0,0.1); text-align: center; border: 2px solid #667eea;">
            <div style="background: #667eea; color: white; padding: 0.5rem; border-radius: 5px; margin: -2rem -2rem 1rem -2rem;">Most Popular</div>
            <h3 style="color: #333;">Pro</h3>
            <div style="font-size: 2rem; font-weight: bold; color: #667eea; margin: 1rem 0;">$49<span style="font-size: 1rem; color: #666;">/month</span></div>
            <ul style="list-style: none; padding: 0; margin: 2rem 0;">
              <li style="padding: 0.5rem 0;">Unlimited Projects</li>
              <li style="padding: 0.5rem 0;">50GB Storage</li>
              <li style="padding: 0.5rem 0;">Priority Support</li>
            </ul>
            <button style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; width: 100%;">Get Started</button>
          </div>
        </div>
      </div>
    </section>`,description:"Pricing cards section",tags:["ui","pricing","cards"]},testimonials:{code:`<!-- Testimonials Section -->
    <section style="padding: 4rem 2rem; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">What Our Clients Say</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div style="background: #f8fafc; padding: 2rem; border-radius: 10px; border-left: 4px solid #667eea;">
            <div style="color: #667eea; font-size: 1.5rem; margin-bottom: 1rem;">"</div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">This service has completely transformed our business. The results were beyond our expectations!</p>
            <div style="font-weight: bold; color: #333;">- Sarah Johnson</div>
            <div style="color: #666; font-size: 0.9rem;">CEO, Tech Solutions</div>
          </div>
          <div style="background: #f8fafc; padding: 2rem; border-radius: 10px; border-left: 4px solid #667eea;">
            <div style="color: #667eea; font-size: 1.5rem; margin-bottom: 1rem;">"</div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">Outstanding quality and professional service. Highly recommended for any business.</p>
            <div style="font-weight: bold; color: #333;">- Michael Chen</div>
            <div style="color: #666; font-size: 0.9rem;">Marketing Director</div>
          </div>
        </div>
      </div>
    </section>`,description:"Customer testimonials section",tags:["content","testimonials","social-proof"]},stats:{code:`<!-- Statistics Section -->
    <section style="padding: 4rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
          <div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">500+</div>
            <div style="font-size: 1.1rem;">Happy Clients</div>
          </div>
          <div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">99%</div>
            <div style="font-size: 1.1rem;">Satisfaction Rate</div>
          </div>
          <div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">24/7</div>
            <div style="font-size: 1.1rem;">Support</div>
          </div>
          <div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">5+</div>
            <div style="font-size: 1.1rem;">Years Experience</div>
          </div>
        </div>
      </div>
    </section>`,description:"Statistics counter section",tags:["content","stats","numbers"]},"login-form":{code:`<!-- Login Form -->
    <div style="max-width: 400px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Welcome Back</h2>
      <form>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Email</label>
          <input type="email" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;" placeholder="Enter your email">
        </div>
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Password</label>
          <input type="password" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;" placeholder="Enter your password">
        </div>
        <button type="submit" style="width: 100%; background: #667eea; color: white; border: none; padding: 12px; border-radius: 5px; font-size: 1rem; cursor: pointer;">Sign In</button>
      </form>
      <div style="text-align: center; margin-top: 1rem;">
        <a href="#" style="color: #667eea; text-decoration: none;">Forgot password?</a>
      </div>
    </div>`,description:"Login form component",tags:["forms","login","authentication"]},newsletter:{code:`<!-- Newsletter Signup -->
    <section style="padding: 4rem 2rem; background: #667eea; color: white;">
      <div style="max-width: 600px; margin: 0 auto; text-align: center;">
        <h2 style="margin-bottom: 1rem;">Stay Updated</h2>
        <p style="margin-bottom: 2rem; opacity: 0.9;">Subscribe to our newsletter for the latest updates and offers.</p>
        <form style="display: flex; gap: 1rem; max-width: 400px; margin: 0 auto;">
          <input type="email" placeholder="Enter your email" style="flex: 1; padding: 12px; border: none; border-radius: 5px; font-size: 1rem;">
          <button type="submit" style="background: white; color: #667eea; border: none; padding: 12px 24px; border-radius: 5px; font-size: 1rem; cursor: pointer; font-weight: bold;">Subscribe</button>
        </form>
      </div>
    </section>`,description:"Newsletter signup form",tags:["forms","newsletter","marketing"]},team:{code:`<!-- Team Section -->
    <section style="padding: 4rem 2rem; background: #f8fafc;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Meet Our Team</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
          <div style="text-align: center; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Team Member" style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 1rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">John Doe</h3>
            <div style="color: #667eea; margin-bottom: 1rem;">CEO & Founder</div>
            <p style="color: #666;">Visionary leader with 10+ years of experience in the industry.</p>
          </div>
          <div style="text-align: center; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Team Member" style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 1rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">Jane Smith</h3>
            <div style="color: #667eea; margin-bottom: 1rem;">Creative Director</div>
            <p style="color: #666;">Award-winning designer with a passion for innovation.</p>
          </div>
        </div>
      </div>
    </section>`,description:"Team member showcase",tags:["content","team","about"]},faq:{code:`<!-- FAQ Section -->
    <section style="padding: 4rem 2rem; background: white;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Frequently Asked Questions</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">What is your refund policy?</h3>
            <p style="color: #666; margin: 0;">We offer a 30-day money-back guarantee for all our plans. If you're not satisfied, we'll refund your payment.</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">Do you offer technical support?</h3>
            <p style="color: #666; margin: 0;">Yes, we provide 24/7 technical support for all our customers via email, chat, and phone.</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">Can I upgrade my plan later?</h3>
            <p style="color: #666; margin: 0;">Absolutely! You can upgrade or downgrade your plan at any time from your account dashboard.</p>
          </div>
        </div>
      </div>
    </section>`,description:"FAQ accordion section",tags:["content","faq","help"]},breadcrumb:{code:`<!-- Breadcrumb Navigation -->
    <nav style="padding: 1rem 2rem; background: #f7fafc;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; gap: 0.5rem; font-size: 0.9rem;">
          <a href="#" style="color: #667eea; text-decoration: none;">Home</a>
          <span style="color: #a0aec0;">/</span>
          <a href="#" style="color: #667eea; text-decoration: none;">Category</a>
          <span style="color: #a0aec0;">/</span>
          <span style="color: #718096;">Current Page</span>
        </div>
      </div>
    </nav>`,description:"Breadcrumb navigation",tags:["navigation","breadcrumb","ui"]},modal:{code:`<!-- Modal Dialog -->
    <div style="background: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <h2 style="margin-bottom: 1rem; color: #333;">Modal Title</h2>
        <p style="color: #666; margin-bottom: 2rem;">This is a sample modal dialog. You can put any content here.</p>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button style="background: #e2e8f0; color: #4a5568; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cancel</button>
          <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Confirm</button>
        </div>
      </div>
    </div>`,description:"Modal dialog component",tags:["ui","modal","dialog"]},progress:{code:`<!-- Progress Bars -->
    <div style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin-bottom: 2rem; color: #333;">Skills & Progress</h3>
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: between; margin-bottom: 0.5rem;">
          <span style="color: #333;">Web Design</span>
          <span style="color: #667eea;">90%</span>
        </div>
        <div style="background: #e2e8f0; border-radius: 10px; height: 8px;">
          <div style="background: #667eea; height: 100%; width: 90%; border-radius: 10px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: between; margin-bottom: 0.5rem;">
          <span style="color: #333;">Development</span>
          <span style="color: #667eea;">75%</span>
        </div>
        <div style="background: #e2e8f0; border-radius: 10px; height: 8px;">
          <div style="background: #667eea; height: 100%; width: 75%; border-radius: 10px;"></div>
        </div>
      </div>
    </div>`,description:"Progress bar component",tags:["ui","progress","skills"]},timeline:{code:`<!-- Timeline -->
    <div style="max-width: 800px; margin: 2rem auto; padding: 2rem;">
      <h3 style="margin-bottom: 2rem; color: #333; text-align: center;">Our Journey</h3>
      <div style="position: relative;">
        <div style="display: flex; margin-bottom: 2rem;">
          <div style="flex: 0 0 100px; text-align: right; padding-right: 2rem;">
            <div style="font-weight: bold; color: #667eea;">2020</div>
          </div>
          <div style="flex: 1; padding-left: 2rem; border-left: 2px solid #667eea; position: relative;">
            <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%; position: absolute; left: -7px; top: 5px;"></div>
            <h4 style="color: #333; margin-bottom: 0.5rem;">Company Founded</h4>
            <p style="color: #666; margin: 0;">Started our journey with a small team and big dreams.</p>
          </div>
        </div>
        <div style="display: flex; margin-bottom: 2rem;">
          <div style="flex: 0 0 100px; text-align: right; padding-right: 2rem;">
            <div style="font-weight: bold; color: #667eea;">2022</div>
          </div>
          <div style="flex: 1; padding-left: 2rem; border-left: 2px solid #667eea; position: relative;">
            <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%; position: absolute; left: -7px; top: 5px;"></div>
            <h4 style="color: #333; margin-bottom: 0.5rem;">Series A Funding</h4>
            <p style="color: #666; margin: 0;">Raised $5M to expand our services and team.</p>
          </div>
        </div>
      </div>
    </div>`,description:"Timeline component",tags:["content","timeline","history"]},"primary-button":{code:`<!-- Primary Button -->
    <button style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">
      Primary Button
    </button>`,description:"Primary action button",tags:["ui","button","interactive"]},"secondary-button":{code:`<!-- Secondary Button -->
    <button style="background: transparent; color: #667eea; border: 2px solid #667eea; padding: 10px 22px; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">
      Secondary Button
    </button>`,description:"Secondary action button",tags:["ui","button","interactive"]},"button-group":{code:`<!-- Button Group -->
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Primary</button>
      <button style="background: transparent; color: #667eea; border: 2px solid #667eea; padding: 8px 18px; border-radius: 6px; cursor: pointer;">Secondary</button>
      <button style="background: #e2e8f0; color: #4a5568; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Default</button>
    </div>`,description:"Group of buttons",tags:["ui","button","group"]},"readme-basic":{code:`<!-- Basic README Template -->
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <h1 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem;">Project Name</h1>
      
      <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
        <p style="margin: 0; color: #4a5568;">A brief description of your project.</p>
      </div>

      <h2 style="color: #333; margin-top: 2rem;">Features</h2>
      <ul style="color: #4a5568;">
        <li>Feature 1</li>
        <li>Feature 2</li>
        <li>Feature 3</li>
      </ul>

      <h2 style="color: #333; margin-top: 2rem;">Installation</h2>
      <pre style="background: #2d3748; color: #e2e8f0; padding: 1rem; border-radius: 6px;">
    npm install</pre>

      <h2 style="color: #333; margin-top: 2rem;">Usage</h2>
      <pre style="background: #2d3748; color: #e2e8f0; padding: 1rem; border-radius: 6px;">
    npm start</pre>
    </div>`,description:"Basic README template",tags:["documentation","readme","markdown"]},"readme-advanced":{code:`<!-- Advanced README Template -->
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h1 style="color: #333; margin-bottom: 0.5rem;">Project Name</h1>
        <p style="color: #666; font-size: 1.2rem;">A modern web application</p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
          <span style="background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">JavaScript</span>
          <span style="background: #48bb78; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">HTML5</span>
          <span style="background: #ed8936; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">CSS3</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0;">
        <div style="text-align: center;">
          <h3 style="color: #333;">Fast</h3>
          <p style="color: #666;">Lightning fast performance</p>
        </div>
        <div style="text-align: center;">
          <h3 style="color: #333;">Responsive</h3>
          <p style="color: #666;">Works on all devices</p>
        </div>
        <div style="text-align: center;">
          <h3 style="color: #333;">Modern</h3>
          <p style="color: #666;">Clean, modern design</p>
        </div>
      </div>

      <h2 style="color: #333; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">Quick Start</h2>
      <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
        <div style="background: #edf2f7; padding: 0.5rem 1rem; font-weight: 500; color: #4a5568;">Terminal</div>
        <pre style="margin: 0; padding: 1rem; background: #2d3748; color: #e2e8f0;">
    git clone https://github.com/user/repo.git
    cd project
    npm install
    npm run dev</pre>
      </div>
    </div>`,description:"Advanced README with badges",tags:["documentation","readme","badges"]},"search-bar":{code:`<!-- Search Bar -->
    <div style="max-width: 400px; margin: 2rem auto;">
      <div style="position: relative;">
        <input type="text" placeholder="Search..." style="width: 100%; padding: 12px 45px 12px 16px; border: 2px solid #e2e8f0; border-radius: 25px; font-size: 1rem; transition: border-color 0.2s ease;">
        <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: #667eea; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </button>
      </div>
    </div>`,description:"Search input with button",tags:["forms","search","input"]},"toggle-switch":{code:`<!-- Toggle Switch -->
    <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
      <div style="position: relative;">
        <input type="checkbox" style="display: none;">
        <div style="width: 50px; height: 24px; background: #e2e8f0; border-radius: 12px; position: relative; transition: background 0.2s ease;">
          <div style="position: absolute; left: 2px; top: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.2s ease;"></div>
        </div>
      </div>
      <span style="color: #333;">Toggle setting</span>
    </label>`,description:"Toggle switch component",tags:["forms","toggle","ui"]},"mega-menu":{code:`<!-- Mega Menu -->
    <nav style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="max-width: 1200px; margin: 0 auto; padding: 1rem 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.5rem; font-weight: bold; color: #333;">Logo</div>
          <div style="display: flex; gap: 2rem;">
            <div style="position: relative;">
              <button style="background: none; border: none; color: #333; font-weight: 500; cursor: pointer; padding: 0.5rem 1rem;">Products</button>
            </div>
            <a href="#" style="text-decoration: none; color: #333; font-weight: 500; padding: 0.5rem 1rem;">Solutions</a>
            <a href="#" style="text-decoration: none; color: #333; font-weight: 500; padding: 0.5rem 1rem;">Pricing</a>
          </div>
        </div>
      </div>
    </nav>`,description:"Mega menu navigation",tags:["navigation","menu","header"]},"breadcrumb-advanced":{code:`<!-- Advanced Breadcrumb -->
    <nav style="padding: 1rem 2rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
          <a href="#" style="color: #667eea; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </a>
          <span style="color: #a0aec0;">/</span>
          <a href="#" style="color: #667eea; text-decoration: none;">Products</a>
          <span style="color: #a0aec0;">/</span>
          <span style="color: #718096;">Current Page</span>
        </div>
      </div>
    </nav>`,description:"Breadcrumb with icons",tags:["navigation","breadcrumb","icons"]}},T={Layout:["header","hero","about","services","contact","footer","sidebar"],Navigation:["navbar","breadcrumb","breadcrumb-advanced","mega-menu"],Content:["card","gallery","team","testimonials","stats","timeline","faq"],Forms:["contact","login-form","newsletter","search-bar","toggle-switch"],"UI Components":["modal","progress","pricing","primary-button","secondary-button","button-group"],Documentation:["readme-basic","readme-advanced"],SEO:["seo","seo-schema"],Icons:["social-icons","feature-icons","font-icons"]}},14909,(a,b,c)=>{"use strict";var d=a.e&&a.e.__assign||function(){return(d=Object.assign||function(a){for(var b,c=1,d=arguments.length;c<d;c++)for(var e in b=arguments[c])Object.prototype.hasOwnProperty.call(b,e)&&(a[e]=b[e]);return a}).apply(this,arguments)},e=a.e&&a.e.__createBinding||(Object.create?function(a,b,c,d){void 0===d&&(d=c);var e=Object.getOwnPropertyDescriptor(b,c);(!e||("get"in e?!b.__esModule:e.writable||e.configurable))&&(e={enumerable:!0,get:function(){return b[c]}}),Object.defineProperty(a,d,e)}:function(a,b,c,d){void 0===d&&(d=c),a[d]=b[c]}),f=a.e&&a.e.__setModuleDefault||(Object.create?function(a,b){Object.defineProperty(a,"default",{enumerable:!0,value:b})}:function(a,b){a.default=b}),g=a.e&&a.e.__importStar||function(a){if(a&&a.__esModule)return a;var b={};if(null!=a)for(var c in a)"default"!==c&&Object.prototype.hasOwnProperty.call(a,c)&&e(b,a,c);return f(b,a),b},h=a.e&&a.e.__rest||function(a,b){var c={};for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&0>b.indexOf(d)&&(c[d]=a[d]);if(null!=a&&"function"==typeof Object.getOwnPropertySymbols)for(var e=0,d=Object.getOwnPropertySymbols(a);e<d.length;e++)0>b.indexOf(d[e])&&Object.prototype.propertyIsEnumerable.call(a,d[e])&&(c[d[e]]=a[d[e]]);return c};Object.defineProperty(c,"__esModule",{value:!0});var i=g(a.r(83572)),j="npm__react-simple-code-editor__textarea",k="\n/**\n * Reset the text fill color so that placeholder is visible\n */\n.".concat(j,":empty {\n  -webkit-text-fill-color: inherit !important;\n}\n\n/**\n * Hack to apply on some CSS on IE10 and IE11\n */\n@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n  /**\n    * IE doesn't support '-webkit-text-fill-color'\n    * So we use 'color: transparent' to make the text transparent on IE\n    * Unlike other browsers, it doesn't affect caret color in IE\n    */\n  .").concat(j," {\n    color: transparent !important;\n  }\n\n  .").concat(j,"::selection {\n    background-color: #accef7 !important;\n    color: transparent !important;\n  }\n}\n"),l=i.forwardRef(function(a,b){var c=a.autoFocus,e=a.disabled,f=a.form,g=a.highlight,l=a.ignoreTabKey,n=void 0!==l&&l,o=a.insertSpaces,p=void 0===o||o,q=a.maxLength,r=a.minLength,s=a.name,t=a.onBlur,u=a.onClick,v=a.onFocus,w=a.onKeyDown,x=a.onKeyUp,y=a.onValueChange,z=a.padding,A=void 0===z?0:z,B=a.placeholder,C=a.preClassName,D=a.readOnly,E=a.required,F=a.style,G=a.tabSize,H=void 0===G?2:G,I=a.textareaClassName,J=a.textareaId,K=a.value,L=h(a,["autoFocus","disabled","form","highlight","ignoreTabKey","insertSpaces","maxLength","minLength","name","onBlur","onClick","onFocus","onKeyDown","onKeyUp","onValueChange","padding","placeholder","preClassName","readOnly","required","style","tabSize","textareaClassName","textareaId","value"]),M=i.useRef({stack:[],offset:-1}),N=i.useRef(null),O=i.useState(!0),P=O[0],Q=O[1],R={paddingTop:"object"==typeof A?A.top:A,paddingRight:"object"==typeof A?A.right:A,paddingBottom:"object"==typeof A?A.bottom:A,paddingLeft:"object"==typeof A?A.left:A},S=g(K),T=function(a,b){return a.substring(0,b).split("\n")},U=i.useCallback(function(a,b){void 0===b&&(b=!1);var c,e,f,g=M.current,h=g.stack,i=g.offset;if(h.length&&i>-1){M.current.stack=h.slice(0,i+1);var j=M.current.stack.length;if(j>100){var k=j-100;M.current.stack=h.slice(k,j),M.current.offset=Math.max(M.current.offset-k,0)}}var l=Date.now();if(b){var m=M.current.stack[M.current.offset];if(m&&l-m.timestamp<3e3){var n=/[^a-z0-9]([a-z0-9]+)$/i,o=null==(c=T(m.value,m.selectionStart).pop())?void 0:c.match(n),p=null==(e=T(a.value,a.selectionStart).pop())?void 0:e.match(n);if((null==o?void 0:o[1])&&(null==(f=null==p?void 0:p[1])?void 0:f.startsWith(o[1]))){M.current.stack[M.current.offset]=d(d({},a),{timestamp:l});return}}}M.current.stack.push(d(d({},a),{timestamp:l})),M.current.offset++},[]),V=i.useCallback(function(){var a=N.current;a&&U({value:a.value,selectionStart:a.selectionStart,selectionEnd:a.selectionEnd})},[U]),W=function(a){var b=N.current;b&&(b.value=a.value,b.selectionStart=a.selectionStart,b.selectionEnd=a.selectionEnd,null==y||y(a.value))},X=function(a){var b=N.current,c=M.current.stack[M.current.offset];c&&b&&(M.current.stack[M.current.offset]=d(d({},c),{selectionStart:b.selectionStart,selectionEnd:b.selectionEnd})),U(a),W(a)},Y=function(){var a=M.current,b=a.stack,c=a.offset,d=b[c-1];d&&(W(d),M.current.offset=Math.max(c-1,0))},Z=function(){var a=M.current,b=a.stack,c=a.offset,d=b[c+1];d&&(W(d),M.current.offset=Math.min(c+1,b.length-1))};return i.useEffect(function(){V()},[V]),i.useImperativeHandle(b,function(){return{get session(){return{history:M.current}},set session(session){M.current=session.history}}},[]),i.createElement("div",d({},L,{style:d(d({},m.container),F)}),i.createElement("pre",d({className:C,"aria-hidden":"true",style:d(d(d({},m.editor),m.highlight),R)},"string"==typeof S?{dangerouslySetInnerHTML:{__html:S+"<br />"}}:{children:S})),i.createElement("textarea",{ref:function(a){return N.current=a},style:d(d(d({},m.editor),m.textarea),R),className:j+(I?" ".concat(I):""),id:J,value:K,onChange:function(a){var b=a.currentTarget,c=b.value;U({value:c,selectionStart:b.selectionStart,selectionEnd:b.selectionEnd},!0),y(c)},onKeyDown:function(a){if(!w||(w(a),!a.defaultPrevented)){"Escape"===a.key&&a.currentTarget.blur();var b=a.currentTarget,c=b.value,d=b.selectionStart,e=b.selectionEnd,f=(p?" ":"	").repeat(H);if("Tab"===a.key&&!n&&P)if(a.preventDefault(),a.shiftKey){var g=T(c,d),h=g.length-1,i=T(c,e).length-1,j=c.split("\n").map(function(a,b){return b>=h&&b<=i&&a.startsWith(f)?a.substring(f.length):a}).join("\n");if(c!==j){var k=g[h];X({value:j,selectionStart:(null==k?void 0:k.startsWith(f))?d-f.length:d,selectionEnd:e-(c.length-j.length)})}}else if(d!==e){var g=T(c,d),l=g.length-1,m=T(c,e).length-1,k=g[l];X({value:c.split("\n").map(function(a,b){return b>=l&&b<=m?f+a:a}).join("\n"),selectionStart:k&&/\S/.test(k)?d+f.length:d,selectionEnd:e+f.length*(m-l+1)})}else{var o=d+f.length;X({value:c.substring(0,d)+f+c.substring(e),selectionStart:o,selectionEnd:o})}else if("Backspace"===a.key){var q=d!==e;if(c.substring(0,d).endsWith(f)&&!q){a.preventDefault();var o=d-f.length;X({value:c.substring(0,d-f.length)+c.substring(e),selectionStart:o,selectionEnd:o})}}else if("Enter"===a.key){if(d===e){var r=T(c,d).pop(),s=null==r?void 0:r.match(/^\s+/);if(null==s?void 0:s[0]){a.preventDefault();var t="\n"+s[0],o=d+t.length;X({value:c.substring(0,d)+t+c.substring(e),selectionStart:o,selectionEnd:o})}}}else if(57===a.keyCode||219===a.keyCode||222===a.keyCode||192===a.keyCode){var u=void 0;57===a.keyCode&&a.shiftKey?u=["(",")"]:219===a.keyCode?u=a.shiftKey?["{","}"]:["[","]"]:222===a.keyCode?u=a.shiftKey?['"','"']:["'","'"]:192!==a.keyCode||a.shiftKey||(u=["`","`"]),d!==e&&u&&(a.preventDefault(),X({value:c.substring(0,d)+u[0]+c.substring(d,e)+u[1]+c.substring(e),selectionStart:d,selectionEnd:e+2}))}else!a.ctrlKey||90!==a.keyCode||a.shiftKey||a.altKey?a.ctrlKey&&90===a.keyCode&&a.shiftKey&&!a.altKey?(a.preventDefault(),Z()):77===a.keyCode&&a.ctrlKey&&(a.preventDefault(),Q(function(a){return!a})):(a.preventDefault(),Y())}},onClick:u,onKeyUp:x,onFocus:v,onBlur:t,disabled:e,form:f,maxLength:q,minLength:r,name:s,placeholder:B,readOnly:D,required:E,autoFocus:c,autoCapitalize:"off",autoComplete:"off",autoCorrect:"off",spellCheck:!1,"data-gramm":!1}),i.createElement("style",{dangerouslySetInnerHTML:{__html:k}}))}),m={container:{position:"relative",textAlign:"left",boxSizing:"border-box",padding:0,overflow:"hidden"},textarea:{position:"absolute",top:0,left:0,height:"100%",width:"100%",resize:"none",color:"inherit",overflow:"hidden",MozOsxFontSmoothing:"grayscale",WebkitFontSmoothing:"antialiased",WebkitTextFillColor:"transparent"},highlight:{position:"relative",pointerEvents:"none"},editor:{margin:0,border:0,background:"none",boxSizing:"inherit",display:"inherit",fontFamily:"inherit",fontSize:"inherit",fontStyle:"inherit",fontVariantLigatures:"inherit",fontWeight:"inherit",letterSpacing:"inherit",lineHeight:"inherit",tabSize:"inherit",textIndent:"inherit",textRendering:"inherit",textTransform:"inherit",whiteSpace:"pre-wrap",wordBreak:"keep-all",overflowWrap:"break-word"}};c.default=l},35167,a=>a.a(async(b,c)=>{try{let b=await a.y("prettier/standalone");a.n(b),c()}catch(a){c(a)}},!0),10717,(a,b,c)=>{b.exports=a.x("prettier/parser-html",()=>require("prettier/parser-html"))},64199,(a,b,c)=>{var d=function(a){var b=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,c=0,d={},e={manual:a.Prism&&a.Prism.manual,disableWorkerMessageHandler:a.Prism&&a.Prism.disableWorkerMessageHandler,util:{encode:function a(b){return b instanceof f?new f(b.type,a(b.content),b.alias):Array.isArray(b)?b.map(a):b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(a){return Object.prototype.toString.call(a).slice(8,-1)},objId:function(a){return a.__id||Object.defineProperty(a,"__id",{value:++c}),a.__id},clone:function a(b,c){var d,f;switch(c=c||{},e.util.type(b)){case"Object":if(c[f=e.util.objId(b)])return c[f];for(var g in d={},c[f]=d,b)b.hasOwnProperty(g)&&(d[g]=a(b[g],c));return d;case"Array":if(c[f=e.util.objId(b)])return c[f];return d=[],c[f]=d,b.forEach(function(b,e){d[e]=a(b,c)}),d;default:return b}},getLanguage:function(a){for(;a;){var c=b.exec(a.className);if(c)return c[1].toLowerCase();a=a.parentElement}return"none"},setLanguage:function(a,c){a.className=a.className.replace(RegExp(b,"gi"),""),a.classList.add("language-"+c)},currentScript:function(){if("undefined"==typeof document)return null;if(document.currentScript&&"SCRIPT"===document.currentScript.tagName&&1)return document.currentScript;try{throw Error()}catch(d){var a=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(d.stack)||[])[1];if(a){var b=document.getElementsByTagName("script");for(var c in b)if(b[c].src==a)return b[c]}return null}},isActive:function(a,b,c){for(var d="no-"+b;a;){var e=a.classList;if(e.contains(b))return!0;if(e.contains(d))return!1;a=a.parentElement}return!!c}},languages:{plain:d,plaintext:d,text:d,txt:d,extend:function(a,b){var c=e.util.clone(e.languages[a]);for(var d in b)c[d]=b[d];return c},insertBefore:function(a,b,c,d){var f=(d=d||e.languages)[a],g={};for(var h in f)if(f.hasOwnProperty(h)){if(h==b)for(var i in c)c.hasOwnProperty(i)&&(g[i]=c[i]);c.hasOwnProperty(h)||(g[h]=f[h])}var j=d[a];return d[a]=g,e.languages.DFS(e.languages,function(b,c){c===j&&b!=a&&(this[b]=g)}),g},DFS:function a(b,c,d,f){f=f||{};var g=e.util.objId;for(var h in b)if(b.hasOwnProperty(h)){c.call(b,h,b[h],d||h);var i=b[h],j=e.util.type(i);"Object"!==j||f[g(i)]?"Array"!==j||f[g(i)]||(f[g(i)]=!0,a(i,c,h,f)):(f[g(i)]=!0,a(i,c,null,f))}}},plugins:{},highlightAll:function(a,b){e.highlightAllUnder(document,a,b)},highlightAllUnder:function(a,b,c){var d={callback:c,container:a,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};e.hooks.run("before-highlightall",d),d.elements=Array.prototype.slice.apply(d.container.querySelectorAll(d.selector)),e.hooks.run("before-all-elements-highlight",d);for(var f,g=0;f=d.elements[g++];)e.highlightElement(f,!0===b,d.callback)},highlightElement:function(b,c,d){var f=e.util.getLanguage(b),g=e.languages[f];e.util.setLanguage(b,f);var h=b.parentElement;h&&"pre"===h.nodeName.toLowerCase()&&e.util.setLanguage(h,f);var i=b.textContent,j={element:b,language:f,grammar:g,code:i};function k(a){j.highlightedCode=a,e.hooks.run("before-insert",j),j.element.innerHTML=j.highlightedCode,e.hooks.run("after-highlight",j),e.hooks.run("complete",j),d&&d.call(j.element)}if(e.hooks.run("before-sanity-check",j),(h=j.element.parentElement)&&"pre"===h.nodeName.toLowerCase()&&!h.hasAttribute("tabindex")&&h.setAttribute("tabindex","0"),!j.code){e.hooks.run("complete",j),d&&d.call(j.element);return}if(e.hooks.run("before-highlight",j),!j.grammar)return void k(e.util.encode(j.code));if(c&&a.Worker){var l=new Worker(e.filename);l.onmessage=function(a){k(a.data)},l.postMessage(JSON.stringify({language:j.language,code:j.code,immediateClose:!0}))}else k(e.highlight(j.code,j.grammar,j.language))},highlight:function(a,b,c){var d={code:a,grammar:b,language:c};if(e.hooks.run("before-tokenize",d),!d.grammar)throw Error('The language "'+d.language+'" has no grammar.');return d.tokens=e.tokenize(d.code,d.grammar),e.hooks.run("after-tokenize",d),f.stringify(e.util.encode(d.tokens),d.language)},tokenize:function(a,b){var c=b.rest;if(c){for(var d in c)b[d]=c[d];delete b.rest}var j=new h;return i(j,j.head,a),function a(b,c,d,h,j,k){for(var l in d)if(d.hasOwnProperty(l)&&d[l]){var m=d[l];m=Array.isArray(m)?m:[m];for(var n=0;n<m.length;++n){if(k&&k.cause==l+","+n)return;var o=m[n],p=o.inside,q=!!o.lookbehind,r=!!o.greedy,s=o.alias;if(r&&!o.pattern.global){var t=o.pattern.toString().match(/[imsuy]*$/)[0];o.pattern=RegExp(o.pattern.source,t+"g")}for(var u=o.pattern||o,v=h.next,w=j;v!==c.tail&&(!k||!(w>=k.reach));w+=v.value.length,v=v.next){var x,y=v.value;if(c.length>b.length)return;if(!(y instanceof f)){var z=1;if(r){if(!(x=g(u,w,b,q))||x.index>=b.length)break;var A=x.index,B=x.index+x[0].length,C=w;for(C+=v.value.length;A>=C;)C+=(v=v.next).value.length;if(C-=v.value.length,w=C,v.value instanceof f)continue;for(var D=v;D!==c.tail&&(C<B||"string"==typeof D.value);D=D.next)z++,C+=D.value.length;z--,y=b.slice(w,C),x.index-=w}else if(!(x=g(u,0,y,q)))continue;var A=x.index,E=x[0],F=y.slice(0,A),G=y.slice(A+E.length),H=w+y.length;k&&H>k.reach&&(k.reach=H);var I=v.prev;if(F&&(I=i(c,I,F),w+=F.length),function(a,b,c){for(var d=b.next,e=0;e<c&&d!==a.tail;e++)d=d.next;b.next=d,d.prev=b,a.length-=e}(c,I,z),v=i(c,I,new f(l,p?e.tokenize(E,p):E,s,E)),G&&i(c,v,G),z>1){var J={cause:l+","+n,reach:H};a(b,c,d,v.prev,w,J),k&&J.reach>k.reach&&(k.reach=J.reach)}}}}}}(a,j,b,j.head,0),function(a){for(var b=[],c=a.head.next;c!==a.tail;)b.push(c.value),c=c.next;return b}(j)},hooks:{all:{},add:function(a,b){var c=e.hooks.all;c[a]=c[a]||[],c[a].push(b)},run:function(a,b){var c=e.hooks.all[a];if(c&&c.length)for(var d,f=0;d=c[f++];)d(b)}},Token:f};function f(a,b,c,d){this.type=a,this.content=b,this.alias=c,this.length=0|(d||"").length}function g(a,b,c,d){a.lastIndex=b;var e=a.exec(c);if(e&&d&&e[1]){var f=e[1].length;e.index+=f,e[0]=e[0].slice(f)}return e}function h(){var a={value:null,prev:null,next:null},b={value:null,prev:a,next:null};a.next=b,this.head=a,this.tail=b,this.length=0}function i(a,b,c){var d=b.next,e={value:c,prev:b,next:d};return b.next=e,d.prev=e,a.length++,e}if(a.Prism=e,f.stringify=function a(b,c){if("string"==typeof b)return b;if(Array.isArray(b)){var d="";return b.forEach(function(b){d+=a(b,c)}),d}var f={type:b.type,content:a(b.content,c),tag:"span",classes:["token",b.type],attributes:{},language:c},g=b.alias;g&&(Array.isArray(g)?Array.prototype.push.apply(f.classes,g):f.classes.push(g)),e.hooks.run("wrap",f);var h="";for(var i in f.attributes)h+=" "+i+'="'+(f.attributes[i]||"").replace(/"/g,"&quot;")+'"';return"<"+f.tag+' class="'+f.classes.join(" ")+'"'+h+">"+f.content+"</"+f.tag+">"},!a.document)return a.addEventListener&&(e.disableWorkerMessageHandler||a.addEventListener("message",function(b){var c=JSON.parse(b.data),d=c.language,f=c.code,g=c.immediateClose;a.postMessage(e.highlight(f,e.languages[d],d)),g&&a.close()},!1)),e;var j=e.util.currentScript();function k(){e.manual||e.highlightAll()}if(j&&(e.filename=j.src,j.hasAttribute("data-manual")&&(e.manual=!0)),!e.manual){var l=document.readyState;"loading"===l||"interactive"===l&&j&&j.defer?document.addEventListener("DOMContentLoaded",k):window.requestAnimationFrame?window.requestAnimationFrame(k):window.setTimeout(k,16)}return e}("undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{});b.exports&&(b.exports=d),a.g.Prism=d,d.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},d.languages.markup.tag.inside["attr-value"].inside.entity=d.languages.markup.entity,d.languages.markup.doctype.inside["internal-subset"].inside=d.languages.markup,d.hooks.add("wrap",function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))}),Object.defineProperty(d.languages.markup.tag,"addInlined",{value:function(a,b){var c={};c["language-"+b]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:d.languages[b]},c.cdata=/^<!\[CDATA\[|\]\]>$/i;var e={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:c}};e["language-"+b]={pattern:/[\s\S]+/,inside:d.languages[b]};var f={};f[a]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return a}),"i"),lookbehind:!0,greedy:!0,inside:e},d.languages.insertBefore("markup","cdata",f)}}),Object.defineProperty(d.languages.markup.tag,"addAttribute",{value:function(a,b){d.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+a+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[b,"language-"+b],inside:d.languages[b]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),d.languages.html=d.languages.markup,d.languages.mathml=d.languages.markup,d.languages.svg=d.languages.markup,d.languages.xml=d.languages.extend("markup",{}),d.languages.ssml=d.languages.xml,d.languages.atom=d.languages.xml,d.languages.rss=d.languages.xml,function(a){var b=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;a.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+b.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+b.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+b.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+b.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:b,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},a.languages.css.atrule.inside.rest=a.languages.css;var c=a.languages.markup;c&&(c.tag.addInlined("style","css"),c.tag.addAttribute("style","css"))}(d),d.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},d.languages.javascript=d.languages.extend("clike",{"class-name":[d.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source)+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),d.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,d.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:d.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:d.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:d.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:d.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:d.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),d.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:d.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),d.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),d.languages.markup&&(d.languages.markup.tag.addInlined("script","javascript"),d.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),d.languages.js=d.languages.javascript,function(){if(void 0!==d&&"undefined"!=typeof document){Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var a={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},b="data-src-status",c="loading",e="loaded",f="pre[data-src]:not(["+b+'="'+e+'"]):not(['+b+'="'+c+'"])';d.hooks.add("before-highlightall",function(a){a.selector+=", "+f}),d.hooks.add("before-sanity-check",function(g){var h=g.element;if(h.matches(f)){g.code="",h.setAttribute(b,c);var i,j,k,l,m=h.appendChild(document.createElement("CODE"));m.textContent="Loading…";var n=h.getAttribute("data-src"),o=g.language;if("none"===o){var p=(/\.(\w+)$/.exec(n)||[,"none"])[1];o=a[p]||p}d.util.setLanguage(m,o),d.util.setLanguage(h,o);var q=d.plugins.autoloader;q&&q.loadLanguages(o),i=n,j=function(a){h.setAttribute(b,e);var c=function(a){var b=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(a||"");if(b){var c=Number(b[1]),d=b[2],e=b[3];return d?e?[c,Number(e)]:[c,void 0]:[c,c]}}(h.getAttribute("data-range"));if(c){var f=a.split(/\r\n?|\n/g),g=c[0],i=null==c[1]?f.length:c[1];g<0&&(g+=f.length),g=Math.max(0,Math.min(g-1,f.length)),i<0&&(i+=f.length),i=Math.max(0,Math.min(i,f.length)),a=f.slice(g,i).join("\n"),h.hasAttribute("data-start")||h.setAttribute("data-start",String(g+1))}m.textContent=a,d.highlightElement(m)},k=function(a){h.setAttribute(b,"failed"),m.textContent=a},(l=new XMLHttpRequest).open("GET",i,!0),l.onreadystatechange=function(){var a;4==l.readyState&&(l.status<400&&l.responseText?j(l.responseText):l.status>=400?k((a=l.status,"✖ Error "+a+" while fetching file: "+l.statusText)):k("✖ Error: File does not exist or is empty"))},l.send(null)}}),d.plugins.fileHighlight={highlight:function(a){for(var b,c=(a||document).querySelectorAll(f),e=0;b=c[e++];)d.highlightElement(b)}};var g=!1;d.fileHighlight=function(){g||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),g=!0),d.plugins.fileHighlight.highlight.apply(this,arguments)}}}()},70939,(a,b,c)=>{Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup,Prism.hooks.add("wrap",function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))}),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(a,b){var c={};c["language-"+b]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[b]},c.cdata=/^<!\[CDATA\[|\]\]>$/i;var d={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:c}};d["language-"+b]={pattern:/[\s\S]+/,inside:Prism.languages[b]};var e={};e[a]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return a}),"i"),lookbehind:!0,greedy:!0,inside:d},Prism.languages.insertBefore("markup","cdata",e)}}),Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(a,b){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+a+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[b,"language-"+b],inside:Prism.languages[b]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml},79085,(a,b,c)=>{!function(a){var b=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;a.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+b.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+b.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+b.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+b.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:b,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},a.languages.css.atrule.inside.rest=a.languages.css;var c=a.languages.markup;c&&(c.tag.addInlined("style","css"),c.tag.addAttribute("style","css"))}(Prism)},3067,(a,b,c)=>{Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source)+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),Prism.languages.js=Prism.languages.javascript},702,(a,b,c)=>{!function(a){var b=a.util.clone(a.languages.javascript),c=/(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source,d=/(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source,e=/(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;function f(a,b){return RegExp(a=a.replace(/<S>/g,function(){return c}).replace(/<BRACES>/g,function(){return d}).replace(/<SPREAD>/g,function(){return e}),b)}e=f(e).source,a.languages.jsx=a.languages.extend("markup",b),a.languages.jsx.tag.pattern=f(/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source),a.languages.jsx.tag.inside.tag.pattern=/^<\/?[^\s>\/]*/,a.languages.jsx.tag.inside["attr-value"].pattern=/=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/,a.languages.jsx.tag.inside.tag.inside["class-name"]=/^[A-Z]\w*(?:\.[A-Z]\w*)*$/,a.languages.jsx.tag.inside.comment=b.comment,a.languages.insertBefore("inside","attr-name",{spread:{pattern:f(/<SPREAD>/.source),inside:a.languages.jsx}},a.languages.jsx.tag),a.languages.insertBefore("inside","special-attr",{script:{pattern:f(/=<BRACES>/.source),alias:"language-javascript",inside:{"script-punctuation":{pattern:/^=(?=\{)/,alias:"punctuation"},rest:a.languages.jsx}}},a.languages.jsx.tag);var g=function(a){return a?"string"==typeof a?a:"string"==typeof a.content?a.content:a.content.map(g).join(""):""},h=function(b){for(var c=[],d=0;d<b.length;d++){var e=b[d],f=!1;if("string"!=typeof e&&("tag"===e.type&&e.content[0]&&"tag"===e.content[0].type?"</"===e.content[0].content[0].content?c.length>0&&c[c.length-1].tagName===g(e.content[0].content[1])&&c.pop():"/>"===e.content[e.content.length-1].content||c.push({tagName:g(e.content[0].content[1]),openedBraces:0}):c.length>0&&"punctuation"===e.type&&"{"===e.content?c[c.length-1].openedBraces++:c.length>0&&c[c.length-1].openedBraces>0&&"punctuation"===e.type&&"}"===e.content?c[c.length-1].openedBraces--:f=!0),(f||"string"==typeof e)&&c.length>0&&0===c[c.length-1].openedBraces){var i=g(e);d<b.length-1&&("string"==typeof b[d+1]||"plain-text"===b[d+1].type)&&(i+=g(b[d+1]),b.splice(d+1,1)),d>0&&("string"==typeof b[d-1]||"plain-text"===b[d-1].type)&&(i=g(b[d-1])+i,b.splice(d-1,1),d--),b[d]=new a.Token("plain-text",i,null,i)}e.content&&"string"!=typeof e.content&&h(e.content)}};a.hooks.add("after-tokenize",function(a){("jsx"===a.language||"tsx"===a.language)&&h(a.tokens)})}(Prism)},50335,a=>a.a(async(b,c)=>{try{a.s(["default",()=>l]);var d=a.i(413),e=a.i(56583),f=a.i(83572),g=a.i(14909),h=a.i(35167),i=a.i(10717),j=a.i(64199);a.i(70939),a.i(79085),a.i(3067),a.i(702);var k=b([h]);function l({code:a,setCode:b,runCode:c,formatCode:k,onResizeStart:l,framework:m,setFramework:n}){let[o,p]=(0,f.useState)(!1),[q,r]=(0,f.useState)([]),s=(a,b="success")=>{let c=Math.random().toString(36).substr(2,9);r(d=>[...d,{id:c,message:a,type:b}]),setTimeout(()=>{r(a=>a.filter(a=>a.id!==c))},4e3)},t=async()=>{try{let c;p(!0),c="react"===m?(a=>{try{return a.replace(/(>)(<)(\w)/g,"$1\n$2$3").replace(/(>)(<)(\/)/g,"$1\n$2$3").split("\n").map(a=>a.includes("</")&&!a.includes("/>")||!a.trim().startsWith("<")||a.trim().startsWith("</")||a.includes("/>")?a:"  "+a).join("\n")}catch(b){return console.error("React formatting error:",b),a}})(String(a||"")):await h.default.format(String(a||""),{parser:"html",plugins:[i.default],printWidth:80,tabWidth:2,useTabs:!1}),b(c),s("Code formatted successfully")}catch(a){console.error("Formatting failed:",a),s("Formatting failed. Check your syntax.","error")}finally{p(!1)}},u=async()=>{try{await navigator.clipboard.writeText(String(a||"")),s("Code copied to clipboard!")}catch(a){s("Failed to copy code","error"),console.error("Copy failed:",a)}},v=(0,f.useMemo)(()=>{let b=String(a||"").split("\n").length;return Array.from({length:b},(a,b)=>b+1)},[a]),w=String(a||"").length,x=String(a||"").split("\n").length;return(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 panel editor-panel relative",children:[l&&(0,d.jsx)("div",{onMouseDown:l,className:"jsx-4d2cc57f6aaef22 absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-interactive-accent/20 transition-colors duration-200 rounded"}),(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 panel-header",children:[(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-3",children:["react"===m?(0,d.jsx)("img",{src:"./react.svg",alt:"React",className:"jsx-4d2cc57f6aaef22 w-8 h-8"}):(0,d.jsx)("img",{src:"./html5.svg",alt:"HTML5",className:"jsx-4d2cc57f6aaef22 w-8 h-8"}),(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-3",children:[(0,d.jsx)("button",{onClick:()=>{n("html"===m?"react":"html")},style:{backgroundColor:"var(--surface-secondary)"},className:"jsx-4d2cc57f6aaef22 relative w-16 h-8 rounded-full p-1 transition-colors duration-200 border-2 border-border-primary focus:outline-none focus:ring-2 focus:ring-interactive-accent focus:ring-opacity-50",children:(0,d.jsx)("div",{style:{left:"html"===m?"4px":"36px"},className:"jsx-4d2cc57f6aaef22 absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-200 flex items-center justify-center",children:"html"===m?(0,d.jsx)("img",{src:"./html5.svg",alt:"HTML5",className:"jsx-4d2cc57f6aaef22 w-3 h-3"}):(0,d.jsx)("img",{src:"./react.svg",alt:"React",className:"jsx-4d2cc57f6aaef22 w-3 h-3"})})}),(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex flex-col items-start",children:[(0,d.jsx)("span",{className:"jsx-4d2cc57f6aaef22 text-lg font-semibold tracking-tight",children:"react"===m?"React":"HTML"}),(0,d.jsx)("span",{className:"jsx-4d2cc57f6aaef22 text-xs text-text-tertiary",children:"react"===m?"JSX":"HTML5"})]})]})]}),(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex gap-2",children:[(0,d.jsx)("button",{onClick:t,disabled:o,className:`jsx-4d2cc57f6aaef22 btn ${o?"btn-secondary loading":"btn-outline"} btn-sm`,children:o?"Formatting...":(0,d.jsx)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-2",children:"Format"})}),(0,d.jsx)("button",{onClick:u,className:"jsx-4d2cc57f6aaef22 btn btn-outline btn-sm",children:(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-2",children:[(0,d.jsx)("svg",{fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",className:"jsx-4d2cc57f6aaef22 w-4 h-4",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",className:"jsx-4d2cc57f6aaef22"})}),"Copy"]})}),(0,d.jsx)("button",{onClick:()=>{try{let b=new Blob([String(a||"")],{type:"react"===m?"text/jsx":"text/html"}),c=URL.createObjectURL(b),d=document.createElement("a");d.href=c,d.download=`component.${"react"===m?"jsx":"html"}`,document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(c),s("Code exported successfully")}catch(a){s("Export failed","error")}},className:"jsx-4d2cc57f6aaef22 btn btn-outline btn-sm",children:(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-2",children:[(0,d.jsx)("svg",{fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",className:"jsx-4d2cc57f6aaef22 w-4 h-4",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10",className:"jsx-4d2cc57f6aaef22"})}),"Export"]})}),(0,d.jsx)("button",{onClick:()=>{window.confirm("Are you sure you want to clear the editor?")&&(b(""),s("Editor cleared","warning"))},className:"jsx-4d2cc57f6aaef22 btn btn-danger btn-sm",children:(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-2",children:[(0,d.jsx)("svg",{fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",className:"jsx-4d2cc57f6aaef22 w-4 h-4",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",className:"jsx-4d2cc57f6aaef22"})}),"Clear"]})})]})]}),(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex flex-1 overflow-auto bg-surface-primary rounded-lg border border-border-primary",children:[(0,d.jsx)("div",{className:"jsx-4d2cc57f6aaef22 bg-surface-secondary text-text-tertiary text-right pr-4 pl-3 py-4 select-none border-r border-border-primary font-mono text-sm",children:v.map(a=>(0,d.jsx)("div",{style:{lineHeight:"1.5em"},className:"jsx-4d2cc57f6aaef22 h-6 leading-6 hover:text-text-secondary transition-colors",children:a},a))}),(0,d.jsx)("div",{className:"jsx-4d2cc57f6aaef22 flex-1 relative",children:(0,d.jsx)(g.default,{value:String(a||""),onValueChange:a=>b(String(a)),highlight:a=>((a,b)=>{try{if("react"===b)return j.default.highlight(String(a||""),j.default.languages.jsx,"jsx");return j.default.highlight(String(a||""),j.default.languages.html,"html")}catch{return String(a||"")}})(a,m),padding:16,style:{fontFamily:'"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',fontSize:14,backgroundColor:"var(--surface-primary)",color:"var(--text-primary)",minHeight:"100%",lineHeight:1.5,flex:1},textareaClassName:"editor-textarea",preClassName:"editor-pre"})})]}),(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex justify-between items-center px-4 py-2 text-xs text-text-tertiary border-t border-border-primary bg-surface-secondary rounded-b-lg mt-2",children:[(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-4",children:[(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-2",children:[(0,d.jsx)("svg",{fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",className:"jsx-4d2cc57f6aaef22 w-3.5 h-3.5",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",className:"jsx-4d2cc57f6aaef22"})}),(0,d.jsxs)("span",{className:"jsx-4d2cc57f6aaef22",children:[x," ",1===x?"line":"lines"]})]}),(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-2",children:[(0,d.jsx)("svg",{fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",className:"jsx-4d2cc57f6aaef22 w-3.5 h-3.5",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",className:"jsx-4d2cc57f6aaef22"})}),(0,d.jsxs)("span",{className:"jsx-4d2cc57f6aaef22",children:[w," ",1===w?"character":"characters"]})]})]}),(0,d.jsxs)("div",{className:"jsx-4d2cc57f6aaef22 flex items-center gap-2 text-text-muted",children:[(0,d.jsx)("svg",{fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",className:"jsx-4d2cc57f6aaef22 w-3.5 h-3.5",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z",className:"jsx-4d2cc57f6aaef22"})}),(0,d.jsx)("span",{className:"jsx-4d2cc57f6aaef22",children:"react"===m?"JSX":"HTML"})]})]}),(0,d.jsx)("div",{className:"jsx-4d2cc57f6aaef22 fixed top-4 right-4 z-50 space-y-2",children:q.map(a=>(0,d.jsxs)("div",{className:`jsx-4d2cc57f6aaef22 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transform transition-all duration-300 animate-in slide-in-from-right-8 ${"success"===a.type?"bg-interactive-success/10 border-interactive-success/20 text-interactive-success":"error"===a.type?"bg-interactive-danger/10 border-interactive-danger/20 text-interactive-danger":"bg-interactive-warning/10 border-interactive-warning/20 text-interactive-warning"}`,children:[(0,d.jsx)("div",{className:`jsx-4d2cc57f6aaef22 w-2 h-2 rounded-full ${"success"===a.type?"bg-interactive-success":"error"===a.type?"bg-interactive-danger":"bg-interactive-warning"}`}),(0,d.jsx)("span",{className:"jsx-4d2cc57f6aaef22 text-sm font-medium",children:a.message}),(0,d.jsx)("button",{onClick:()=>r(b=>b.filter(b=>b.id!==a.id)),className:"jsx-4d2cc57f6aaef22 text-current hover:opacity-70 transition-opacity",children:(0,d.jsx)("svg",{fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",className:"jsx-4d2cc57f6aaef22 w-4 h-4",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12",className:"jsx-4d2cc57f6aaef22"})})})]},a.id))}),(0,d.jsx)(e.default,{id:"4d2cc57f6aaef22",children:".editor-pre,.editor-textarea{fontSize:14px!important;white-space:pre!important;word-wrap:normal!important;overflow-wrap:normal!important;tab-size:2!important;margin:0!important;padding:16px!important;font-family:Fira Code,JetBrains Mono,Cascadia Code,monospace!important;line-height:1.5!important}.editor-pre{background:var(--surface-primary)!important;color:var(--text-primary)!important}.editor-textarea{caret-color:var(--interactive-accent)!important;resize:none!important;background:0 0!important;border:none!important;outline:none!important;width:100%!important;height:100%!important;position:absolute!important;inset:0!important}.react-simple-code-editor{min-height:100%!important;position:relative!important;overflow:auto!important}.react-simple-code-editor textarea{caret-color:var(--interactive-accent)!important;background:0 0!important;border:none!important;outline:none!important;animation:1.2s steps(2,start) infinite cursor-blink!important}.react-simple-code-editor pre{pointer-events:none!important;margin:0!important;padding:16px!important;overflow:hidden!important}@keyframes cursor-blink{0%,50%{opacity:1}51%,to{opacity:0}}.animate-in{animation-duration:.3s;animation-timing-function:cubic-bezier(.4,0,.2,1)}.slide-in-from-right-8{animation-name:slideInFromRight}@keyframes slideInFromRight{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}.token.comment{color:#6a737d}.token.punctuation{color:var(--text-primary)}.token.tag{color:#e06c75}.token.attr-name{color:#d19a66}.token.attr-value{color:#98c379}.token.keyword{color:#d73a49}.token.function{color:#6f42c1}.token.selector{color:#32a852}.token.property{color:#22863a}.token.string{color:#032f62}.token.operator{color:#d73a49}.token.number{color:#005cc5}.token.boolean{color:#d73a49}"})]})}[h]=k.then?(await k)():k,c()}catch(a){c(a)}},!1),27185,a=>{"use strict";a.s(["default",()=>i],27185);var b=a.i(413),c=a.i(83572);function d({width:a=40,height:d=40,x:e=-1,y:f=-1,strokeDasharray:g="0",squares:h,className:i="",...j}){let k=(0,c.useId)();return(0,b.jsxs)("svg",{"aria-hidden":"true",className:`pointer-events-none absolute inset-0 h-full w-full fill-gray-400/10 stroke-neutral-700 -z-10 ${i}`,...j,children:[(0,b.jsx)("defs",{children:(0,b.jsx)("pattern",{id:k,width:a,height:d,patternUnits:"userSpaceOnUse",x:e,y:f,children:(0,b.jsx)("path",{d:`M.5 ${d}V.5H${a}`,fill:"none",strokeDasharray:g})})}),(0,b.jsx)("rect",{width:"100%",height:"100%",strokeWidth:0,fill:`url(#${k})`}),h&&(0,b.jsx)("svg",{x:e,y:f,className:"overflow-visible",children:h.map(([c,e])=>(0,b.jsx)("rect",{strokeWidth:"0",width:a-1,height:d-1,x:c*a+1,y:e*d+1},`${c}-${e}`))})]})}var e=a.i(47118);let f=(0,e.default)("smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]),g=(0,e.default)("tablet",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["line",{x1:"12",x2:"12.01",y1:"18",y2:"18",key:"1dp563"}]]),h=(0,e.default)("monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);function i({code:a,onResizeStart:e,framework:i}){let j=(0,c.useRef)(null),k=(0,c.useRef)(null),[l,m]=(0,c.useState)(!1),[n,o]=(0,c.useState)(!1),[p,q]=(0,c.useState)(!1),[r,s]=(0,c.useState)("desktop"),[t,u]=(0,c.useState)(!1),[v,w]=(0,c.useState)([]),[x,y]=(0,c.useState)(!1),z=(a,b)=>{if("react"===b){let b=a.trim(),c=b.includes("function")||b.includes("const")||b.includes("=>"),d=b.includes("class")&&b.includes("extends"),e=b.includes("<")&&b.includes(">"),f=b.includes("ReactDOM.render")||b.includes("root.render"),g=b;if(!f&&(e||c||d)){let a="App",c=b.match(/function\s+(\w+)/);if(c)a=c[1];else{let c=b.match(/(?:const|let|var)\s+(\w+)\s*=/);c&&(a=c[1])}g=`
          ${b}
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<${a} />);
        `}else f||(g=`
          function App() {
            return (
              <div style={{
                padding: '20px', fontFamily: 'system-ui', color: '#333',
                background: '#f5f5f5', borderRadius: '8px', maxWidth: '600px', margin: '0 auto'
              }}>
                <h2 style={{marginBottom:'16px', color:'#1976d2'}}>React Preview</h2>
                <p>Your React code is being processed. Include a function component returning JSX.</p>
                <pre style={{
                  whiteSpace: 'pre-wrap', background:'#f8f8f8', padding:'10px', borderRadius:'4px'
                }}>${b.substring(0,500)}${b.length>500?"...":""}</pre>
              </div>
            );
          }
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<App />);
        `);return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            *{margin:0;padding:0;box-sizing:border-box;}
            body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#333;line-height:1.6;background:#fff;}
            #root{width:100%;min-height:100vh;}
            .loading{display:flex;align-items:center;justify-content:center;min-height:200px;color:#666;font-size:16px;}
            .error{color:#d32f2f;padding:20px;border:1px solid #f44336;border-radius:8px;background:#ffebee;margin:20px;}
            .error pre{white-space:pre-wrap;margin-top:10px;font-size:12px;background:rgba(0,0,0,0.05);padding:10px;border-radius:4px;}
          </style>
        </head>
        <body>
          <div id="root"><div class="loading">Loading React preview...</div></div>
          <script type="text/babel">
            (function(){
              try { ${g} } 
              catch(e) {
                const root = document.getElementById('root');
                if(root){ root.innerHTML='<div class="error"><h3>React Error:</h3><pre>'+e.stack+'</pre></div>'; }
              }
            })();
          </script>
        </body>
        </html>
      `}return`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;margin:0;padding:0;min-height:100vh;background:#fff;line-height:1.6;}
          *{box-sizing:border-box;}
          img{max-width:100%;height:auto;display:block;}
          a{color:#1976d2;text-decoration:none;} a:hover{text-decoration:underline;}
        </style>
      </head>
      <body>${a}</body>
      </html>
    `},A=(a,b="success")=>{let c=Math.random().toString(36).substr(2,9);w(d=>[...d,{id:c,message:a,type:b}]),setTimeout(()=>w(a=>a.filter(a=>a.id!==c)),3e3)},B=a=>{j.current&&(y(!1),j.current.srcdoc=a)};(0,c.useEffect)(()=>{B(z(a,i))},[a,i]);let C=async()=>{try{await navigator.clipboard.writeText(a),A("Code copied to clipboard!")}catch{A("Failed to copy code","error")}};(0,c.useEffect)(()=>{let a=()=>q(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",a),()=>document.removeEventListener("fullscreenchange",a)},[]);let D={mobile:{width:"375px",height:"667px"},tablet:{width:"768px",height:"1024px"},desktop:{width:"100%",height:"100%"}},E={mobile:f,tablet:g,desktop:h};return(0,b.jsxs)("div",{ref:k,className:"panel preview-panel relative flex flex-col h-full bg-surface-primary",children:[e&&(0,b.jsx)("div",{className:"absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-interactive-accent/20 transition-colors duration-200 rounded",onMouseDown:e}),(0,b.jsxs)("div",{className:"panel-header flex justify-between items-center p-4 border-b border-border-primary bg-surface-secondary",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("h2",{className:"text-lg font-semibold tracking-tight text-text-primary",children:"Preview"}),(0,b.jsx)("span",{className:"text-sm text-text-tertiary bg-surface-tertiary px-2 py-1 rounded border border-border-primary",children:"react"===i?"React":"HTML"})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)("button",{className:"btn btn-outline btn-sm",onClick:()=>{u(!0),B(z(a,i)),setTimeout(()=>{u(!1),A("Preview refreshed")},600)},disabled:t,children:t?"Refreshing...":"Refresh"}),(0,b.jsx)("button",{className:`btn btn-sm ${l?"btn-accent":"btn-outline"}`,onClick:()=>m(!l),children:l?"Hide Code":"Show Code"}),(0,b.jsx)("button",{className:`btn btn-sm ${p?"btn-warning":"btn-outline"}`,onClick:()=>{k.current&&(p?document.exitFullscreen?.():k.current.requestFullscreen?.())},children:p?"Exit Full":"Fullscreen"}),(0,b.jsx)("button",{className:`btn btn-sm ${n?"btn-accent":"btn-outline"}`,onClick:()=>o(a=>!a),children:n?"Hide Grid":"Show Grid"})]})]}),l&&(0,b.jsxs)("div",{className:"bg-surface-primary border border-border-primary rounded-lg m-4 overflow-hidden transition-all duration-300",children:[(0,b.jsxs)("div",{className:"flex justify-between items-center p-3 border-b border-border-primary bg-surface-secondary",children:[(0,b.jsx)("span",{className:"font-semibold text-sm text-text-primary",children:"Component Code"}),(0,b.jsx)("button",{className:"btn btn-success btn-sm",onClick:C,children:"Copy Code"})]}),(0,b.jsx)("div",{className:"p-4 max-h-48 overflow-auto bg-surface-tertiary",children:(0,b.jsx)("pre",{className:"m-0 text-sm font-mono text-text-primary whitespace-pre-wrap leading-6",children:(0,b.jsx)("code",{children:a})})})]}),(0,b.jsx)("div",{className:"flex-1 relative min-h-0 flex justify-center items-start p-4 overflow-auto bg-surface-secondary",children:(0,b.jsxs)("div",{className:"shadow-xl transition-all duration-500 ease-out bg-white rounded-xl overflow-hidden border border-border-primary relative",style:{width:D[r].width,height:D[r].height,maxHeight:"100%"},children:[n&&(0,b.jsx)(d,{width:40,height:40,stroke:"rgba(0,0,0,0.05)",className:"absolute inset-0 z-10 pointer-events-none"}),"desktop"!==r&&(0,b.jsx)("div",{className:"absolute inset-0 pointer-events-none border-8 border-gray-800 rounded-xl z-20"}),(0,b.jsx)("iframe",{ref:j,className:"w-full h-full border-none bg-white relative z-0",title:"Live Preview",sandbox:"allow-same-origin allow-scripts",style:{visibility:x?"visible":"hidden"},onLoad:()=>setTimeout(()=>y(!0),100)})]})}),(0,b.jsx)("div",{className:"flex justify-center items-center gap-2 p-3 border-t border-border-primary bg-surface-secondary",children:["mobile","tablet","desktop"].map(a=>{let c=r===a,d=E[a];return(0,b.jsxs)("button",{onClick:()=>s(a),className:`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${c?"bg-interactive-accent text-white shadow-sm":"bg-surface-primary text-text-primary hover:bg-surface-tertiary"}`,children:[(0,b.jsx)(d,{className:"w-4 h-4"}),(0,b.jsx)("span",{className:"capitalize",children:a})]},a)})}),(0,b.jsx)("div",{className:"fixed top-4 right-4 z-50 space-y-2",children:v.map(a=>(0,b.jsxs)("div",{className:`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${"success"===a.type?"bg-interactive-success/10 border-interactive-success/20 text-interactive-success":"bg-interactive-danger/10 border-interactive-danger/20 text-interactive-danger"}`,children:[(0,b.jsx)("div",{className:`w-2 h-2 rounded-full ${"success"===a.type?"bg-interactive-success":"bg-interactive-danger"}`}),(0,b.jsx)("span",{className:"text-sm font-medium",children:a.message}),(0,b.jsx)("button",{onClick:()=>w(b=>b.filter(b=>b.id!==a.id)),className:"text-current hover:opacity-70 transition-opacity",children:(0,b.jsx)("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]},a.id))})]})}},94668,a=>{"use strict";a.s(["default",()=>d]);var b=a.i(413),c=a.i(56583);function d(){return(0,b.jsxs)("div",{className:"jsx-1161229dee982e84 status-bar",children:[(0,b.jsxs)("a",{href:"https://studio.jessejesse.com",target:"_blank",rel:"noopener noreferrer",className:"jsx-1161229dee982e84 group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-surface-tertiary border border-transparent hover:border-interactive-accent/30",children:[(0,b.jsxs)("div",{className:"jsx-1161229dee982e84 relative",children:[(0,b.jsx)("div",{className:"jsx-1161229dee982e84 w-2 h-2 bg-interactive-accent rounded-full animate-ping absolute -top-0.5 -right-0.5"}),(0,b.jsx)("div",{className:"jsx-1161229dee982e84 w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white",children:(0,b.jsx)("img",{src:"./icon-512.png",alt:"Studio Logo",className:"jsx-1161229dee982e84 w-full h-full object-cover"})})]}),(0,b.jsxs)("div",{className:"jsx-1161229dee982e84 flex flex-col",children:[(0,b.jsx)("span",{className:"jsx-1161229dee982e84 font-semibold text-text-primary group-hover:text-interactive-accent transition-colors",children:"Web Studio"}),(0,b.jsx)("span",{className:"jsx-1161229dee982e84 text-xs text-text-tertiary group-hover:text-text-secondary transition-colors",children:"studio.JesseJesse.com"})]})]}),(0,b.jsxs)("a",{href:"https://github.com/sudo-self/web-studio",target:"_blank",rel:"noopener noreferrer",className:"jsx-1161229dee982e84 group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-surface-tertiary border border-transparent hover:border-interactive-accent/30",children:[(0,b.jsxs)("div",{className:"jsx-1161229dee982e84 flex flex-col items-end",children:[(0,b.jsx)("span",{className:"jsx-1161229dee982e84 font-semibold text-text-primary group-hover:text-interactive-accent transition-colors",children:"GitHub"}),(0,b.jsxs)("span",{className:"jsx-1161229dee982e84 text-xs text-text-tertiary group-hover:text-text-secondary transition-colors flex items-center gap-1",children:[(0,b.jsx)("svg",{fill:"currentColor",viewBox:"0 0 24 24",className:"jsx-1161229dee982e84 w-3 h-3",children:(0,b.jsx)("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",className:"jsx-1161229dee982e84"})}),"@sudo-self"]})]}),(0,b.jsx)("div",{className:"jsx-1161229dee982e84 w-8 h-8 bg-surface-primary rounded-lg flex items-center justify-center border border-border-primary group-hover:border-interactive-accent/50 transition-colors",children:(0,b.jsx)("svg",{fill:"currentColor",viewBox:"0 0 24 24",className:"jsx-1161229dee982e84 w-5 h-5 text-text-tertiary group-hover:text-interactive-accent transition-colors",children:(0,b.jsx)("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",className:"jsx-1161229dee982e84"})})})]}),(0,b.jsx)(c.default,{id:"1161229dee982e84",children:'.status-bar.jsx-1161229dee982e84{background:var(--surface-primary);border-top:1px solid var(--border-primary);z-index:10;justify-content:space-between;align-items:center;height:64px;padding:0 24px;display:flex;position:relative}.status-bar.jsx-1161229dee982e84:before{content:"";background:linear-gradient(90deg,transparent,var(--interactive-accent),transparent);opacity:.6;height:1px;position:absolute;top:0;left:0;right:0}@media (width<=768px){.status-bar.jsx-1161229dee982e84{height:56px;padding:0 16px}.status-bar.jsx-1161229dee982e84>.jsx-1161229dee982e84{padding:8px 12px}.status-bar.jsx-1161229dee982e84 span.jsx-1161229dee982e84{font-size:12px}}'})]})}},71413,a=>{"use strict";a.s(["default",()=>j],71413);var b=a.i(413),c=a.i(83572),d=a.i(87464),e=a.i(47118);let f=(0,e.default)("cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]),g=(0,e.default)("wifi",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]]),h=(0,e.default)("wifi-off",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);var i=a.i(19403);function j({isOpen:a,onClose:e}){let{settings:j,askAI:k}=(0,i.useSettings)(),[l,m]=(0,c.useState)(!1),[n,o]=(0,c.useState)("unknown"),p=async()=>{m(!0),o("unknown");try{let a=await k("Test connection");a&&"Error contacting AI"!==a?o("connected"):o("disconnected")}catch{o("disconnected")}finally{m(!1)}};return a?(0,b.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",children:(0,b.jsxs)("div",{className:"bg-surface-primary rounded-xl p-6 w-96 max-w-full border border-border-primary shadow-lg",children:[(0,b.jsxs)("div",{className:"flex justify-between items-center mb-5",children:[(0,b.jsxs)("h2",{className:"text-lg font-semibold flex items-center gap-2 text-text-primary",children:[(0,b.jsx)(f,{size:20}),"AI Settings"]}),(0,b.jsx)("button",{onClick:e,className:"text-text-tertiary hover:text-text-primary transition-colors",children:(0,b.jsx)(d.X,{size:20})})]}),(0,b.jsxs)("div",{className:"space-y-5",children:[(0,b.jsxs)("div",{className:`flex items-center gap-2 text-sm ${"connected"===n?"text-interactive-success":"disconnected"===n?"text-interactive-danger":"text-yellow-600"}`,children:["connected"===n?(0,b.jsx)(g,{size:16}):"disconnected"===n?(0,b.jsx)(h,{size:16}):(0,b.jsx)(g,{size:16}),(0,b.jsx)("span",{children:"connected"===n?"Connected to AI":"disconnected"===n?"Connection Failed":"Unknown"})]}),(0,b.jsx)("button",{onClick:p,disabled:l,className:"w-full bg-interactive-accent hover:bg-interactive-accent/90 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors",children:l?"Testing...":"Test Connection"}),(0,b.jsxs)("div",{className:"text-xs text-text-tertiary bg-surface-tertiary px-3 py-2 rounded-lg",children:["Endpoint: ",j.aiEndpoint.replace("http://","")]}),(0,b.jsx)("button",{onClick:e,className:"w-full bg-surface-secondary border border-border-primary hover:bg-surface-tertiary text-text-primary py-2 px-4 rounded-lg text-sm font-medium transition-colors",children:"Close"})]})]})}):null}},23323,a=>a.a(async(b,c)=>{try{a.s(["default",()=>m]);var d=a.i(413),e=a.i(56583),f=a.i(83572),g=a.i(68299),h=a.i(50335),i=a.i(27185),j=a.i(94668),k=a.i(71413),l=b([h]);function m(){let[a,b]=(0,f.useState)("html"),c=`<!-- Welcome to studio.jessejesse.com -->
<div class="welcome-container">
  <div class="welcome-content">
    <!-- Main Header -->
    <header class="welcome-header">
      <div class="logo-container">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h1 class="welcome-title">Your Awesome Website</h1>
      </div>
      <p class="welcome-subtitle">Ready-made components, lightning-fast AI builder, direct code editor, and instant GitHub publishing.</p>
    </header>

    <!-- Get Started Button -->
    <button class="welcome-btn" onclick="alert('Let\\'s start building!')">
      <span class="btn-content">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Start Building
      </span>
    </button>

    <!-- Feature Navigation -->
    <nav class="feature-nav">
      <a href="#" class="feature-link">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <span class="feature-text">Components</span>
      </a>

      <a href="#" class="feature-link">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span class="feature-text">AI Builder</span>
      </a>

      <a href="#" class="feature-link">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <span class="feature-text">Code Editor</span>
      </a>
    </nav>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">50+</div>
        <div class="stat-label">Components</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">AI</div>
        <div class="stat-label">Powered</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">100%</div>
        <div class="stat-label">Customizable</div>
      </div>
    </div>
  </div>

  <style>
    .welcome-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 3rem 2rem;
      background: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .welcome-content {
      max-width: 600px;
      text-align: center;
      animation: fadeInUp 0.8s ease-out;
    }

    .welcome-header {
      margin-bottom: 3rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
    }

    .logo-icon svg {
      width: 24px;
      height: 24px;
    }

    .welcome-title {
      font-size: 3rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.025em;
      background: linear-gradient(135deg, #0f172a, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .welcome-subtitle {
      font-size: 1.25rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .welcome-btn {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
      margin-bottom: 3rem;
      position: relative;
      overflow: hidden;
    }

    .welcome-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
    }

    .welcome-btn:active {
      transform: translateY(0);
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    .feature-nav {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .feature-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      color: #64748b;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      min-width: 120px;
    }

    .feature-link:hover {
      background: #ffffff;
      color: #8b5cf6;
      border-color: #8b5cf6;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: #ffffff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8b5cf6;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
    }

    .feature-link:hover .feature-icon {
      background: #8b5cf6;
      color: white;
      border-color: #8b5cf6;
    }

    .feature-icon svg {
      width: 24px;
      height: 24px;
    }

    .feature-text {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .quick-stats {
      display: flex;
      gap: 3rem;
      justify-content: center;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #8b5cf6;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .welcome-title {
        font-size: 2.25rem;
      }
      
      .welcome-subtitle {
        font-size: 1.125rem;
      }
      
      .feature-nav {
        gap: 1rem;
      }
      
      .quick-stats {
        gap: 2rem;
      }
    }
  </style>
</div>`,l=`// Welcome to React mode!
function WelcomeApp() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: '3rem 2rem',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        textAlign: 'center',
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        <header style={{ marginBottom: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.025em',
              background: 'linear-gradient(135deg, #0f172a, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              React App
            </h1>
          </div>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0,
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Build with React components in real-time
          </p>
        </header>

        <button 
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            padding: '1rem 2.5rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
            marginBottom: '3rem'
          }}
          onClick={() => alert('Hello from React!')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Click Me!
          </span>
        </button>
      </div>
      
      <style>{\`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      \`}</style>
    </div>
  );
}

// APP
ReactDOM.render(<WelcomeApp />, document.getElementById('root'));`,[m,n]=(0,f.useState)(c),[o,p]=(0,f.useState)(!1),[q,r]=(0,f.useState)({components:300,editor:610,preview:400}),[s,t]=(0,f.useState)(null),u=(0,f.useRef)(0),v=(0,f.useRef)(q);(0,f.useEffect)(()=>{"react"===a?n(l):n(c)},[a]);let w=(a,b)=>{b.preventDefault(),t(a),u.current=b.clientX,v.current={...q},document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return(0,f.useEffect)(()=>{if(!s)return;let a=a=>{let b=a.clientX-u.current;r(a=>{let c={...a};return"components"===s?c.components=Math.max(240,Math.min(500,v.current.components+b)):"editor"===s&&(c.editor=Math.max(400,Math.min(800,v.current.editor+b))),c})},b=()=>{t(null),document.body.style.cursor="",document.body.style.userSelect=""};return document.addEventListener("mousemove",a),document.addEventListener("mouseup",b),()=>{document.removeEventListener("mousemove",a),document.removeEventListener("mouseup",b)}},[s]),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)("div",{className:"jsx-f02a346434eb270e app-container",children:[(0,d.jsxs)("div",{className:"jsx-f02a346434eb270e main-content",children:[(0,d.jsx)("div",{style:{width:`${q.components}px`,minWidth:"240px",maxWidth:"500px",flex:"0 0 auto"},className:"jsx-f02a346434eb270e panel components-panel",children:(0,d.jsx)(g.default,{onInsert:a=>{n(b=>b+"\n"+a)},onAiInsert:a=>{n(b=>b+"\n"+a)},onOpenSettings:()=>p(!0),onResizeStart:a=>w("components",a),currentCode:m,framework:a})}),(0,d.jsx)("div",{onMouseDown:a=>w("components",a),className:"jsx-f02a346434eb270e resize-handle"}),(0,d.jsx)("div",{style:{width:`${q.editor}px`,minWidth:"400px",maxWidth:"800px",flex:"0 0 auto"},className:"jsx-f02a346434eb270e panel editor-panel",children:(0,d.jsx)(h.default,{code:m,setCode:n,runCode:()=>{n(a=>a+"")},formatCode:()=>{let a=m.replace(/(>)(<)/g,"$1\n$2");n(a)},onResizeStart:a=>w("editor",a),framework:a,setFramework:b})}),(0,d.jsx)("div",{onMouseDown:a=>w("editor",a),className:"jsx-f02a346434eb270e resize-handle"}),(0,d.jsx)("div",{style:{flex:1,minWidth:"400px"},className:"jsx-f02a346434eb270e panel preview-panel",children:(0,d.jsx)(i.default,{code:m,onResizeStart:a=>w("preview",a),framework:a})})]}),(0,d.jsx)(j.default,{})]}),(0,d.jsx)(k.default,{isOpen:o,onClose:()=>p(!1)}),(0,d.jsx)(e.default,{id:"f02a346434eb270e",children:'.resize-handle{cursor:col-resize;background:var(--border-primary);width:8px;transition:all .2s;position:relative}.resize-handle:hover{background:var(--interactive-accent)}.resize-handle:before{content:"";background:var(--text-tertiary);opacity:.6;border-radius:1px;width:2px;height:20px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.resize-handle:hover:before{opacity:1;background:#fff}body.resizing{cursor:col-resize!important;user-select:none!important}'})]})}[h]=l.then?(await l)():l,c()}catch(a){c(a)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__350fe2eb._.js.map