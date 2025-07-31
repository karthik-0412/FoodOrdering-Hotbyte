import React from 'react';
import { Users, Award, Clock, Shield, Heart, Globe } from 'lucide-react';
import Footer from './Footer';

const About = () => {
  const stats = [
    { label: 'Happy Customers', value: '50,000+', icon: <Users style={{ height: 32, width: 32 }} /> },
    { label: 'Partner Restaurants', value: '500+', icon: <Award style={{ height: 32, width: 32 }} /> },
    { label: 'Cities Served', value: '25+', icon: <Globe style={{ height: 32, width: 32 }} /> },
    { label: 'Orders Delivered', value: '1M+', icon: <Clock style={{ height: 32, width: 32 }} /> },
  ];

  const values = [
    {
      icon: <Heart style={{ height: 48, width: 48, color: '#f97316' }} />,
      title: 'Customer First',
      description: 'We prioritize customer satisfaction above everything else, ensuring every order exceeds expectations.',
    },
    {
      icon: <Shield style={{ height: 48, width: 48, color: '#f97316' }} />,
      title: 'Quality Assurance',
      description: 'We work only with trusted restaurants that maintain the highest standards of food quality and hygiene.',
    },
    {
      icon: <Clock style={{ height: 48, width: 48, color: '#f97316' }} />,
      title: 'Fast Delivery',
      description: 'Our efficient delivery network ensures your food arrives hot and fresh, right on time.',
    },
    {
      icon: <Globe style={{ height: 48, width: 48, color: '#f97316' }} />,
      title: 'Community Impact',
      description: 'We support local restaurants and create opportunities for delivery partners in our communities.',
    },
  ];

  // const team = [
  //   {
  //     name: 'Sarah Johnson',
  //     role: 'CEO & Founder',
  //     image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
  //     bio: 'Former tech executive with a passion for connecting people through food.',
  //   },
  //   {
  //     name: 'Michael Chen',
  //     role: 'CTO',
  //     image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
  //     bio: 'Technology leader focused on building scalable and reliable platforms.',
  //   },
  //   {
  //     name: 'Emily Rodriguez',
  //     role: 'Head of Operations',
  //     image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
  //     bio: 'Operations expert ensuring smooth delivery experiences across all markets.',
  //   },
  //   {
  //     name: 'David Kim',
  //     role: 'Head of Partnerships',
  //     image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
  //     bio: 'Restaurant industry veteran building strong partnerships with local businesses.',
  //   },
  // ];

  return (<>
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(to right, #f97316, #ef4444)', color: 'white', padding: '80px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px' }}>About HotByte</h1>
        <p style={{ fontSize: '20px', maxWidth: '700px', margin: '0 auto', color: '#fed7aa' }}>
          We're on a mission to connect food lovers with their favorite restaurants, delivering happiness one meal at a time.
        </p>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '64px 0', backgroundColor: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '16px', color: '#f97316' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ color: '#4b5563' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#f9fafb' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto', gap: '48px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Our Story</h2>
            <div style={{ color: '#4b5563', fontSize: '18px', lineHeight: '1.6' }}>
              <p>
                Founded in 2020, HotByte started with a simple idea: everyone deserves access to delicious, quality food delivered quickly and reliably. What began as a small startup has grown into a trusted platform serving millions of customers.
              </p>
              <p>
                We believe that food brings people together, and our technology should make it easier for restaurants to reach customers and for people to discover amazing meals from their local community.
              </p>
              <p>
                Today, we're proud to partner with hundreds of restaurants, support thousands of delivery drivers, and serve communities across the country with the same passion and commitment that started it all.
              </p>
            </div>
          </div>
          <div style={{ position: 'relative', flex: '1 1 400px' }}>
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Our Story"
              style={{ borderRadius: '8px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            />
            <div style={{ position: 'absolute', bottom: '-24px', left: '-24px', backgroundColor: '#f97316', color: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5 Years</div>
              <div style={{ color: '#fed7aa' }}>of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Our Values</h2>
          <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '700px', margin: '0 auto' }}>
            These core values guide everything we do and shape how we serve our community.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {values.map((value, index) => (
            <div key={index} style={{ textAlign: 'center', padding: '24px', borderRadius: '8px', transition: 'box-shadow 0.3s', cursor: 'pointer' }}>
              <div style={{ marginBottom: '16px' }}>{value.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>{value.title}</h3>
              <p style={{ color: '#4b5563' }}>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      {/* <section style={{ padding: '80px 0', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Meet Our Team</h2>
          <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '700px', margin: '0 auto' }}>
            The passionate people behind HotByte who work tirelessly to bring you the best food delivery experience.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {team.map((member, index) => (
            <div key={index} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s', cursor: 'pointer' }}>
              <img src={member.image} alt={member.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{member.name}</h3>
                <p style={{ color: '#f97316', fontWeight: '500', marginBottom: '12px' }}>{member.role}</p>
                <p style={{ color: '#4b5563', fontSize: '14px' }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Mission Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(to right, #f97316, #ef4444)', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>Our Mission</h2>
        <p style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', color: '#fed7aa' }}>
          To revolutionize food delivery by creating meaningful connections between restaurants, customers, and communities while maintaining the highest standards of quality, speed, and service.
        </p>
      </section>

      {/* Join Us Section */}
      <section style={{ padding: '64px 0', backgroundColor: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Join the HotByte Family</h2>
        <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '700px', margin: '0 auto 32px' }}>
          Whether you're a restaurant owner, delivery partner, or food lover, there's a place for you in our growing community.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
          <button style={{ backgroundColor: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
            Partner with Us
          </button>
          <button style={{ border: '1px solid #f97316', color: '#f97316', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', backgroundColor: 'white', cursor: 'pointer' }}>
            Become a Driver
          </button>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default About;
