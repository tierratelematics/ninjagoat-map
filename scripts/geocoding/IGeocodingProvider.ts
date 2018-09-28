import { IGeocodingProviderResult } from "./IGeocodingProviderResult";
interface IGeocodingProvider {
    search(query: {query: string}): Promise<IGeocodingProviderResult[]>;
}

export default IGeocodingProvider