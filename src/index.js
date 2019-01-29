import sayHello from './hello';
import './index.scss';
import Map from './map';


let map = new Map();
map.createMarkers();
document.getElementById('root').innerHTML = sayHello();


