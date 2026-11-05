import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { Script, createContext } from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

test('portable export preserves dollar metasequences and escapes closing script tags',()=>{
  const dir=mkdtempSync(path.resolve('.export-test-'));
  try {
    mkdirSync(path.join(dir,'dist/scripts'),{recursive:true});mkdirSync(path.join(dir,'dist/media'));
    writeFileSync(path.join(dir,'dist/Harikrishna_Trivedi_Resume.pdf'),'fixture');
    const expected=['$&',"$'",'$`','</script>','</SCRIPT>'];
    writeFileSync(path.join(dir,'dist/scripts/fixture.js'),`globalThis.exported = ${JSON.stringify(expected)};`);
    writeFileSync(path.join(dir,'dist/style.css'),'p::after{content:"$&"}');
    writeFileSync(path.join(dir,'dist/index.html'),'<!doctype html><html><head><link rel="stylesheet" href="/style.css"></head><body><p>Only intended page text.</p><script src="/scripts/fixture.js"></script></body></html>');
    const exporter=fileURLToPath(new URL('../scripts/export-review.mjs',import.meta.url));
    execFileSync(process.execPath,[exporter],{cwd:dir,stdio:'pipe'});
    const html=readFileSync(path.join(dir,'OPEN_PREVIEW.html'),'utf8');
    const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];assert.equal(scripts.length,1);
    const context=createContext({});new Script(scripts[0][1]).runInContext(context);
    assert.deepEqual(Array.from(context.exported),expected);
    assert.ok(html.includes('p::after{content:"$&"}'));
    assert.equal(html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,'').replace(/<[^>]*>/g,'').trim(),'Only intended page text.');
  } finally {rmSync(dir,{recursive:true,force:true});}
});
