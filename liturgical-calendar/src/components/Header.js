import React from 'react'
import './Header.css'

function Header() {
  return (
    <div className='header'>  
        <a id="maximum-home" href="/"><strong>Liturgical Calendar</strong> </a>
        <a id="minimum-home"href="/"><strong>LC</strong> </a>
        <div class="header-right">
            <a href="/pages/about.html"><strong>About</strong></a>
            <a href="/pages/contact.html"><strong>contact</strong></a>
        </div>
    </div>
  )
}

export default Header