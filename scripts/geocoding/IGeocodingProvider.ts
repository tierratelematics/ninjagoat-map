interface IGeocodingProvider {
    search(query: {query: string}): Promise<any[]>;
}

export default IGeocodingProvider