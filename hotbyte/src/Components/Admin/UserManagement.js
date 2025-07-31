import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Eye, UserRoundCheck, UserRoundX } from 'lucide-react';
import { Dialog } from 'primereact/dialog'
import { setUsers, setSearch, setRole, setStatus, setPage, setPerPage, addUser } from '../../state/slice/userSlice';
import axios from 'axios';

const token = localStorage.getItem('token');
const authHeader = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};


const getRoleBadge = (role) => {
    const colors = {
        CUSTOMER: '#fde68a',
        RESTAURANT: '#bfdbfe',
        ADMIN: '#e9d5ff'
    };
    return {
        backgroundColor: colors[role] || '#e5e7eb',
        color: '#111827',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        textTransform: 'capitalize'
    };
};



const getStatusBadge = (status) => {
    const colors = {
        ACTIVE: '#d1fae5',
        SUSPENDED: '#fecaca',
        INACTIVE: '#fef3c7'
    };
    return {
        backgroundColor: colors[status] || '#e5e7eb',
        color: '#111827',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        textTransform: 'capitalize'
    };
};

export default function UserManagement() {
    const dispatch = useDispatch();
    const { users, search, role, status, page, perPage } = useSelector((state) => state.user);

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editUser, setEditUser] = useState(null); // stores user being edited

    const [viewUser, setViewUser] = useState(null);
    const [showViewDialog, setShowViewDialog] = useState(false);


    const [showAddDialog, setShowAddDialog] = useState(false); // already exists
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        role: '',
        status: '',
        orders: 0,
        memberSince: new Date().toLocaleDateString()
    });
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:9002/api/users/get', authHeader);
                dispatch(setUsers(res.data));
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, [dispatch]);
    const exportToCSV = (userList) => {
    if (!userList.length) {
        alert("No data available to export.");
        return;
    }

    const headers = ["Name", "Email", "Phone", "Role", "Status", "Orders", "Last Login", "Member Since"];
    const csvRows = [headers.join(",")];

    userList.forEach(user => {
        const row = [
            user.name || '',
            user.email || '',
            user.phoneNumber || '',
            user.role || '',
            user.status || '',
            user.orders || 0,
            user.lastLogin || '',
            user.memberSince || ''
        ];
        csvRows.push(row.map(value => `"${value}"`).join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `users_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


    const filteredUsers = users.filter((u) => {
    const matchSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

    const matchRole =
        role === 'All Roles' || u.role?.toUpperCase() === role.toUpperCase();

    const matchStatus =
        status === 'All Statuses' || u.status?.toUpperCase() === status.toUpperCase();

    return matchSearch && matchRole && matchStatus;
});

    const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

    const summaryCard = (label, count, iconBg) => (
        <div style={{
            flex: 1,
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.2s ease',
            cursor: 'default'
        }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'} >
            <div style={{
                backgroundColor: iconBg,
                padding: '10px',
                borderRadius: '50%',
                color: 'white'
            }}>
                <i className="pi pi-user" />
            </div>
            <div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>{label}</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{count}</div>
            </div>
        </div>
    );

    return (
        <div style={{ width: '100%', margin: '2rem auto', fontFamily: 'Arial' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h2>User Management</h2>
                    <p style={{ color: '#6b7280' }}>Manage platform users and their permissions</p>
                </div>
                <Button
                    label="Add New User"
                    icon="pi pi-plus"
                    onClick={() => setShowAddDialog(true)}
                    style={{
                        backgroundColor: '#f97316',
                        border: 'none',
                        padding: '0.5rem 1rem'
                    }}
                />
            </div>



            {/* Stats Cards */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                margin: '1rem 0'
            }}>
                {summaryCard("Total Users", users.length, '#3b82f6')}
                {summaryCard("Active Users", users.filter(u => u.status === 'ACTIVE').length, '#10b981')}
                {summaryCard("Customers", users.filter(u => u.role === 'CUSTOMER').length, '#f97316')}
                {summaryCard("Restaurants", users.filter(u => u.role === 'RESTAURANT').length, '#a855f7')}
            </div>

            {/* Filters */}
            <div style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '12px',
                marginTop: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <InputText
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => dispatch(setSearch(e.target.value))}
                    style={{ flex: 1 }}
                />
                <Dropdown
                    value={role}
                    options={["All Roles", "CUSTOMER", "RESTAURANT", "ADMIN"]}
                    onChange={(e) => dispatch(setRole(e.value))}
                    placeholder="Select Role"
                />
                <Dropdown
                    value={status}
                    options={["All Statuses", "ACTIVE", "INACTIVE", "SUSPENDED"]}
                    onChange={(e) => dispatch(setStatus(e.value))}
                    placeholder="Select Status"
                />
                <Button
    label="Export CSV"
    icon="pi pi-file"
    onClick={() => exportToCSV(users)}
    style={{
        backgroundColor: '#22c55e',
        border: 'none',
        padding: '0.5rem 1rem',
        marginLeft: '1rem',
        color: 'white'
    }}
/>


            </div>

            {/* User Table */}
            <table style={{
                width: '100%',
                backgroundColor: 'white',
                borderCollapse: 'collapse',
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <thead style={{ background: '#f3f4f6', textAlign: 'left' }}>
                    <tr>
                        <th style={{ padding: '12px' }}>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last Login</th>
                        <th>Orders</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px' }}>
                                <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                                <div style={{ color: '#6b7280' }}>{user.email}</div>
                                <div style={{ color: '#6b7280', fontSize: '12px' }}>{user.phoneNumber}</div>
                            </td>
                            <td><span style={getRoleBadge(user.role)}>{user.role}</span></td>
                            <td><span style={getStatusBadge(user.status)}>{user.status}</span></td>
                            <td>{user.lastLogin}</td>
                            <td>{user.orders}</td>
                            <td style={{ display: 'flex', gap: '0.5rem', padding: '12px' }}>
                                <button style={{ background: '#e5e7eb', border: 'none', padding: '6px', borderRadius: '6px' }} onClick={() => {
                                    setViewUser(user); // sets the selected user to view
                                    setShowViewDialog(true);
                                }} onMouseDown={(e) => e.currentTarget.style.border = '3px solid rgba(61, 93, 237, 0.72)'}
                                    onMouseUp={(e) => e.currentTarget.style.border = '1px solid transparent'}
                                    onMouseLeave={(e) => e.currentTarget.style.border = '1px solid transparent'}>
                                    <Eye size={14} />
                                </button>
                                

                                <button
                                    style={{
                                        background: user.status === 'SUSPENDED' ? '#10b981' : '#ef4444', // green if suspended, red if active
                                        color: 'white',
                                        border: 'none',
                                        padding: '6px',
                                        borderRadius: '6px',
                                        height: '30px'
                                    }}
                                    onMouseDown={(e) =>
                                        e.currentTarget.style.border = '3px solid rgba(61, 93, 237, 0.72)'
                                    }
                                    onMouseUp={(e) =>
                                        e.currentTarget.style.border = '1px solid transparent'
                                    }
                                    onMouseLeave={(e) =>
                                        e.currentTarget.style.border = '1px solid transparent'
                                    }
                                    onClick={async () => {
                                        const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';

                                        try {
                                            await axios.put(`http://localhost:9002/api/users/${user.userId}`, {
                                                ...user,
                                                status: newStatus
                                            });

                                            const updatedUsers = users.map((u) =>
                                                u.email === user.email ? { ...u, status: newStatus } : u
                                            );
                                            dispatch(setUsers(updatedUsers));
                                        } catch (error) {
                                            console.error("Failed to update user status:", error);
                                            alert("Error updating user status.");
                                        }
                                    }}
                                >
                                    {user.status === 'SUSPENDED' ? (
                                        <UserRoundCheck size={14} /> // show check icon if currently suspended
                                    ) : (
                                        <UserRoundX size={14} /> // show suspend icon otherwise
                                    )}
                                </button>


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <Paginator
                first={(page - 1) * perPage}
                rows={perPage}
                totalRecords={filteredUsers.length}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                onPageChange={(e) => {
                    dispatch(setPage(e.page + 1));
                    dispatch(setPerPage(e.rows));
                }}
                style={{ marginTop: '1rem', justifyContent: 'flex-end' }}
            />

            {/* Add New Users */}
            <Dialog
                header="Add New User"
                visible={showAddDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowAddDialog(false)}
                modal
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    {/* Left Column */}
                    <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                            <InputText
                                placeholder="Full Name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                            <InputText
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                            <InputText
                                placeholder="Phone"
                                value={newUser.phoneNumber}
                                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                            <Dropdown
                                value={newUser.role}
                                options={['CUSTOMER', 'RESTAURANT', 'ADMIN']}
                                onChange={(e) => setNewUser({ ...newUser, role: e.value })}
                                placeholder="Select Role"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                            <Dropdown
                                value={newUser.status}
                                options={['ACTIVE', 'INACTIVE', 'SUSPENDED']}
                                onChange={(e) => setNewUser({ ...newUser, status: e.value })}
                                placeholder="Select Status"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Number of Orders</label>
                            <InputText
                                placeholder="Number of Orders"
                                type="number"
                                value={newUser.orders}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, orders: parseInt(e.target.value) || 0 })
                                }
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Member Since</label>
                            <InputText
                                value={newUser.memberSince}
                                disabled
                                style={{ width: '100%', backgroundColor: '#f9fafb' }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button
                            label="Cancel"
                            onClick={() => setShowAddDialog(false)}
                            style={{
                                backgroundColor: '#e5e7eb',
                                color: '#111827',
                                border: 'none'
                            }}
                        />
                        <Button
                            label="Save"
                            onClick={async () => {
                                try {
                                    const payload = {
                                        name: newUser.name,
                                        email: newUser.email,
                                        phoneNumber: newUser.phoneNumber,
                                        password: 'default123', // default password or make this a user input
                                        role: newUser.role.toUpperCase(),
                                        status: newUser.status.toUpperCase()
                                    };

                                    const response = await axios.post('http://localhost:9002/api/users', payload);

                                    // Optionally you can call the backend again or optimistically update UI
                                    const updatedUsers = [...users, response.data];
                                    dispatch(setUsers(updatedUsers));
                                    setShowAddDialog(false);
                                } catch (err) {
                                    console.error("Failed to create user:", err);
                                    alert("Error creating user.");
                                }
                            }}
                            style={{ backgroundColor: 'orange', color: 'white', border: 'none' }}
                        />

                    </div>
                </div>
            </Dialog>


            {/* view the dialog */}
            <Dialog
                header="User Details"
                visible={showViewDialog}
                style={{ width: '40vw' }}
                onHide={() => setShowViewDialog(false)}
                modal
            >
                {viewUser && (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            rowGap: '1.5rem',
                            columnGap: '2rem',
                            padding: '1rem 0',
                            fontSize: '0.95rem'
                        }}
                    >
                        {/* Name */}
                        <div style={{ flex: '1 1 45%' }}>
                            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Name</strong>
                            <span>{viewUser.name}</span>
                        </div>

                        {/* Email */}
                        <div style={{ flex: '1 1 45%' }}>
                            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Email</strong>
                            <span>{viewUser.email}</span>
                        </div>

                        {/* Phone */}
                        <div style={{ flex: '1 1 45%' }}>
                            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Phone</strong>
                            <span>{viewUser.phoneNumber}</span>
                        </div>

                        {/* Role */}
                        <div style={{ flex: '1 1 45%' }}>
                            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Role</strong>
                            <span
                                style={{
                                    backgroundColor: '#fef3c7',
                                    color: '#92400e',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {viewUser.role}
                            </span>
                        </div>

                        {/* Status */}
                        <div style={{ flex: '1 1 45%' }}>
                            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Status</strong>
                            <span
                                style={{
                                    backgroundColor: viewUser.status === 'ACTIVE' ? '#d1fae5' : '#fef2f2',
                                    color: viewUser.status === 'ACTIVE' ? '#065f46' : '#991b1b',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {viewUser.status}
                            </span>
                        </div>

                        {/* Member Since */}
                        <div style={{ flex: '1 1 45%' }}>
                            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Member Since</strong>
                            <span>{viewUser.memberSince}</span>
                        </div>

                        {/* Total Orders */}
                        <div style={{ flex: '1 1 45%' }}>
                            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Total Orders</strong>
                            <span>{viewUser.orders}</span>
                        </div>
                    </div>
                )}
            </Dialog>



        </div>
    );
}
