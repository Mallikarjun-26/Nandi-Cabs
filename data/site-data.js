const wikipediaPages={
  mysore:'Mysore',coorg:'Kodagu',ooty:'Ooty',chikmagalur:'Chikkamagaluru',wayanad:'Wayanad',hassan:'Hassan',sakleshpur:'Sakleshpur',kabini:'Kabini',bandipur:'Bandipur National Park',hampi:'Hampi',gokarna:'Gokarna',udupi:'Udupi',mangalore:'Mangaluru','jog-falls':'Jog Falls',shivanasamudra:'Shivanasamudra Falls',chennai:'Chennai',hyderabad:'Hyderabad',tirupati:'Tirupati',coimbatore:'Coimbatore',goa:'Goa',pondicherry:'Puducherry',shivamogga:'Shivamogga','bhadravati':'Bhadravati, Karnataka',birur:'Birur'
};
const placesByCity={
  mysore:['Mysore Palace','Chamundeshwari Temple','Brindavan Gardens','Mysore Zoo','Jaganmohan Palace'],
  coorg:['Abbey Falls','Madikeri Fort','Talakaveri',"Raja's Seat",'Namdroling Monastery'],
  ooty:['Nilgiri Mountain Railway','Government Botanical Garden, Ooty','Ooty Lake','Doddabetta','Government Rose Garden'],
  chikmagalur:['Mullayanagiri','Baba Budangiri','Hebbe Falls','Bhadra Wildlife Sanctuary','Kudremukh National Park'],
  wayanad:['Edakkal Caves','Banasura Sagar Dam','Chembra Peak','Soochipara Falls','Wayanad Wildlife Sanctuary'],
  hassan:['Chennakeshava Temple, Belur','Hoysaleswara Temple','Shravanabelagola','Shettihalli Rosary Church'],
  sakleshpur:['Manjarabad Fort','Bisle Reserve Forest','Sakleshpur','Kukke Subramanya Temple'],
  kabini:['Nagarhole National Park','Kabini River','Kabini Dam','Bandipur National Park'],
  bandipur:['Bandipur National Park','Mudumalai National Park','Gopalaswamy Betta','Nagarhole National Park'],
  hampi:['Virupaksha Temple','Vijaya Vittala Temple','Hampi','Lotus Mahal','Matanga Hill'],
  gokarna:['Gokarna','Om Beach','Kudle Beach','Mahabaleshwar Temple, Gokarna','Mirjan Fort'],
  udupi:['Udupi Sri Krishna Matha','Malpe','St. Mary’s Islands','Kaup Lighthouse'],
  mangalore:['Panambur Beach','Kadri Manjunath Temple','Mangaladevi Temple, Mangalore','Tannirbhavi Beach','Kudroli Gokarnath Temple'],
  'jog-falls':['Jog Falls','Sharavathi Valley Wildlife Sanctuary','Linganamakki Dam','Ikkeri'],
  shivanasamudra:['Shivanasamudra Falls','Gaganachukki','Bharachukki','Ranganathaswamy Temple, Shivanasamudra'],
  chennai:['Marina Beach','Kapaleeshwarar Temple','Fort St. George, India','Government Museum, Chennai','San Thome Basilica'],
  hyderabad:['Charminar','Golconda Fort','Salar Jung Museum','Chowmahalla Palace','Hussain Sagar'],
  tirupati:['Venkateswara Temple','Sri Venkateswara National Park','Chandragiri Fort','Kapila Theertham'],
  coimbatore:['Marudhamalai','Dhyanalinga','Adiyogi Shiva statue','Siruvani Waterfalls','Perur Pateeswarar Temple'],
  goa:['Basilica of Bom Jesus','Fort Aguada','Dudhsagar Falls','Anjuna','Baga, Goa'],
  pondicherry:['Promenade Beach, Puducherry','Sri Aurobindo Ashram','Auroville','French Quarter, Puducherry','Paradise Beach, Puducherry'],
  shivamogga:['Shivappa Nayaka Palace, Shimoga','Tiger and Lion Safari','Linganamakki Dam','Bhadra Wildlife Sanctuary','Jog Falls'],
  bhadravati:['Lakshmi Narasimha Temple, Bhadravati','Bhadra Dam','Bhadra Wildlife Sanctuary','Amrutesvara Temple, Amruthapura'],
  birur:['Kemmannugundi','Amrutesvara Temple, Amruthapura','Hebbe Falls','Kalhattigiri Falls','Bhadra Wildlife Sanctuary']
};
const routeEstimates={
  goa:['about 560 km','about 10 hours'],tirupati:['about 250 km','about 5 hours'],chennai:['about 350 km','about 6 hours'],
  hyderabad:['about 565 km','about 9.5 hours'],mangalore:['about 350 km','about 9 hours'],hampi:['about 345 km','about 7 hours'],shivamogga:['about 280 km','about 5.5 hours'],bhadravati:['about 265 km','about 5.5 hours'],birur:['about 213 km','about 4.5 hours']
};
const routeNotes={
  wayanad:'A hill country journey to waterfalls, caves and forest reserves.',
  hassan:'Explore Hoysala temples and heritage sites around Hassan.',
  sakleshpur:'Take the hill roads through coffee estates and the Western Ghats.',
  kabini:'Travel to the Kabini wildlife and backwater region.',
  bandipur:'A route to a protected forest reserve; check visitor and entry guidance before travel.',
  hampi:'Explore the temple streets and boulder landscape of the Vijayanagara ruins.',
  gokarna:'A coastal drive to Gokarna’s beaches and temple.',
  udupi:'A coastal city journey for Sri Krishna Temple and nearby beaches.',
  mangalore:'A coastal route connecting Mangaluru’s temples, markets and beaches.',
  'jog-falls':'Drive to the Sharavathi River waterfalls near Sagara.',
  shivanasamudra:'A waterfall and heritage outing along the Cauvery River.',
  chennai:'A long inter-state drive; allow extra time around Chennai traffic.',
  hyderabad:'Plan an inter-state highway journey with breaks along the way.',
  tirupati:'A pilgrimage route to Tirupati; confirm temple plans and timing before travel.',
  coimbatore:'A Tamil Nadu route and gateway for onward travel to the Nilgiri hills.',
  goa:'A full-day road journey; plan rest stops along the route.',
  pondicherry:'A long drive to Puducherry; allow time for highway stops.',
  shivamogga:'A Western Ghats gateway with riverside outings, wildlife experiences and waterfalls across the district.',
  bhadravati:'Plan a heritage and nature outing around the historic temple, Bhadra reservoir and nearby sanctuary.',
  birur:'A relaxed base for the Kemmannugundi hills, waterfalls and Hoysala heritage around Amruthapura.'
};
window.CAB_DATA = {
  vehicles: [
    { id:'sedan', name:'Sedan', seats:'4+1', note:'Sedan for city and airport rides.', airport:1300, airportExtra:16, local4:1300, local8:2300, local4Km:15, local4Hour:190, local8Km:15, local8Hour:190, fullDay:4200, outstation:4200, minKm:300, allowance:300, night:300, image:'assets/fleet-sedan.jpg', features:['Air-conditioned'] },
    { id:'ciaz', name:'Ciaz', seats:'4+1', note:'Executive sedan for private trips.', airport:2000, airportExtra:16, local4:1700, local8:2500, local4Km:15, local4Hour:200, local8Km:16, local8Hour:200, fullDay:5200, outstation:5200, minKm:300, allowance:400, night:400, image:'assets/fleet-sedan.jpg', features:['Air-conditioned'] },
    { id:'mpv', name:'Ertiga', seats:'6+1', note:'MPV for family and group travel.', airport:2100, airportExtra:16, local4:1900, local8:3000, local4Km:16, local4Hour:200, local8Km:16, local8Hour:230, fullDay:5200, outstation:5200, minKm:300, allowance:400, night:400, image:'assets/fleet-mpv.jpg', features:['Air-conditioned'] },
    { id:'innova', name:'Innova', seats:'7+1', note:'Spacious MPV for longer journeys.', airport:2200, airportExtra:18, local4:2300, local8:3200, local4Km:17, local4Hour:230, local8Km:17, local8Hour:230, fullDay:5800, outstation:5800, minKm:300, allowance:400, night:400, image:'assets/fleet-suv.jpg', features:['Air-conditioned'] },
    { id:'crysta', name:'Innova Crysta', seats:'7+1', note:'Premium MPV for private journeys.', airport:2400, airportExtra:20, local4:2600, local8:3600, local4Km:20, local4Hour:230, local8Km:20, local8Hour:230, fullDay:6400, outstation:6400, minKm:300, allowance:400, night:400, image:'assets/fleet-suv.jpg', features:['Air-conditioned'] },
    { id:'traveller', name:'Tempo Traveller', seats:'12+', note:'Group vehicle for larger parties.', outstation:7500, minKm:300, allowance:600, night:600, groupOnly:true, image:'assets/fleet-traveller.jpg', features:['Air-conditioned'] },
    { id:'minibus', name:'Mini Bus', seats:'21', note:'21-seat vehicle for large groups.', outstation:11600, minKm:300, allowance:800, night:800, groupOnly:true, image:'assets/groovy-mini-bus.svg', features:['21 seats'] }
  ],
  routes: [
    { slug:'bangalore-to-mysore', name:'Mysore', distance:'about 145 km', time:'about 3.5 hours', note:'Palaces, markets and an easy change of pace.',wiki:'Mysore',places:placesByCity.mysore },
    { slug:'bangalore-to-coorg', name:'Coorg', distance:'about 265 km', time:'about 5.5 hours', note:'A comfortable start to your hill country escape.',wiki:'Kodagu',places:placesByCity.coorg },
    { slug:'bangalore-to-ooty', name:'Ooty', distance:'about 270 km', time:'about 6.5 hours', note:'Take the scenic road to the Nilgiris.',wiki:'Ooty',places:placesByCity.ooty },
    { slug:'bangalore-to-chikmagalur', name:'Chikmagalur', distance:'about 245 km', time:'about 5 hours', note:'Coffee country is better at your own pace.',wiki:'Chikkamagaluru',places:placesByCity.chikmagalur },
    ...['Wayanad','Hassan','Sakleshpur','Kabini','Bandipur','Hampi','Gokarna','Udupi','Mangalore','Jog Falls','Shivanasamudra','Chennai','Hyderabad','Tirupati','Coimbatore','Goa','Pondicherry','Shivamogga','Bhadravati','Birur'].map(name=>{const slug=`bangalore-to-${name.toLowerCase().replaceAll(' ','-')}`;const key=slug.replace('bangalore-to-','');const [distance,time]=routeEstimates[key]||['Distance varies by destination','Plan your departure with us'];return {slug,name,distance,time,note:routeNotes[key]||'A private ride, planned around your journey.',wiki:wikipediaPages[key]||name,places:placesByCity[key]||[]}})
  ],
  faqs: [
    ['How do I book an airport cab?','Share your pickup, flight timing and passenger count in the booking form. We’ll prepare a WhatsApp message so our team can confirm availability and your final fare.'],
    ['Can I book in advance?','Yes. Choose your travel date and time, then send the trip details to request a booking. Advance notice is recommended for early morning trips and larger vehicles.'],
    ['How does outstation pricing work?','Indicative fares use the selected vehicle rate and the minimum kilometres per day. Tolls, parking and applicable night charges are added separately and confirmed before travel.'],
    ['Are tolls and parking included?','For outstation trips, tolls and parking are payable as incurred unless your confirmed quote says otherwise. Airport fares are estimates and must be confirmed for your pickup point.'],
    ['Can I choose a one-way trip?','Yes. Select one-way or round-trip in the booking flow. Availability and the final fare depend on the route and travel date.'],
    ['When will I receive driver details?','Driver and vehicle details are shared after the trip is confirmed. Contact the team directly if your pickup is approaching and you have not received them.'],
    ['What is the cancellation policy?','Cancellation terms depend on the booking and timing. Ask the team to include the applicable terms in your confirmation.'],
    ['Can I pay online?','Payment options are confirmed when your booking is accepted. Do not send payment until you have received booking details from the operator.']
  ]
};

