import React, { Component } from 'react';
import logo from './logo.svg';
import {Map, InfoWindow, Marker, GoogleApiWrapper, Polyline} from 'google-maps-react';
import { Button, Input, Segment, Header, Container, Menu, Label, Step } from 'semantic-ui-react'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airports: [],
      airport_names: [],
      currentItinerary: [],
      curr_start: '',
      curr_end: '',
      center_lat: Number,
      center_lng: Number,
      coords: [],
      user_lat: Number,
      user_lng: Number
    };
  }

   componentWillMount() {
     this.handleBegin();
   }

  returnCurrentPos = async(position) => {
    this.setState({
      user_lat: position.coords.latitude,
      user_lng: position.coords.longitude
    });
  }

  handleBegin = async () => {
      //Gets user's current location.
      navigator.geolocation.getCurrentPosition(this.returnCurrentPos)
      //this.handleAirports();
  }

  handleStartChange = async (e,data) => {
    await this.handleAutoComplete(data.value);


    const result = data.value.slice(0,3)
    this.setState({
      curr_start: result
    });
  }

  handleEndChange = async (e,data) => {
    await this.handleAutoComplete(data.value);

    const result = data.value.slice(0,3)
    this.setState({
      curr_end: result
    });
  }

  handleButtonClick = async () => {
    const {curr_start, curr_end} = this.state;
    const url = "https://b7b0cfe0.ngrok.io/compute"

    const body = {
      start: curr_start.toUpperCase(),
      end: curr_end.toUpperCase()
    }

    const query = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(body)
    })

    const json = await query.json();
    console.log(json)

    let temp = [];
    let coords = [];
    for(let element in json){

      temp.push({iata: json[element].iata, name:json[element].name,lat: json[element].lat, lng: json[element].lng})
      coords.push({lat: parseFloat(json[element].lat), lng: parseFloat(json[element].lng)})
    }
    console.log(coords)
    this.setState({
      airports: temp,
      coords: coords,
      center_lat: coords[0].lat,
      center_lng: coords[0].lng
    });
  }

  handleAutoComplete = async (curr_input) => {
    if(curr_input !== ''){
      const url = "https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=4AmXBV32ASqGFcyq5eYK3O04RsatzXID&term=" + curr_input
      const query = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          headers: {
              "Content-Type": "application/json; charset=utf-8",
              // "Content-Type": "application/x-www-form-urlencoded",
          },
      })

      this.setState({
        airport_names: await query.json(),
      });
    }
  }

  render() {
    const {airports, airport_names, user_lat, user_lng, coords} = this.state

    return (
      <div className="App">
          <Menu fixed='top'>
                <Header  style={{paddingTop: 20, paddingLeft: 10, fontSize: 30}}>✈️</Header>
                  <Input list='airports' label='From' onChange={this.handleStartChange}  style={{padding: 10}} size='big'/>
                  <datalist id='airports'>
                    {
                      airport_names && airport_names.map(name => (
                        <option value={name.value + ' - ' + name.label} />))
                    }
                  </datalist>
                <Input list='airports' label='To' onChange={this.handleEndChange} style={{padding: 10}} size='big'/>
                <datalist id='airports'>
                  {
                    airport_names && airport_names.map(name => (
                      <option value={name.value}>name.value + ' - ' + name.label</option>))
                  }
                </datalist>
                <div style={{paddingTop: 15, paddingRight: 150}}>
                  <Button fluid onClick={this.handleButtonClick} color='yellow' size='medium' >
                    Get Itinerary
                  </Button>
                </div>
          </Menu>
            <Map
              initialCenter={{
                lat: user_lat,
                lng: user_lng
              }}
              center={{lat: this.state.center_lat, lng: this.state.center_lng}}
              className="map"
              google={this.props.google}
              style={{ height: '100%', position: 'relative', width: '100%' }}
              zoom={4}
            >

            <Marker
              name={'Your Position'}
              position={{lat: user_lat, lng: user_lng}}
              icon={{
                url: "http://pluspng.com/img-png/you-are-here-png-hd-you-are-here-icon-512.png",
                anchor: new this.props.google.maps.Point(32,32),
                scaledSize: new this.props.google.maps.Size(32,32)
              }}
            />

            {
              airports.map((airportPos,i) => <Marker
                     name={airportPos.name}
                    position={{lat: airportPos.lat, lng: airportPos.lng}}
                    label={i}
                     />)
            }
            <Polyline
              path={coords}
              strokeColor="#FABD08"
              strokeOpacity={0.8}
              strokeWeight={2} />
            </Map>
            <Menu fixed="bottom">
            <Step.Group ordered>

            {
              airports.map((airportPos,i) =>
              <Step active>
                <Step.Content>
                  <Step.Title as="a" href={"https://www.google.com/search?q=" + airportPos.name}>{airportPos.name}</Step.Title>
                </Step.Content>
              </Step>)
            }
            </Step.Group>
            </Menu>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBUqByN8IXznxHU8gOgELH9GIrlnlrMXZk")
})(App)
