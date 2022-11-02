import { IEventOptions } from './EventOptions'

export interface IEvent {
  options: IEventOptions
  execute: (...args: Promise<void>[]) => Promise<void>
}
