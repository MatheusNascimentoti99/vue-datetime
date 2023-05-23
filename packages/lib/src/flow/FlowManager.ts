import { EndStatus, FlowStep, IFlowManager, StepType } from './namespace';

export const timeFlow: FlowStep[] = ['time'];
export const dateFlow: FlowStep[] = ['date'];
export const dateTimeFlow: FlowStep[] = ['date', 'time'];

class FlowManager implements IFlowManager {
  private readonly flow: FlowStep[];

  private readonly endStatus: EndStatus;

  private diversionNext: any | null;

  constructor(flow: FlowStep[] = [], endStatus: EndStatus = '') {
    this.flow = flow;
    this.endStatus = endStatus;
    this.diversionNext = null;
  }

  step(index: number): StepType {
    return (index >= 0 && this.flow.length > index) ? this.flow[index] : this.endStatus;
  }

  first(): StepType {
    return this.step(0);
  }

  next(current: FlowStep): StepType {
    if (this.diversionNext) {
      const next = this.diversionNext;
      this.diversionNext = null;

      return next;
    }

    return this.step(this.flow.indexOf(current) + 1);
  }

  diversion(next: string): void {
    this.diversionNext = next;
  }
}

export default FlowManager;
