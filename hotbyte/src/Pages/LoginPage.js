import React from 'react';
import Login from '../Components/Login';
import CustomMenubar from '../Components/CustomMenubar';
import Footer from '../Components/Footer';

const LoginPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-orange-50">
            <CustomMenubar />
            <main className="flex-grow flex items-center justify-center">
                <Login />
            </main>
            <Footer/>
        </div>
    );
};

export default LoginPage;
