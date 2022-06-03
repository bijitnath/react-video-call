import React, { useEffect, useState, useRef, Suspense,Text } from 'react';
import './style3.css'

function Close() {
return(
    <div style={{ marginLeft: 25, paddingTop: 50, marginRight: 25, color: 'white', fontSize: 25, fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    Call has been ended</div>
);
}
export default Close;