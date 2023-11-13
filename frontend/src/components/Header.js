import React from 'react'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    
    <header>
      <nav>
        <Link to='/signup'><button>Signup</button></Link>
        <Link to='/login'><button>Login</button></Link>
      </nav>
    </header>
  )
}
