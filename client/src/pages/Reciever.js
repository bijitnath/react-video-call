import React, { useEffect, useState, useRef, Suspense } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import Rodal from 'rodal'
import { Howl } from 'howler'

import Navigation from '../Components/Navigation/Navigation'
import Footer from '../Components/Footer/Footer'
import socketIOClient from "socket.io-client";
import 'rodal/lib/rodal.css'
import socketClient from "socket.io-client";
import camera from '../Icons/camera.svg'
import camerastop from '../Icons/camera-stop.svg'
import microphone from '../Icons/microphone.svg'
import microphonestop from '../Icons/microphone-stop.svg'
import share from '../Icons/share.svg'
import hangup from '../Icons/hang-up.svg'
import fullscreen from '../Icons/fullscreen.svg'
import minimize from '../Icons/minimize.svg'
import ringtone from '../Sounds/ringtone.mp3'

const Watermark = React.lazy(() => import('../Components/Watermark/Watermark'))

const ringtoneSound = new Howl({
  src: [ringtone],
  loop: true,
  preload: true
})


function Reciever() {
  const [socketID, setSocketID] = useState("");
  const [myID, setMyID] = useState("");
  const [myName, setMyName] = useState("");
  const [callFrom, setCallFrom] = useState("");
  const [callFromName, setCallFromName] = useState("");
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callingFriend, setCallingFriend] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [receiverID, setReceiverID] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [isfullscreen, setFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const myPeer = useRef();

  useEffect(() => {
    socket.current = io.connect("/");
    const queryParams = new URLSearchParams(window.location.search);
    var myID = queryParams.get('myID');
    var myName = queryParams.get('myName');
    var callFrom = queryParams.get('callFrom');
    var callFromName = queryParams.get('callFromName');
    setMyID(myID);
    setMyName(myName);
    setCallFrom(callFrom);
    setCallFromName(callFromName);

    //acceptCall();

    socket.current.emit("please_send_stream", { toID: callFrom })

    socket.current.on("video_stream", (data) => {
      if (data.toID == myID) {
        console.log(data.stream)
        setStream(data.stream);
        setCallingFriend(true)
        setCallerSignal(data.stream);
        acceptCall();
      }
    })

    socket.current.on("socket_id", (id) => {
      setSocketID(id);
    })

  }, []);


  function acceptCall() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      userVideo.current.srcObject = stream;
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });
      setCallingFriend(true)
      myPeer.current = peer

      peer.on("signal", data => {
        socket.current.emit("acceptCall", { toID: callFrom, stream: data })
      })

      peer.on("stream", stream => {
        partnerVideo.current.srcObject = stream;
      });

      peer.on('error', (err) => {
        //endCall()
      })

      peer.signal(callerSignal);

      socket.current.on('close', () => {
        window.location.reload()
      })
    })
      .catch((e) => {
        setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.' + e)
        setModalVisible(true)
      })
  }
  function renderLanding() {
    if (!callRejected && !callAccepted && !callingFriend)
      return 'block'
    return 'none'
  }
  let landingHTML = <>
    <main>
      <div>{callFromName} is calling you ...</div>
    </main>
  </>


  let UserVideo;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted && isfullscreen) {
    PartnerVideo = (
      <video className="partnerVideo cover" playsInline ref={partnerVideo} autoPlay />
    );
  } else if (callAccepted && !isfullscreen) {
    PartnerVideo = (
      <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
    );
  }
  function shareScreen() {
    navigator.mediaDevices.getDisplayMedia({ cursor: true })
      .then(screenStream => {
        myPeer.current.replaceTrack(stream.getVideoTracks()[0], screenStream.getVideoTracks()[0], stream)
        userVideo.current.srcObject = screenStream
        screenStream.getTracks()[0].onended = () => {
          myPeer.current.replaceTrack(screenStream.getVideoTracks()[0], stream.getVideoTracks()[0], stream)
          userVideo.current.srcObject = stream
        }
      })
  }
  function isMobileDevice() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };


  function endCall() {
    myPeer.current.destroy()
    socket.current.emit('close', { to: callFrom })
    window.location.reload()
  }


  let incomingCall;
  if (receivingCall && !callAccepted && !callRejected) {
    incomingCall = (
      <div className="incomingCallContainer">
        <div className="incomingCall flex flex-column">
          <div><span className="callerID">{caller}</span> is calling you!</div>
          <div className="incomingCallButtons flex">
            <button name="accept" className="alertButtonPrimary" onClick={() => acceptCall()}>Accept</button>
            <button name="reject" className="alertButtonSecondary" >Reject</button>
          </div>
        </div>
      </div>
    )
  }
  function toggleMuteAudio() {
    if (stream) {
      setAudioMuted(!audioMuted)
      stream.getAudioTracks()[0].enabled = audioMuted
    }
  }

  function toggleMuteVideo() {
    if (stream) {
      setVideoMuted(!videoMuted)
      stream.getVideoTracks()[0].enabled = videoMuted
    }
  }


  let audioControl;
  if (audioMuted) {
    audioControl = <span className="iconContainer" onClick={() => toggleMuteAudio()}>
      <img src={microphonestop} alt="Unmute audio" />
    </span>
  } else {
    audioControl = <span className="iconContainer" onClick={() => toggleMuteAudio()}>
      <img src={microphone} alt="Mute audio" />
    </span>
  }

  let videoControl;
  if (videoMuted) {
    videoControl = <span className="iconContainer" onClick={() => toggleMuteVideo()}>
      <img src={camerastop} alt="Resume video" />
    </span>
  } else {
    videoControl = <span className="iconContainer" onClick={() => toggleMuteVideo()}>
      <img src={camera} alt="Stop audio" />
    </span>
  }

  let screenShare = <span className="iconContainer" onClick={() => shareScreen()}>
    <img src={share} alt="Share screen" />
  </span>
  if (isMobileDevice()) {
    screenShare = <></>
  }

  let hangUp = <span className="iconContainer" onClick={() => endCall()}>
    <img src={hangup} alt="End call" />
  </span>

  let fullscreenButton;
  if (isfullscreen) {
    fullscreenButton = <span className="iconContainer" onClick={() => { setFullscreen(false) }}>
      <img src={minimize} alt="fullscreen" />
    </span>
  } else {
    fullscreenButton = <span className="iconContainer" onClick={() => { setFullscreen(true) }}>
      <img src={fullscreen} alt="fullscreen" />
    </span>
  }

  function renderCall() {
    if (!callRejected && !callAccepted && !callingFriend)
      return 'none'
    return 'block'
  }
  return (
    <>
      <div style={{ display: renderLanding() }}>
        {landingHTML}
        <Rodal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          width={20}
          height={5}
          measure={'em'}
          closeOnEsc={true}
        >
          <div>{modalMessage}</div>
        </Rodal>
        {incomingCall}
      </div>
      <div className="callContainer" style={{ display: renderCall() }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Watermark />
        </Suspense>
        <div className="partnerVideoContainer">
          {PartnerVideo}
        </div>
        <div className="userVideoContainer">
          {UserVideo}
        </div>
        <div className="controlsContainer flex">
          {audioControl}
          {videoControl}
          {screenShare}
          {fullscreenButton}
          {hangUp}
        </div>
      </div>
    </>
  )


}


export default Reciever;