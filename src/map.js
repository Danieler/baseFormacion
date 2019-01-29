import * as L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

import { flatMap, switchMap } from 'rxjs/operators';
import { timer, from} from 'rxjs';

export default class  Map {
	constructor() {
		this.map = L.map('map');
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.map);

		this.map.setView([61.4956, 23.7713], 11);
	}
	createMarkers() {
		const mcg = new MarkerClusterGroup().addTo(this.map);
		this.paintMarkers(mcg);
	}

	paintMarkers(mcg) {

		let timerObs = timer(0, 1000)
			.pipe(
				// switchMap cancels the last request, if no response have been received since last tick
				switchMap(() => from(fetch('http://data.itsfactory.fi/journeys/api/1/vehicle-activity'))
				));

		timerObs.pipe(flatMap((res) => from(res.json())))
			.subscribe((response) => {
				mcg.clearLayers();
				for (let item of response.body) {
					let marker = L.marker([
						item.monitoredVehicleJourney.vehicleLocation.latitude,
						item.monitoredVehicleJourney.vehicleLocation.longitude], {
						icon: L.divIcon({
							iconSize: null,
							iconAnchor: [0, 0],
							html: `<div class='vehicle-info'>
									<p>Line:${item.monitoredVehicleJourney.lineRef}</p>
									<p>Journey: ${item.monitoredVehicleJourney.journeyPatternRef}</p>
								</div>
								<img  width='30px' src='./bus_icon.png'>`,
							className: 'my-div-icon'
						})
					});
					marker.on('click', this.markerClick.bind(this));
					marker.vehicleRef = item.monitoredVehicleJourney.vehicleRef;
					marker.addTo(mcg);
				}
			});
	}
	markerClick(e) {
		Swal.fire(`Autobus: ${ e.target.vehicleRef }`);
	}
}
