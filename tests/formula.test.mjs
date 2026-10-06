import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate} from '../src/formulaMath.mjs';
test('Restricted parser preserves mathematical precedence and refuses code',()=>{assert.equal(calculate('-x^2',{x:3}),-9);assert.equal(calculate('2^3^2',{}),512);assert.equal(calculate('e+1',{e:4}),5);assert.ok(Number.isNaN(calculate('globalThis.alert(1)',{})));assert.ok(Number.isNaN(calculate('1/0',{})))});
test('Combinatorics and trigonometric singularities',()=>{assert.equal(calculate('choose(n,r)',{n:6,r:2}),15);assert.equal(calculate('fact(n)',{n:5}),120);assert.ok(Number.isNaN(calculate('fact(n)',{n:2.5})));assert.ok(Number.isNaN(calculate('sin(theta*pi/180)/cos(theta*pi/180)',{theta:90})));assert.ok(Math.abs(calculate('pi*r^2',{r:3})-9*Math.PI)<1e-10)});
