export default class  BusService {
	constructor() {

	}

	getBuses() {
		return fetch('http://data.itsfactory.fi/journeys/api/1/vehicle-activity').then(r => r.json());
	}

}
