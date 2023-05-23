export type FlowType = 'datetime' | 'date' | 'time';

export type FlowStep = 'date' | 'time';

export type EndStatus = 'end' | string;

export type StepType = FlowStep | EndStatus;

export interface IFlowManager {
  step(index: number): StepType;
  first(): StepType;
  next(current: StepType): StepType;
  diversion(next: string): void;
}
