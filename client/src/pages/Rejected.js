import React, { useEffect, useState, useRef, Suspense,Text } from 'react';
import Watermark from '../Components/Watermark/Watermark';
import './style3.css'


function Rejected() {
return(
    <div style={{ marginLeft: 25, paddingTop: 50, marginRight: 25, color: 'white', fontSize: 25, fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    Call has been Rejected</div>
);
}
export default Rejected;