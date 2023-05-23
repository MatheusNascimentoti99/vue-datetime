import { FlowStep, FlowType, IFlowManager } from './namespace';
import FlowManager, { dateFlow, dateTimeFlow, timeFlow } from './FlowManager';

export const createFlowManager = (flow: FlowStep[]): IFlowManager => {
  return new FlowManager(flow, 'end');
}

export const createFlowFactory = (type: FlowType): IFlowManager => {
  switch (type) {
    case 'datetime':
      return new FlowManager(dateTimeFlow, 'end');
    case 'date':
      return new FlowManager(dateFlow, 'end');
    case 'time':
      return new FlowManager(timeFlow, 'end');
  }
  throw new TypeError(`Cannot create flow type of ${type}`);
}

export default FlowManager;
