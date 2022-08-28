export interface AIR_QUALITY_REQUEST {
    latitude: number,
    longitude: number
}

export interface AIR_QUALITY_OBJECT {
    id?: String,
    latitude: number,
    longitude: number,
    country: string,
    city: string
    createdAt?: Date,
    ts: Date,
    aqius: number,
    mainus: string,
    aqicn: number,
    maincn: string
}


