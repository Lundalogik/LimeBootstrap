import ComponentLoader from '../src/lib/lbs.componentLoader'
import config from '../__mocks__/_config.mock'
import ko from 'knockout'

test('it should load a component', () => {
    let lbs = {}
    lbs.config = config
    window.ko = ko
    ComponentLoader.loadComponents(config.components, config.components)

    expect(ko.components._allRegisteredComponents['my-app']).notToBeNull
    //expect(false).toEqual(true)
})