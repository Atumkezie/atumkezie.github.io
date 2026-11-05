import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const preferenceCode = readFileSync(new URL('../public/scripts/preferences.js', import.meta.url), 'utf8');
const controlCode = readFileSync(new URL('../public/scripts/environment.js', import.meta.url), 'utf8');
class Element {
  constructor(dataset = {}) { this.dataset=dataset;this.attributes={};this.handlers={};this.children=new Map();this.textContent='';this.disabled=false; }
  setAttribute(key,value){this.attributes[key]=value;}
  querySelector(selector){return this.children.get(selector)||null;}
  addEventListener(event,fn){this.handlers[event]=fn;}
  click(){if(!this.disabled)return this.handlers.click?.();}
}
function harness({saved={},reduced=false,blocked=false,playError=false}={}) {
  const values=new Map(Object.entries(saved));
  const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
  const root={dataset:{}};
  const day=new Element({themeChoice:'day'}),night=new Element({themeChoice:'night'});
  const motion=new Element();motion.children.set('[data-motion-label]',new Element());motion.children.set('.motion-symbol',new Element());
  const sound=new Element(),listen=new Element(),status=new Element(),meta=new Element();
  listen.children.set('[data-performance-label]',new Element());
  const video=new Element();video.paused=true;video.ended=false;video.calls=0;
  video.play=async()=>{video.calls++;if(playError)throw new Error('Media unavailable');video.paused=false;video.ended=false;video.handlers.play?.();};
  video.pause=()=>{video.paused=true;video.handlers.pause?.();};
  const details={open:false};const detailsLink=new Element({openDetails:'patch-workflow'});
  const media={matches:reduced,addEventListener:(_,fn)=>{media.change=fn;}};
  const map=new Map([['[data-motion-toggle]',motion],['[data-environment-status]',status],['meta[name="theme-color"]',meta],['#keyboard-performance',video],['[data-performance-toggle]',sound],['[data-performance-link]',listen]]);
  const document={documentElement:root,querySelector:selector=>map.get(selector)||null,querySelectorAll:selector=>selector==='[data-theme-choice]'?[day,night]:selector==='[data-open-details]'?[detailsLink]:[],getElementById:id=>id==='patch-workflow'?details:null};
  const host={matchMedia:()=>media};Object.defineProperty(host,'localStorage',{get(){if(blocked)throw new Error('Denied');return storage;}});
  const context=vm.createContext({window:host,document});vm.runInContext(preferenceCode,context);host.HKPreferences=context.HKPreferences;
  host.HKPreferences.applyInitial(root,host);vm.runInContext(controlCode,context);
  return {root,day,night,motion,sound,listen,status,meta,video,media,values,details,detailsLink};
}
test('first visit selects day without starting audio',()=>{const h=harness();assert.equal(h.root.dataset.theme,'day');assert.equal(h.day.attributes['aria-pressed'],'true');assert.equal(h.night.attributes['aria-pressed'],'false');assert.equal(h.video.calls,0);});
test('explicit night choice persists and restores across pages',()=>{const h=harness();h.night.click();assert.equal(h.root.dataset.theme,'night');assert.equal(h.values.get('hk-theme-v1'),'night');assert.equal(h.meta.attributes.content,'#101b30');assert.match(h.status.textContent,/Night/);const next=harness({saved:Object.fromEntries(h.values)});assert.equal(next.night.attributes['aria-pressed'],'true');next.day.click();assert.equal(next.root.dataset.theme,'day');});
test('clicking the active day choice does not toggle to night',()=>{const h=harness();h.day.click();assert.equal(h.root.dataset.theme,'day');});
test('invalid stored preferences use safe defaults',()=>{const h=harness({saved:{'hk-theme-v1':'invalid','hk-motion-v2':'invalid'}});assert.equal(h.root.dataset.theme,'day');assert.equal(h.root.dataset.motion,'running');});
test('denied storage does not break theme or motion controls',()=>{const h=harness({blocked:true});h.night.click();h.motion.click();assert.equal(h.root.dataset.theme,'night');assert.equal(h.root.dataset.motion,'paused');});
test('manual motion preference persists and resumes',()=>{const h=harness();h.motion.click();const next=harness({saved:Object.fromEntries(h.values)});assert.equal(next.root.dataset.motion,'paused');next.motion.click();assert.equal(next.root.dataset.motion,'running');});
test('system reduced motion overrides running and responds to changes',()=>{const h=harness({reduced:true});assert.equal(h.root.dataset.motion,'paused');assert.equal(h.motion.disabled,true);h.media.matches=false;h.media.change();assert.equal(h.root.dataset.motion,'running');});
test('manual pause survives changes to the system preference',()=>{const h=harness({saved:{'hk-motion-v2':'paused'}});h.media.matches=true;h.media.change();h.media.matches=false;h.media.change();assert.equal(h.root.dataset.motion,'paused');});
test('navigation sound button and music play button stay synchronized',async()=>{const h=harness();await h.listen.click();assert.equal(h.sound.attributes['aria-pressed'],'true');assert.equal(h.listen.querySelector('[data-performance-label]').textContent,'Pause the recording');await h.sound.click();assert.equal(h.video.paused,true);assert.equal(h.listen.attributes['aria-pressed'],'false');});
test('a failed play request reports the error without a false playing state',async()=>{const h=harness({playError:true});await h.sound.click();assert.equal(h.sound.attributes['aria-pressed'],'false');assert.match(h.status.textContent,/could not start/);});
test('the clip can be replayed from the beginning after ending',async()=>{const h=harness();h.video.ended=true;h.video.currentTime=18;h.video.handlers.ended();await h.sound.click();assert.equal(h.video.currentTime,0);assert.equal(h.video.paused,false);});
test('reduced motion does not autoplay or block intentional audio',async()=>{const h=harness({reduced:true});assert.equal(h.video.calls,0);await h.listen.click();assert.equal(h.video.paused,false);assert.equal(h.root.dataset.motion,'paused');});

test('the remake does not inherit a paused state from the broken preview',()=>{const h=harness({saved:{'hk-motion-v1':'paused'}});assert.equal(h.root.dataset.motion,'running');});
