import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { InputTextarea } from 'primereact/inputtextarea';

const API = 'http://localhost:9002/api/category';

const token = localStorage.getItem('token');
const authHeader = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};


const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: null,
    categoryName: '',
    description: '',
    itemCount: 0,
    status: 'Active'
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/with-counts`, authHeader);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAdd = () => {
    setEditing(false);
    setFormData({ categoryId: null, categoryName: '', description: '', itemCount: 0, status: 'Active' });
    setDialogVisible(true);
  };

  const handleOpenEdit = (cat) => {
    setEditing(true);
    setFormData({ ...cat });
    setDialogVisible(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`${API}/${formData.categoryId}`, formData, authHeader);
      } else {
        await axios.post(`${API}/add`, { ...formData, createdAt: new Date().toISOString() }, authHeader);
      }
      setDialogVisible(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      const endpoint = cat.status === 'Active' ? 'deactivate' : 'activate';
      await axios.put(`${API}/${cat.categoryId}/${endpoint}`,null, authHeader);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`,authHeader);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const result = categories.filter(cat =>
      (selectedStatus === 'All' || cat.status === selectedStatus) &&
      (cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFiltered(result);
  }, [categories, searchTerm, selectedStatus]);

  const totalItems = categories.reduce((sum, c) => sum + c.itemCount, 0);

  return (
    <div style={{ width: '100%', margin: '2rem auto', fontFamily: 'Arial', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '24px' }}>Category Management</h2>
        <Button
          label="Add Category"
          icon={<Plus size={14} />}
          onClick={handleOpenAdd}
          style={{ backgroundColor: '#f97316', border: 'none' }}
        />
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {[
          { label: 'Total Categories', value: categories.length, color: '#3b82f6' },
          { label: 'Active Categories', value: categories.filter(c => c.status === 'Active').length, color: '#10b981' },
          { label: 'Inactive Categories', value: categories.filter(c => c.status === 'Inactive').length, color: '#ef4444' },
          { label: 'Total Items', value: totalItems, color: '#a855f7' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#fff', padding: '16px', borderRadius: '12px',
            width: '200px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{stat.label}</p>
            <h3 style={{ margin: 0, color: stat.color }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', marginTop: '20px', gap: '10px' }}>
        <InputText
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 0.7, paddingLeft: '30px' }}
        />
        <Dropdown
          value={selectedStatus}
          options={['All', 'Active', 'Inactive']}
          onChange={(e) => setSelectedStatus(e.value)}
          placeholder="Select Status"
          style={{ width: '280px' }}
        />
      </div>

      {/* Category Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '30px' }}>
        {filtered.map(category => (
          <div key={category.categoryId} style={{
            background: '#fff', borderRadius: '12px', padding: '16px',
            width: '300px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>{category.categoryName}</h4>
              <span style={{
                fontSize: '12px', padding: '2px 8px',
                borderRadius: '8px',
                backgroundColor: category.status === 'Active' ? '#dcfce7' : '#fee2e2',
                color: category.status === 'Active' ? '#16a34a' : '#b91c1c'
              }}>{category.status}</span>
            </div>
            <p>{category.itemCount} items</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>{category.description}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Created: {category.createdAt}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <Button icon={<Pencil size={14} />} label="Edit"
                onClick={() => handleOpenEdit(category)}
                style={{ backgroundColor: '#f3f4f6', color: '#111827', border: 'none' }}
              />
              <Button label={category.status === 'Active' ? 'Deactivate' : 'Activate'}
                onClick={() => handleToggleStatus(category)}
                style={{ backgroundColor: category.status === 'Active' ? '#ef4444' : '#22c55e', border: 'none' }}
              />
              <Button icon={<Trash2 size={14} />} onClick={() => handleDelete(category.categoryId)}
                style={{ backgroundColor: '#ef4444', border: 'none' }}
                disabled 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog header={editing ? "Edit Category" : "Add Category"}
              visible={dialogVisible}
              onHide={() => setDialogVisible(false)}
              style={{ width: '400px' }}
            >
              <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>Category Name</label>
                <InputText placeholder="Name" value={formData.categoryName} onChange={e => setFormData({ ...formData, categoryName: e.target.value })} />
                <label>Description</label>
                <InputTextarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                {/* <InputText keyfilter="int" placeholder="Item Count" value={formData.itemCount} onChange={e => setFormData({ ...formData, itemCount: parseInt(e.target.value || 0) })} /> */}
                <label>Status</label>
                <Dropdown value={formData.status} options={['Active', 'Inactive']} onChange={e => setFormData({ ...formData, status: e.value })} placeholder="Status" />
                <Button label={editing ? "Update" : "Add"} onClick={handleSave} style={{ backgroundColor: 'orange', border: 'none' }} />
              </div>
            </Dialog>
    </div>
  );
};

export default CategoryManagement;
