import React from 'react';
import ContactUser from '../Components/ContactUser'; // Adjust the import path as necessary
import CustomMenubar from '../Components/CustomMenubar'; // Adjust the import path as necessary
import { Link } from 'react-router-dom'; // Import Link for navigation
const Contact = () => {
    return (
        <>
            <CustomMenubar />
            {/* You can add a header or title for the Contact page */}
            <ContactUser />

        </>
    );
}
export default Contact;