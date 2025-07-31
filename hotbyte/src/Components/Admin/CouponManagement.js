import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';


const API_BASE = 'http://localhost:9002/api/coupons';
const token = localStorage.getItem('token');
const authHeader = {
    headers: {
        Authorization: `Bearer ${token}`
    }
};

const CouponManagement = () => {
    const toast = useRef(null);
    const [coupons, setCoupons] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Coupons');

    const [showDialog, setShowDialog] = useState(false);
    const [discountType, setDiscountType] = useState('fixed');
    const [newCoupon, setNewCoupon] = useState({
        name: '',
        code: '',
        description: '',
        discount: '',
        minOrder: '',
        maxDiscount: '',
        usageLimit: '',
        usageCount: 0,
        expiry: null,
        isActive: false,
    });

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [editDiscountType, setEditDiscountType] = useState('fixed');

    const fetchCoupons = async () => {
        try {
            const res = await axios.get(`${API_BASE}/all`, authHeader);
            setCoupons(res.data);
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch coupons' });
        }
    };


    useEffect(() => {
        fetchCoupons();
    }, []);

    const addCoupon = async () => {
        try {
            const status = newCoupon.isActive ? 'ACTIVE' : 'INACTIVE';
            const dto = {
                ...newCoupon,
                discount: Number(newCoupon.discount),
                minOrder: Number(newCoupon.minOrder),
                maxDiscount: Number(newCoupon.maxDiscount),
                usageLimit: Number(newCoupon.usageLimit),
                usageCount: 0,
                expiry: newCoupon.expiry,
                status,
            };
            await axios.post(API_BASE, dto, authHeader);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Coupon created' });
            fetchCoupons();
            setShowDialog(false);
            resetNewCoupon();
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create coupon' });
        }
    };


    const updateCoupon = async () => {
        try {
            const status = editingCoupon.isActive ? 'ACTIVE' : 'INACTIVE';
            const dto = {
                ...editingCoupon,
                discount: Number(editingCoupon.discount),
                minOrder: Number(editingCoupon.minOrder),
                maxDiscount: Number(editingCoupon.maxDiscount),
                usageLimit: Number(editingCoupon.usageLimit),
                expiry: editingCoupon.expiry,
                status,
            };
            await axios.put(`${API_BASE}/${editingCoupon.couponId}`, dto, authHeader);
            toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Coupon updated' });
            fetchCoupons();
            setShowEditDialog(false);
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update coupon' });
        }
    };


    const deleteCoupon = async (id) => {
        try {
            await axios.delete(`${API_BASE}/${id}`, authHeader);
            toast.current.show({ severity: 'warn', summary: 'Deleted', detail: 'Coupon deleted' });
            fetchCoupons();
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete coupon' });
        }
    };


    const toggleCouponStatus = async (coupon, activate) => {
        try {
            const updated = {
                ...coupon,
                status: activate ? 'ACTIVE' : 'INACTIVE',
            };
            await axios.put(`${API_BASE}/${coupon.couponId}`, updated, authHeader);
            toast.current.show({
                severity: activate ? 'success' : 'info',
                summary: activate ? 'Activated' : 'Deactivated',
                detail: `Coupon ${activate ? 'activated' : 'deactivated'}`,
            });
            fetchCoupons();
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
        }
    };


    const resetNewCoupon = () => {
        setNewCoupon({
            name: '',
            code: '',
            description: '',
            discount: '',
            minOrder: '',
            maxDiscount: '',
            usageLimit: '',
            usageCount: 0,
            expiry: null,
            isActive: false,
        });
        setDiscountType('fixed');
    };

    const statusOptions = [
        { label: 'All Coupons', value: 'All Coupons' },
        { label: 'ACTIVE', value: 'ACTIVE' },
        { label: 'EXPIRED', value: 'EXPIRED' },
        { label: 'INACTIVE', value: 'INACTIVE' },
    ];

    const filteredCoupons = coupons.filter(
        (c) =>
            (statusFilter === 'All Coupons' || c.status === statusFilter) &&
            c.name.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusTag = (status) => {
        const styles = {
            EXPIRED: { color: '#D32F2F', background: '#FFE0E0' },
            ACTIVE: { color: '#2E7D32', background: '#E8F5E9' },
            INACTIVE: { color: '#616161', background: '#F5F5F5' },
        };
        return (
            <span style={{ ...styles[status], fontSize: 12, padding: '2px 8px', borderRadius: 8, fontWeight: 'bold', marginLeft: 10 }}>
                {status}
            </span>
        );
    };

    const totalUsage = coupons.reduce((acc, cur) => acc + (cur.usageCount || 0), 0);
    const activeCount = coupons.filter((c) => c.status === 'ACTIVE').length;
    const expiredCount = coupons.filter((c) => c.status === 'EXPIRED').length;

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <Toast ref={toast} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2>Coupon Management</h2>
                <Button
                    label="Create Coupon"
                    icon={<Plus size={16} />}
                    onClick={() => setShowDialog(true)}
                    style={{ background: '#ff6600', border: 'none', color: 'white', borderRadius: 6 }}
                />
            </div>

            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                {[
                    { title: 'Total Coupons', value: coupons.length, color: '#3f51b5' },
                    { title: 'Active Coupons', value: activeCount, color: '#4caf50' },
                    { title: 'Expired', value: expiredCount, color: '#f44336' },
                    { title: 'Total Usage', value: totalUsage, color: '#9c27b0' },
                ].map((item, i) => (
                    <div key={i} style={{ flex: 1, background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: 14, color: '#777' }}>{item.title}</div>
                        <div style={{ fontSize: 24, fontWeight: 600, color: item.color }}>{item.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                <InputText
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name"
                    style={{ flex: 1 }}
                />
                <Dropdown
                    value={statusFilter}
                    options={statusOptions}
                    onChange={(e) => setStatusFilter(e.value)}
                    style={{ width: 200 }}
                />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                {filteredCoupons.map((coupon) => (
                    <div key={coupon.couponId} style={{ width: 350, background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4 style={{ margin: 0 }}>{coupon.name}{getStatusTag(coupon.status)}</h4>
                            <span style={{
                                backgroundColor: '#f4f4f4',
                                padding: '6px 12px',
                                fontFamily: 'monospace',
                                borderRadius: 6,
                                display: 'inline-block',
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#333',
                                border: '1px dashed #ccc',
                            }}>{coupon.code}</span>
                        </div>
                        <p>{coupon.description}</p>
                        <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <b>Discount:</b> <span>{coupon.discount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <b>Min Order:</b> <span>₹{coupon.minOrder}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <b>Max Discount:</b> <span>₹{coupon.maxDiscount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <b>Usage:</b> <span>{coupon.usageCount}/{coupon.usageLimit}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <b>Expires:</b> <span>{new Date(coupon.expiry).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <ProgressBar
                            value={(coupon.usageCount / coupon.usageLimit) * 100}
                            showValue={false}
                            style={{ height: 8, borderRadius: 5, color: 'orange',marginTop: 16, marginBottom: 16  }}
                            pt={{
                                value: {
                                    style: {
                                        backgroundColor: 'orange',
                                    },
                                },
                            }}
                        />
                        {/* <ProgressBar value={(coupon.usageCount / coupon.usageLimit) * 100} style={{ height: 6, marginTop: 10 }} /> */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                            <Button icon={<Pencil size={14} />} label="Edit" outlined onClick={() => {
                                setEditingCoupon({ ...coupon, isActive: coupon.status === 'ACTIVE' });
                                setEditDiscountType(coupon.discount.toString().includes('%') ? 'percentage' : 'fixed');
                                setShowEditDialog(true);
                            }} />
                            <Button label={coupon.status === 'INACTIVE' ? 'Activate' : 'Deactivate'} className={coupon.status === 'INACTIVE' ? 'p-button-success' : 'p-button-danger'} onClick={() => toggleCouponStatus(coupon, coupon.status === 'INACTIVE')} />
                            <Button icon={<Trash2 size={18} />} className="p-button-danger" onClick={() => deleteCoupon(coupon.couponId)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Coupon Dialog */}
            <Dialog header="Create Coupon" visible={showDialog} onHide={() => setShowDialog(false)} style={{ width: '600px' }} modal>
                <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <InputText placeholder="Code" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} />
                    <InputText placeholder="Title" value={newCoupon.name} onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })} />
                    <InputTextarea placeholder="Description" value={newCoupon.description} onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })} />
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Dropdown value={discountType} options={[{ label: 'Fixed ($)', value: 'fixed' }, { label: 'Percent (%)', value: 'percentage' }]} onChange={(e) => setDiscountType(e.value)} style={{ flex: 1 }} />
                        <InputText placeholder="Discount" value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })} style={{ flex: 1 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <InputText placeholder="Min Order ($)" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })} style={{ flex: 1 }} />
                        {discountType === 'percentage' && (
                            <InputText placeholder="Max Discount ($)" value={newCoupon.maxDiscount} onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })} style={{ flex: 1 }} />
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Calendar placeholder="Expiry" value={newCoupon.expiry} onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.value })} style={{ flex: 1 }} showIcon />
                        <InputText placeholder="Usage Limit" value={newCoupon.usageLimit} onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })} style={{ flex: 1 }} />
                    </div>
                    <div>
                        <Checkbox inputId="active" checked={newCoupon.isActive} onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.checked })} />
                        <label htmlFor="active" style={{ marginLeft: 8 }}>Active</label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <Button label="Cancel" outlined onClick={() => setShowDialog(false)} style={{ marginRight: 10 }} />
                        <Button label="Add Coupon" className="p-button-warning" onClick={addCoupon} />
                    </div>
                </div>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog header="Edit Coupon" visible={showEditDialog} onHide={() => setShowEditDialog(false)} style={{ width: '600px' }} modal>
                {editingCoupon && (
                    <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <InputText value={editingCoupon.code} onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })} />
                        <InputText value={editingCoupon.name} onChange={(e) => setEditingCoupon({ ...editingCoupon, name: e.target.value })} />
                        <InputTextarea value={editingCoupon.description} onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <Dropdown value={editDiscountType} options={[{ label: 'Fixed ($)', value: 'fixed' }, { label: 'Percent (%)', value: 'percentage' }]} onChange={(e) => setEditDiscountType(e.value)} style={{ flex: 1 }} />
                            <InputText value={editingCoupon.discount} onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: e.target.value })} style={{ flex: 1 }} />
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <InputText value={editingCoupon.minOrder} onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrder: e.target.value })} style={{ flex: 1 }} />
                            {editDiscountType === 'percentage' && (
                                <InputText value={editingCoupon.maxDiscount} onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscount: e.target.value })} style={{ flex: 1 }} />
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <Calendar value={new Date(editingCoupon.expiry)} onChange={(e) => setEditingCoupon({ ...editingCoupon, expiry: e.value })} showIcon style={{ flex: 1 }} />
                            <InputText value={editingCoupon.usageLimit} onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: e.target.value })} style={{ flex: 1 }} />
                        </div>
                        <div>
                            <Checkbox inputId="editActive" checked={editingCoupon.isActive} onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.checked })} />
                            <label htmlFor="editActive" style={{ marginLeft: 8 }}>Active</label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                            <Button label="Cancel" outlined onClick={() => setShowEditDialog(false)} style={{ marginRight: 10 }} />
                            <Button label="Update Coupon" className="p-button-warning" onClick={updateCoupon} />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default CouponManagement;
