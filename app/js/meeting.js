$(document).ready(function() {
var recips = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('email'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: '/users/mail'
});
recips.initialize();

$('#seltag').tagsinput({
  // itemValue: 'email',
  // itemText: 'email',
  typeaheadjs: {
    // name: 'recips',
    displayKey: 'email',
    valueKey: 'email',
    source: recips.ttAdapter()
  }
  // freeInput: true
});

var now = moment();
var min = now.get('minute');
// console.log(min);
if(min < 30){
  now.set('minute',30);
} 
else{
  now.set('hour',now.get('hour')+1);
  now.set('minute',0);
}
var next = moment(now).add(30,'m');

rome(startTime, { initialValue: now });
rome(endTime, { initialValue: next }); 
});