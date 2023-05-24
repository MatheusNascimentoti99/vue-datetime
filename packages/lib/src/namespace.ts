export interface TimeElement {
  number: number | undefined,
  label?: string,
  selected: boolean,
  disabled: boolean
}

export interface ListElement extends Element {
  offsetTop: number
}

export interface Actions {
  cancel?: string,
  ok?: string,
}
