import React from 'react'; 
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { useNavigate } from "react-router-dom";
 
export default function Buttons() {
    const nav = useNavigate();
    const SignInLogin=()=>{
        nav("/login")
    }
    const SignUpUser=()=>{
        nav("/signup")
    }
    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            
            <Button label="Login" icon={PrimeIcons.SIGN_IN} severity="warning" outlined style={{ margin: '0.5rem' }} onClick={SignInLogin}/>
            <Button label="Sign Up"icon={PrimeIcons.USER_PLUS} severity="warning" raised style={{ margin: '0.5rem' }} onClick={SignUpUser} />
            
        </div>
    )
}