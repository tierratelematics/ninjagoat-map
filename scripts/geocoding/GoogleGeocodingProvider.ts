import IGeocodingProvider from "./IGeocodingProvider";
import {inject, optional, injectable} from "inversify";
import IApiKeyConfig from "./IApiKeyConfig";
import {GoogleProvider} from 'leaflet-geosearch';

@injectable()
class GoogleGeocodingProvider implements IGeocodingProvider {

    private client: any;

    constructor(@inject("IMapApiKeyConfig") @optional() private apiKeyConfig: IApiKeyConfig) {

    }

    search(query: {query: any}): Promise<any[]> {
        if (!this.apiKeyConfig)
            throw new Error("Google API Key is missing");
        if (!this.client)
            this.client = new GoogleProvider({
                params: {
                    key: this.apiKeyConfig.key
                }
            });
        return this.client.search(query);
    }
}

export default GoogleGeocodingProvider