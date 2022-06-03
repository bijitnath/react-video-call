import React, { useEffect, useState, useRef, Suspense } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import Rodal from 'rodal'
import {Howl} from 'howler'

import Navigation from './Components/Navigation/Navigation'
import Footer from './Components/Footer/Footer'
import socketIOClient from "socket.io-client";
import  'rodal/lib/rodal.css'
import socketClient  from "socket.io-client";
import camera from './Icons/camera.svg'
import camerastop from './Icons/camera-stop.svg'
import microphone from './Icons/microphone.svg'
import microphonestop from './Icons/microphone-stop.svg'
import share from './Icons/share.svg'
import hangup from './Icons/hang-up.svg'
import fullscreen from './Icons/fullscreen.svg'
import minimize from './Icons/minimize.svg'
import ringtone from './Sounds/ringtone.mp3'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Call from './pages/Call';
import Reciever from './pages/Reciever';
import Common from './pages/Common';
import Close from './pages/Close';
import Rejected from './pages/Rejected';

const Watermark = React.lazy(()=>import('./Components/Watermark/Watermark'))

const ringtoneSound = new Howl({
  src: [ringtone],
  loop: true,
  preload: true
})


 function App(){
return(

  <Router>
       

  <div className="pages">
    <Switch>
    <Route exact path="/"  component={Call}/>
     <Route exact path="/reciever"  component={Reciever}/>
     <Route exact path="/common"  component={Common}/>
     <Route exact path="/close"  component={Close}/>
     <Route exact path="/rejected"  component={Rejected}/>
    </Switch>
  </div>
</Router>
 
)
 }

export default App;