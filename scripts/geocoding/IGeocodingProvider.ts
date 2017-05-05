interface IGeocodingProvider {
    search({query:string}): Promise<any[]>;
}

export default IGeocodingProvider