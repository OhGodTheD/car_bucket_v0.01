(()=>{const N=window.CarBucketNormalize,C=window.CarBucketConfidence;
function titleParts(){const title=document.querySelector('h1')?.textContent||document.title||'';const year=N.year(title);const rest=title.replace(String(year||''),'').replace(/\s+/g,' ').trim();return{year,rest}}
function merge(base,r){if(!r?.data)return base;for(const[k,v]of Object.entries(r.data))if(base[k]==null||base[k]==='' )base[k]=v;for(const[k,v]of Object.entries(r.evidence||{}))if(v)base.evidence[k]=v;for(const[k,v]of Object.entries(r.confidence||{}))if(v)base.confidence[k]=Math.max(base.confidence[k]||0,v);return base}
function detectPlatform(){const h=location.hostname.toLowerCase(),html=document.documentElement.outerHTML.slice(0,400000).toLowerCase();const tests=[['autotrader',/autotrader/],['cargurus',/cargurus/],['cars.com',/cars\.com/],['dealeron',/dealeron/],['dealerinspire',/dealerinspire/],['dealerfire',/dealerfire/],['vinsolutions',/vinsolutions/],['dealertrack',/dealertrack/],['dealer.com',/dealer\.com/],['cdk',/cdkglobal|cdk/],['roadster',/roadster/],['carsforsale',/carsforsale/]];const hit=tests.find(([n,re])=>re.test(h)||re.test(html));return{name:hit?.[0]||'unknown',confidence:hit?.[0]?0.7:0}}
async function extractUniversal(){const page=window.CarBucketPageClassifier?.classify?.()||{type:'unknown',confidence:0};const base={url:location.href,source:location.hostname.replace(/^www\./,''),title:'',year:null,make:'',model:'',trim:'',mileage:null,price:null,vin:'',stock:'',dealer:'',location:'',image:'',evidence:{},confidence:{},pageClassification:page,platform:detectPlatform().name};let r;
try{r=window.CarBucketStructuredExtractor?.extract?.();if(r)merge(base,r)}catch{}
try{r=window.CarBucketSemanticExtractor?.extract?.();if(r)merge(base,r)}catch{}
try{r=window.CarBucketAttributeExtractor?.extract?.();if(r)merge(base,r)}catch{}
try{r=window.CarBucketEmbeddedExtractor?.extract?.();if(r)merge(base,r)}catch{}
try{r=window.CarBucketFallbackExtractor?.extract?.();if(r)merge(base,r)}catch{}
if(base.vin&&!N.vin(base.vin))base.vin='';
const tp=titleParts();if(!base.year)base.year=tp.year;
if(!base.title)base.title=[base.year,base.make,base.model,base.trim].filter(Boolean).join(' ')||tp.rest||'Vehicle';
if(base.price==null||!base.vin){try{r=await window.CarBucketResourceExtractor?.extract?.();merge(base,r)}catch{}}
const filled=['vin','price','mileage','stock','year','make','model'].filter(k=>base[k]!=null&&base[k]!=='').length;
base.confidenceScore=Math.round((Object.values(base.confidence).reduce((a,b)=>a+b,0)/Math.max(1,Object.keys(base.confidence).length))*100);
base.confidence=base.confidence;
base.extractionEvidence=base.evidence;
base.extractionConfidence=base.confidence;
base.extractionDebug={pageClassification:page,platform:detectPlatform(),filledFields:filled};
return base}
window.CarBucketExtractor={extractUniversal,detectPlatform};})();