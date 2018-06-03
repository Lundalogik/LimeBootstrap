const express = require('express')

const companyResponse = require('./__mocks__/api_response_lime_core_company')
const relatedPersonResponse = require('./__mocks__/api_response_lime_core_company_related_persons')
const localizationResponse = require('./__mocks__/api_response_lime_core_localize')
const gdprResponses = require('./__mocks__/api_response_gdpr')

const app = express()

app.use(express.static(`${__dirname}/dist`))

app.get('/', (req, res) => {
    res.sendFile('lbs.html', { root: `${__dirname}/dist/` })
})

// AJAX to /action.
app.post('/action', (req, res) => {
    res.send('POST action completed!')
})

app.get('/core/api/v1/limeobject/company/:id/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(companyResponse))
})

app.get('/core/api/v1/limeobject/company/:id/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(companyResponse))
})

app.get('/core/api/v1/limeobject/person/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(relatedPersonResponse))
})

app.get('/core/api/v1/limeobject/localize/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(localizationResponse))
})

app.get('/core/person/expired/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(gdprResponses.bulkConsentPayload))
})

// Export the module like this for Brunch.
module.exports = (config, callback) => {
    // Server config is passed within the `config` variable.
    app.listen(config.port, () => {
        console.log(`Lbs mock-server is live on http://localhost:${config.port}/?ap=company&server=localhost:3333&database=core&limeobjectid=1001&locale=en_us`)
        callback()
    })

    // Return the app; it has the `close()` method, which would be ran when
    // Brunch server is terminated
    return app
}
