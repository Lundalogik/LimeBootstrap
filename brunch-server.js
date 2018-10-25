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
        console.log(`Lbs mock-server is live on http://localhost:${config.port}/lbs.html?ap=company&apait=company&apsrv=http://localhost:3333&apdb=core&limeobjectid=1001&locale=en_us&apsid=123&apusr=%7B%0A%09%22groups%22%20:%20%0A%09%5B%0A%09%09%7B%0A%09%09%09%22id%22%20:%201,%0A%09%09%09%22isActive%22%20:%20true,%0A%09%09%09%22localName%22%20:%20%22Administrat%C3%B6rer%22,%0A%09%09%09%22name%22%20:%20%22Administrators%22%0A%09%09%7D%0A%09%5D,%0A%09%22id%22%20:%202901,%0A%09%22isAdmin%22%20:%20true,%0A%09%22isSuperUser%22%20:%20true,%0A%09%22name%22%20:%20%22Lime%20Administrator%22,%0A%09%22username%22%20:%20%22limeadmin%22%0A%7D`)
        callback()
    })

    // Return the app; it has the `close()` method, which would be ran when
    // Brunch server is terminated
    return app
}
