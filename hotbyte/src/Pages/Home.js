import React from 'react';
import CustomMenubar from '../Components/CustomMenubar';
import Hero from '../Components/Hero';
import Section1 from '../Components/Section1';
import Section2 from '../Components/Section2';
import Section3 from '../Components/Section3';
import SideBarUser from '../Components/UI/SideBarUser';
import Footer from '../Components/Footer';
const Home = () => {
  return (
    <>
      {/* <SideBarUser/> */}
      <CustomMenubar />
      <Hero />
      <Section1 />
      <Section2 />
      <Section3 />
      <Footer/>

    </>
  );
}
export default Home;