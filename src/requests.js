import React from 'react';

class requests extends React.Component {



  sendRequest = (data) => new Promise((resolve, reject) => {
    console.log("Welcome in requests.js");
    console.log(data);


    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://192.0.3.77:1234/events/beacon_view", true);

    xhttp.setRequestHeader("Content-Type", "application/json");
    
    xhttp.timeout = 3000;

    xhttp.ontimeout = function(e) {
      console.log("sendRequest::::Request timeout!");
      reject(false);
    }

    xhttp.onreadystatechange = function() {
      if (this.readyState !== 4) return;
      if (this.status === 200) {
        console.log("sendRequest::::Complete");    
        resolve(xhttp.response);   
      } else {
        console.log('sendRequest::::Failed');
        reject(false);
      }

    };
    
   
  
    xhttp.setRequestHeader('x-access-token', data);
    xhttp.send();
   
  })
  
  sendUserRequest = (data, path) => new Promise((resolve, reject) => {

    console.log(data);
    console.log(path);


    var xhttp = new XMLHttpRequest();

    let sendData = JSON.stringify(data);

    if (path === 'refresh') {
      xhttp.open("GET", "http://192.0.3.77:1234/users/"+path, true);
      xhttp.setRequestHeader('x-access-token', data);
      sendData = null;
    } else xhttp.open("POST", "http://192.0.3.77:1234/users/"+path, true);

    

    xhttp.setRequestHeader("Content-Type", "application/json");

    
    xhttp.timeout = 3000;

    xhttp.ontimeout = function(e) {
      console.log("sendUserRequest::::Request timeout!\n\t");
      reject(false);
    }

    xhttp.onreadystatechange = function() {
      if (this.readyState !== 4) return;
      if (this.status === 200) {
        console.log("sendUserRequest::::Send complete");
        
        resolve(xhttp.response);
      } else if (this.status !== 200) {
        let errorMessage = 'Server is down!';
        console.log('ERROR::::'+errorMessage);
        reject();
      }
    };
    
  
    xhttp.send(sendData);
  })






 	createData = (item, pos) => new Promise((resolve, reject) => {
  	
  	let data = null;
  	let positionValues = '';
  	let posQuestionMarks = '';
  	let localData = [];
  	let posValues = {};

  	console.log("Welcome in requests.js");

  	if (pos === null) console.log("createData::::unFound pos");
  	else {
  		positionValues = ', speed, heading, accuracy, altitude, longitude, latitude';
  		posQuestionMarks = ', ?, ?, ?, ?, ?, ?'
  		localData.push(pos.speed, pos.heading, pos.accuracy, pos.altitude, pos.longitude, pos.latitude);
  		posValues = { 'speed': pos.speed, 'heading': pos.heading, 'accuracy': pos.accuracy, 'altitude': pos.altitude, 'longitude': pos.longitude, 'latitude': pos.latitude };
  		console.log("createData::::");
  		console.log(pos);
  	} 

	  if (item.protocol === 'IBeacon') {
	  	localData.unshift(item.uuid + '|' + item.major + '|' + item.minor, 'IBeacon');
	  	data = { 'uuid': item.uuid, 'major': item.major, 'minor': item.minor };
	  	data = Object.assign({}, data, posValues );
	  } else if (item.protocol === 'Eddystone') {
	  	localData.unshift(item.uuid + '|' + item.distance, 'Eddystone');
	  	
	  	data = { 'uuid': item.uuid, 'distance': item.distance };
	  	data = Object.assign({}, data, posValues );
	  }
	  resolve({localData, data, positionValues, posQuestionMarks});
	  
  })

}

const request = new requests();
export default request;