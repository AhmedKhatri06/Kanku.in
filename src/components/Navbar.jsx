import React from 'react'
import {AppBar, Toolbar, Typography ,Button} from '@mui/material';
export const Navbar = () => {
  return (
    <div>
        <AppBar>
            <Toolbar>
                <Typography sx={{flexGrow:2}}>Kanku.in</Typography>
                <Button color="White" href="/home.jsx">Home</Button>
                <Button color="White" href="/login.jsx">Login</Button>
                <Button color="White" href="/signup.jsx">Signup</Button>
                <Button color="White" href="/logout.jsx">Logout</Button>  
            </Toolbar>
        </AppBar>
    </div>
  )
}
