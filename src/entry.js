import 'babel-polyfill'
import $ from 'jquery'
import 'bootstrap3'
import 'underscore'

import xml2json from 'xml2json-light'
import lbs from './lib/lbs'
import './components/lbs.components'

window.lbs = lbs

// Hack to be compatible with old global version of this functionality
window.xml2json = xml2json.xml2json
/**
Every this is loaded, run the awesomeness!
*/
$(document).ready(() => lbs.setup())
