import FlowManager, { dateFlow, dateTimeFlow, timeFlow } from './FlowManager';
import { FlowStep, FlowType, IFlowManager } from './namespace';

export const createFlowManager = (flow: FlowStep[]): IFlowManager => {
  return new FlowManager(flow, 'end');
};

export const createFlowManagerFromType = (type: FlowType): IFlowManager => {
  switch (type) {
  case 'datetime':
    return new FlowManager(dateTimeFlow, 'end');
  case 'date':
    return new FlowManager(dateFlow, 'end');
  case 'time':
    return new FlowManager(timeFlow, 'end');
  default:
    throw new TypeError(`Cannot create flow type of ${type}`);
  }
};

export default FlowManager;
