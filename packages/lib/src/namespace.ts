export interface TimeElement {
  key: number
  number: number | undefined
  label?: string
  selected: boolean
  disabled: boolean
}

export interface ListElement extends Element {
  offsetTop: number
}

export interface Actions {
  cancel?: string
  ok?: string,
}

export interface DateElement {
  year: number
  month: number
  day: number
}
