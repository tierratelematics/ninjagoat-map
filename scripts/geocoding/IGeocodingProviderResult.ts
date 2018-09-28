export interface IGeocodingProviderResult {
    x: number,
    y: number,
    label: string,
    bounds: number[][] // [[s, w], [n, e]],
    raw: any
}