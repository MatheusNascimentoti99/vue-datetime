import FlowManager, { createFlowManager, createFlowManagerFromType } from '@/flow';
import { IFlowManager } from '@/flow/namespace';
import { expectTypeOf } from 'vitest';

describe('Flow Manager', () => {
  const flowManager = new FlowManager(['date', 'time'], 'end');
  const addDiversion = (name: string) => { flowManager.diversion(name); };
  const emptyManager = () => (new FlowManager([], 'end'));

  it('Create Flow Manager', () => {
    expectTypeOf(flowManager).toEqualTypeOf(FlowManager);
    expectTypeOf(flowManager).toMatchTypeOf<IFlowManager>();
    expectTypeOf(new FlowManager([], '')).toEqualTypeOf(FlowManager);
  });

  it('Flow Manager First', () => {
    expect(flowManager.first()).toBe('date');
    expect(emptyManager().first()).toBe('end');
    expect(emptyManager().first()).toBe('end');
  });

  it('Flow Manager Step', () => {
    expect(flowManager.step(-1)).toBe('end');
    expect(flowManager.step(0)).toBe('date');
    expect(flowManager.step(1)).toBe('time');
    expect(flowManager.step(2)).toBe('end');
  });

  it('Flow Manager Next', () => {
    expect(flowManager.next('date')).toBe('time');
    expect(flowManager.next('time')).toBe('end');
    expect(flowManager.next('end')).toBe('date');
    expect(flowManager.next('somethingcomepletlybogus')).toBe('date');

    expect(emptyManager().next('date')).toBe('end');
    expect(emptyManager().next('somethingcomepletlybogus')).toBe('end');
  });

  it('Flow Manager Diversion', () => {
    addDiversion('test');
    expect(flowManager.next('date')).toBe('test');
    expect(flowManager.next('date')).toBe('time');

    const manager = emptyManager();
    manager.diversion('test');
    expect(manager.next('date')).toBe('test');
    expect(manager.next('date')).toBe('end');
  });
});

describe('Flow Manager Factory Functions', () => {
  it('Create Flow Manager', () => {
    const manager = createFlowManager(['date', 'time']);
    expect(manager.step(0)).toBe('date');
    expect(manager.step(1)).toBe('time');
    expect(manager.step(2)).toBe('end');
  });

  it('Create Flow Manager From Flow Type', () => {
    let manager = createFlowManagerFromType('datetime');
    expect(manager.step(0)).toBe('date');
    expect(manager.step(1)).toBe('time');
    expect(manager.step(2)).toBe('end');

    manager = createFlowManagerFromType('date');
    expect(manager.step(0)).toBe('date');
    expect(manager.step(2)).toBe('end');

    manager = createFlowManagerFromType('time');
    expect(manager.step(0)).toBe('time');
    expect(manager.step(2)).toBe('end');

    expect(() => createFlowManagerFromType('sometotallybogustype')).toThrow(TypeError);
  });
});
