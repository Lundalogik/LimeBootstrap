import '@babel/polyfill'
import 'bootstrap3'
import 'underscore'

import lbs from './lib/lbs'
import './components/lbs.components'

window.lbs = lbs

/**
Every this is loaded, run the awesomeness!
*/
document.addEventListener('DOMContentLoaded', () => lbs.setup())
