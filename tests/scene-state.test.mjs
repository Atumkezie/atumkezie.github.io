import test from 'node:test';
import assert from 'node:assert/strict';
import { heroMotion, revealMotion, wordOpacity } from '../src/scripts/scene-state.mjs';
test('hero transitions start at full size and progress with scroll',()=>{
  const first=heroMotion(0,0,900,1215),middle=heroMotion(157.5,0,900,1215),end=heroMotion(315,0,900,1215);
  assert.equal(first.scale,1);assert.ok(first.scale>middle.scale&&middle.scale>end.scale);assert.ok(first.captionOpacity>middle.captionOpacity&&middle.captionOpacity>end.captionOpacity);assert.equal(end.radius,22);
});
test('hero state clamps outside its scroll range without a jump',()=>{assert.equal(heroMotion(-100,0,900,1215).progress,0);assert.equal(heroMotion(5000,0,900,1215).progress,1);assert.ok(Number.isFinite(heroMotion(0,0,900,900).scale));});
test('reveal opacity rises and translation settles as content enters',()=>{const below=revealMotion(1000,900),enter=revealMotion(700,900),inside=revealMotion(200,900);assert.ok(below.opacity<enter.opacity&&enter.opacity<inside.opacity);assert.ok(below.y>enter.y&&enter.y>inside.y);assert.equal(inside.y,0);});
test('scrolling upward reveals content from the top edge and settles it in place',()=>{
  const above=revealMotion(-350,900,0,false,300),enter=revealMotion(-190,900,0,false,300),inside=revealMotion(100,900,0,false,300);
  assert.ok(above.opacity<enter.opacity&&enter.opacity<inside.opacity);
  assert.ok(above.y<enter.y&&enter.y<inside.y);assert.equal(inside.y,0);
});
test('reversing scroll retraces the same continuous positions without a once-only state',()=>{
  const positions=[1000,850,700,500,200,-100,-300];
  const down=positions.map(top=>revealMotion(top,900,1,false,300));
  const up=[...positions].reverse().map(top=>revealMotion(top,900,1,false,300)).reverse();
  assert.deepEqual(down,up);
  assert.ok(Math.abs(revealMotion(-100,900,0,false,300).y-revealMotion(-99,900,0,false,300).y)<1);
});
test('reduced motion presents complete text and no scroll transforms',()=>{assert.equal(heroMotion(200,0,900,1215,true).scale,1);assert.deepEqual(revealMotion(1000,900,0,true),{opacity:1,y:0});assert.equal(wordOpacity(0,5,20,true),1);});
test('words come into focus in reading order and finish fully visible',()=>{assert.ok(wordOpacity(.3,0,20)>wordOpacity(.3,15,20));for(let i=0;i<20;i++)assert.equal(wordOpacity(1,i,20),1);});
