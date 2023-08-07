
import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import {AppFullscreen, Dialog, Loading, Notify} from "quasar";

// To be used on app.use(Quasar, { ... })
export default {
  boot: [

  ],
  config: {
    notify: {
      position: 'top',
      timeout: 4000,
      color: 'info',
      icon: 'info',
      actions: [{ icon: 'close', color: 'white' }],
    },
  },
  plugins: {
    Notify,
    Dialog,
    AppFullscreen,
    Loading
  },

}