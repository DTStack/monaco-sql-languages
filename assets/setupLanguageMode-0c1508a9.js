import{e as l,R as _,M as f,W as v,l as C}from"./index-e7f600bf.js";function m(r,t,n){let i=null;return(...o)=>{if(i&&clearTimeout(i),n&&!i)return r==null?void 0:r(...o);i=setTimeout(()=>{i&&clearTimeout(i),i=null,r==null||r(...o)},t)}}class b{constructor(t,n,i){this._languageId=t,this._worker=n,this._defaults=i,this._disposables=[],this._listener=Object.create(null);const o=e=>{let s=e.getLanguageId();s===this._languageId&&(this._listener[e.uri.toString()]=e.onDidChangeContent(m(()=>{this._doValidate(e.uri,s)},500)),this._doValidate(e.uri,s))},a=e=>{l.setModelMarkers(e,this._languageId,[]);let s=e.uri.toString(),d=this._listener[s];d&&(d.dispose(),delete this._listener[s])};this._disposables.push(l.onDidCreateModel(o)),this._disposables.push(l.onWillDisposeModel(a)),this._disposables.push(l.onDidChangeModelLanguage(e=>{a(e.model),o(e.model)})),this._disposables.push(this._defaults.onDidChange(e=>{l.getModels().forEach(s=>{s.getLanguageId()===this._languageId&&(a(s),o(s))})})),this._disposables.push({dispose:()=>{for(let e in this._listener)this._listener[e].dispose()}}),l.getModels().forEach(o)}dispose(){this._disposables.forEach(t=>t&&t.dispose()),this._disposables=[]}_doValidate(t,n){this._worker(t).then(i=>{var o;let a=((o=l.getModel(t))===null||o===void 0?void 0:o.getValue())||"";return typeof this._defaults.preprocessCode=="function"&&(a=this._defaults.preprocessCode(a)),i.doValidation(a)}).then(i=>{const o=i.map(e=>w(t,e));let a=l.getModel(t);a&&a.getLanguageId()===n&&l.setModelMarkers(a,n,o)}).then(void 0,i=>{console.error(i)})}}function M(r){switch(r){default:return f.Error}}function w(r,t){return{severity:M(),startLineNumber:t.startLine,startColumn:t.startColumn,endLineNumber:t.endLine,endColumn:t.endColumn,message:t.message,code:void 0,source:"dt-sql-parser"}}class y{constructor(t,n){this._worker=t,this._defaults=n}get triggerCharacters(){return Array.isArray(this._defaults.triggerCharacters)?this._defaults.triggerCharacters:["."," "]}provideCompletionItems(t,n,i,o){const a=t.uri;return this._worker(a).then(e=>{var s;let d=((s=l.getModel(a))===null||s===void 0?void 0:s.getValue())||"";return typeof this._defaults.preprocessCode=="function"&&(d=this._defaults.preprocessCode(d)),e.doCompletionWithEntities(d,n)}).then(([e,s])=>this._defaults.completionService(t,n,i,e,s)).then(e=>{const s=t.getWordUntilPosition(n),d=new _(n.lineNumber,s.startColumn,n.lineNumber,s.endColumn);return{suggestions:(Array.isArray(e)?e:e.suggestions).map(u=>{var g,h;return Object.assign(Object.assign({},u),{insertText:(g=u.insertText)!==null&&g!==void 0?g:typeof u.label=="string"?u.label:u.label.label,range:(h=u.range)!==null&&h!==void 0?h:d})}),dispose:Array.isArray(e)?void 0:e.dispose,incomplete:Array.isArray(e)?void 0:e.incomplete}})}}function L(r){const t=[],n=[],i=new v(r);t.push(i);const o=(...e)=>i.getLanguageServiceWorker(...e);function a(){const{languageId:e,modeConfiguration:s}=r;c(n),s.diagnostics&&n.push(new b(e,o,r)),s.completionItems.enable&&n.push(C.registerCompletionItemProvider(e,new y(o,r)))}return a(),t.push(p(n)),p(t)}function p(r){return{dispose:()=>c(r)}}function c(r){for(var t;r.length;)(t=r.pop())===null||t===void 0||t.dispose()}export{L as setupLanguageMode};
