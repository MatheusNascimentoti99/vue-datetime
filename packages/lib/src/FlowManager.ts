class FlowManager {
  private readonly flow: string[];

  private readonly endStatus: string;

  private diversionNext: any | null;

  constructor(flow: any[] = [], endStatus: string = '') {
    this.flow = flow;
    this.endStatus = endStatus;
    this.diversionNext = null;
  }

  step(index: number) {
    return this.flow.length > index ? this.flow[index] : this.endStatus;
  }

  first() {
    return this.step(0);
  }

  next(current: string): string {
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
