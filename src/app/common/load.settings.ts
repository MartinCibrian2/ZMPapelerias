
import { AppSettings } from './api.path';

export function LoadSettings( appSettings: AppSettings ){
  return function test() {
    return appSettings.load()
  }
}