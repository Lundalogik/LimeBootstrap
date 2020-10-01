import CustomEndpoint from '../../dataSources/lbs.dataSource.customEndpoint'
import { NotYetImplementedError, SetupError } from '../../lbs.errors';

export default class HttpService {
    static async delete(url, options) {
        this.checkResponseType(options)
        const params = options ? options.params : null
        const endpoint = await new CustomEndpoint(
            { relativeUrl: url, params: params },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase,
        )
        const result = await endpoint.delete()
        console.log(`result from delete-request to ${url}:`, result)
        return result;
    }

    static async get(url, options) {
        this.checkResponseType(options)
        const params = options ? options.params : null
        const endpoint = await new CustomEndpoint(
            { relativeUrl: url, params: params },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase,
        )
        const result = await endpoint.get()
        console.log(`result from get-request to ${url}:`, result)
        return result;
    }

    static async patch(url, data, options) {
        throw new NotYetImplementedError();
    }

    static async post(url, data, options) {
        this.checkResponseType(options)
        const params = options ? options.params : null
        const endpoint = await new CustomEndpoint(
            { relativeUrl: url, params: params },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase,
        )
        const result = await endpoint.post(data)
        console.log(`result from post-request to ${url}:`, result)
        return result;
    }

    static async put(url, data, options) {
        this.checkResponseType(options)
        const params = options ? options.params : null
        const endpoint = await new CustomEndpoint(
            { relativeUrl: url, params: params },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase,
        )
        const result = await endpoint.put(data)
        console.log(`result from put-request to ${url}:`, result)
        return result;
    }

    static checkResponseType(options) {
        if (options && options.responseType && options.responseType !== 'json') {
            throw new SetupError('HttpService can only handle response data of type json when running in Lime Bootstrap.')
        }
    }
}
