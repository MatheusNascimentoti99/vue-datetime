import { App } from 'vue';

import Datetime from './DateTime.vue';
import DatetimePopup from './DatetimePopup.vue';

// Install by default if using the script tag
// TODO: check what this actually does
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(plugin);
// }

export default function createDatetime() {
  const install = (app: App) => {
    app.component('DateTime', Datetime);
    app.component('DateTimePopup', DatetimePopup);
  };

  return { install };
}
const version = '__VERSION__';
createDatetime.version = version;

// Export all components too
export {
  Datetime,
  DatetimePopup,
  version,
};
