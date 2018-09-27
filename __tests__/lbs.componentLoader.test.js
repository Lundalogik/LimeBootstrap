import ko from 'knockout'
import $ from 'jquery'

import ComponentLoader from '../src/lib/lbs.componentLoader'
import config from '../__mocks__/_config.mock'


beforeAll(() => {
    const lbs = {}
    window.lbs = lbs
    lbs.log = {}
    lbs.log.info = () => {}
    lbs.log.error = () => {}
    lbs.config = config
    window.ko = ko
    window.$ = $
})

test('it work with components node in settings undefined', async () => {
    let c = lbs.config
    await ComponentLoader.loadComponents(config.components, config.components)
    expect(ko.components._allRegisteredComponents['my-app']).toBeUndefined()
})

// test('it should load a component', () => {
//     lbs.config.components = []
//     const componentDef = {name: 'my-app', path:'../__mocks__/my-component.js'}
//     lbs.config.components.push(componentDef)
//     ComponentLoader.loadComponents(config.components, config.components)
//     expect(ko.components._allRegisteredComponents['my-app']).not.toBeUndefined()
// })
