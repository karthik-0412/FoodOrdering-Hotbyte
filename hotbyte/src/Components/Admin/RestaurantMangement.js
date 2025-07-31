import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import {
    Building,
    Star,
    Eye,
    Pencil,
    Check,
    Plus,
    Trash2,
    ShieldMinus
} from 'lucide-react';
import RestaurantDialog from './RestaurantDialog';

const RestaurantManagement = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const statusOptions = ['All', 'ACTIVE', 'INACTIVE'];
    const API_BASE = 'http://localhost:9002/api/restaurant';

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const token = localStorage.getItem('token');
    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const fetchRestaurants = async () => {
        try {
            const res = await axios.get(`${API_BASE}/all`, authHeader);
            setRestaurants(res.data);
        } catch (err) {
            console.error('Error fetching restaurants:', err);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const endpoint = `${API_BASE}/${id}/${currentStatus === 'ACTIVE' ? 'deactivate' : 'activate'}`;
            const res = await axios.put(endpoint, null, authHeader);
            setRestaurants(prev =>
                prev.map(r => r.restaurantId === id ? res.data : r)
            );
        } catch (err) {
            console.error('Toggle status error:', err);
        }
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE}/${id}`, authHeader);
            setRestaurants(prev => prev.filter(r => r.restaurantId !== id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleOpenDialog = (mode, restaurant = null) => {
        setDialogMode(mode);
        setSelectedRestaurant(restaurant);
        setDialogVisible(true);
    };

    const handleSubmit = async (data) => {
        try {
            if (dialogMode === 'add') {
                const res = await axios.post('http://localhost:9002/api/restaurant/register', data, authHeader);
                setRestaurants(prev => [...prev, res.data]);
            } else if (dialogMode === 'edit') {
                const res = await axios.put(`${API_BASE}/${selectedRestaurant.restaurantId}`, data, authHeader);
                setRestaurants(prev =>
                    prev.map(r => r.restaurantId === selectedRestaurant.restaurantId ? res.data : r)
                );
            }
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    const filteredRestaurants = restaurants.filter((r) =>
        (r.restaurantName ?? r.userdto?.name ?? '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || r.status === statusFilter)
    );

    const statCard = (label, value, icon) => (
        <div style={{
            flex: 1,
            padding: '1rem',
            background: '#fff',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            {icon}
            <p style={{ margin: '0.5rem 0 0' }}>{label}</p>
            <h3>{value}</h3>
        </div>
    );

    return (
        <div style={{ width: '100%', background: '#fff7ee', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Restaurant Management</h2>
                <Button
                    label="Add Restaurant"
                    icon={<Plus size={16} />}
                    onClick={() => handleOpenDialog('add')}
                    style={{ backgroundColor: '#f97316', border: 'none', color: '#fff' }}
                />
            </div>
            <p>Manage restaurants on the platform</p>

            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {statCard('Total Restaurants', restaurants.length, <Building color="#3b82f6" size={24} />)}
                {statCard('Active', restaurants.filter(r => r.status === 'ACTIVE').length, <Building color="#10b981" size={24} />)}
                {statCard('Average Rating', (
                    restaurants.length > 0 ? (restaurants.reduce((a, b) => a + (b.rating ?? 0), 0) / restaurants.length).toFixed(1) : '0'
                ), <Star color="#facc15" size={24} />)}
                {statCard('Inactive', restaurants.filter(r => r.status === 'INACTIVE').length, <Building color="#ef4444" size={24} />)}
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <span style={{ flex: 1, marginRight: '1rem' }}>
                    <InputText
                        placeholder="Search restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </span>
                <Dropdown
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.value)}
                    placeholder="Select Status"
                    style={{ marginRight: '1rem' }}
                />
            </div>

            {/* Restaurant cards */}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {filteredRestaurants.map((r) => (
                    <div key={r.restaurantId} style={{
                        flex: '1 1 30%',
                        padding: '1rem',
                        margin: '1rem',
                        background: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Building color="#f97316" size={20} />
                                <h4 style={{ marginLeft: '0.5rem' }}>{r.restaurantName ?? r.userdto?.name}</h4>
                            </div>
                            <span style={{
                                backgroundColor: r.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                                color: r.status === 'ACTIVE' ? '#065f46' : '#991b1b',
                                padding: '0.30rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                height: '25px'
                            }}>
                                {r.status}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <Star size={16} color="#fbbf24" />
                            <span style={{ marginLeft: '0.25rem' }}>{r.rating ?? '-'}</span>
                        </div>
                        <p><strong>Location:</strong> {r.location}</p>
                        <p><strong>Contact:</strong> {r.userdto?.phoneNumber}</p>
                        <p><strong>Email:</strong> {r.userdto?.email}</p>
                        <p><strong>Description:</strong> {r.description}</p>
                        <p><strong>Owner:</strong> {r.userdto?.name ?? r.user?.name ?? '-'}</p>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <Button icon={<Eye size={16} />} onClick={() => handleOpenDialog('view', r)} className="p-button-secondary p-button" outlined />
                            <Button icon={<Pencil size={16} />} onClick={() => handleOpenDialog('edit', r)} className="p-button-secondary p-button" outlined />
                            {r.status === 'ACTIVE' ? (
                                <Button
                                    label="Deactivate"
                                    icon={<ShieldMinus size={16} />}
                                    className="p-button-danger p-button"
                                    onClick={() => handleToggleStatus(r.restaurantId, r.status)} // ✅ pass status
                                />
                            ) : (
                                <Button
                                    label="Activate"
                                    icon={<Check size={16} />}
                                    className="p-button-success p-button"
                                    onClick={() => handleToggleStatus(r.restaurantId, r.status)} // ✅ pass status
                                />
                            )}

                            <Button
                                icon={<Trash2 size={16} />}
                                className="p-button-danger p-button"
                                onClick={() => handleDelete(r.restaurantId)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Dialog */}
            <RestaurantDialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                mode={dialogMode}
                restaurant={selectedRestaurant}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default RestaurantManagement;
