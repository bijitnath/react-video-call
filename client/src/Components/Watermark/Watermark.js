import React from 'react'
import cuckoologo from '../../Icons/logo_2.png'
import './Watermark.css'

function Watermark(){
    return (
        <div className="watermark">
            <img className="logoImage" src={cuckoologo} alt="Kawppui"/>
            <span className="logoText">Kawppui</span>
        </div>
    )
}

export default Watermark