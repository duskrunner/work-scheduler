import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map'


autocomplete(document.querySelector('#address'), document.querySelector('#lat'), document.querySelector('#lng'));
typeAhead(document.querySelector('.search'));
makeMap(document.querySelector('#map'));
makeMap(document.querySelector('#allmap'));
makeMap(document.querySelector('#todomap'));
makeMap(document.querySelector('#prioritytodomap'));




