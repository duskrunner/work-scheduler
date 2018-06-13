//от

var nodes = document.querySelectorAll('.tableBody  td:nth-child(1) > a');
for (var i = 0; i < nodes.length; i++) {
    window.open(nodes[i].href);
}

// --------------------------------------------------------

var desc = document.querySelector('#description');
var val = desc.value;
var newVal = val.replace("BH", '').replace("alu.spb-", "MBH_78_").replace("-0", "_").replace("-", "_");
var re = /MBH_78_\d\d\d\d_\d/g;
if (!newVal.match(re)) {
    newVal = newVal + '_2';
}
desc.value = newVal;
var sub = document.querySelector('input[value=Save]');
sub.click();

