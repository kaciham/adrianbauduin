'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Client {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

interface ClientFormData {
  name: string;
  website: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo: File | null;
  removeLogo: boolean;
}

const initialFormData: ClientFormData = {
  name: '',
  website: '',
  description: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  logo: null,
  removeLogo: false
};

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      const searchQuery = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await fetch(`/api/admin/clients${searchQuery}`);
      const data = await response.json();
      
      if (data.success) {
        setClients(data.clients);
      } else {
        setMessage('Failed to load clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setMessage('Error loading clients');
    } finally {
      setLoading(false);
    }
  };

  // Load clients on component mount and search term change
  useEffect(() => {
    fetchClients();
  }, [searchTerm]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      logo: file,
      removeLogo: false // Reset remove flag when new file is selected
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('contactEmail', formData.contactEmail);
      formDataToSend.append('contactPhone', formData.contactPhone);
      formDataToSend.append('address', formData.address);
      
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      
      if (formData.removeLogo) {
        formDataToSend.append('removeLogo', 'true');
      }

      const url = editingClient ? `/api/admin/clients/${editingClient.id}` : '/api/admin/clients';
      const method = editingClient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setMessage(editingClient ? 'Client updated successfully!' : 'Client created successfully!');
        setFormData(initialFormData);
        setShowForm(false);
        setEditingClient(null);
        fetchClients(); // Refresh the client list
      } else {
        setMessage(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit client
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      website: client.website || '',
      description: client.description || '',
      contactEmail: client.contactEmail || '',
      contactPhone: client.contactPhone || '',
      address: client.address || '',
      logo: null,
      removeLogo: false
    });
    setShowForm(true);
  };

  // Handle delete client
  const handleDelete = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete "${client.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Client deleted successfully!');
        fetchClients(); // Refresh the client list
      } else {
        setMessage(data.error || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      setMessage('Error deleting client');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingClient(null);
    setShowForm(false);
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Client'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') || message.includes('Failed') 
          ? 'bg-red-100 text-red-700 border border-red-300' 
          : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          {message}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Client Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {editingClient?.logo && !formData.logo && (
                <div className="mt-2 flex items-center space-x-2">
                  <Image
                    src={editingClient.logo}
                    alt={`${editingClient.name} logo`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      name="removeLogo"
                      checked={formData.removeLogo}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Remove current logo</span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Saving...' : (editingClient ? 'Update Client' : 'Create Client')}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Client List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Clients ({clients.length})</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? 'No clients found matching your search.' : 'No clients found. Create your first client!'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {clients.map((client) => (
              <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {client.logo ? (
                      <Image
                        src={client.logo}
                        alt={`${client.name} logo`}
                        width={60}
                        height={60}
                        className="object-contain rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Logo</span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{client.name}</h3>
                      
                      {client.description && (
                        <p className="text-gray-600 mb-2">{client.description}</p>
                      )}
                      
                      <div className="text-sm text-gray-500 space-y-1">
                        {client.website && (
                          <div>
                            <strong>Website:</strong>{' '}
                            <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {client.website}
                            </a>
                          </div>
                        )}
                        {client.contactEmail && (
                          <div><strong>Email:</strong> {client.contactEmail}</div>
                        )}
                        {client.contactPhone && (
                          <div><strong>Phone:</strong> {client.contactPhone}</div>
                        )}
                        {client.address && (
                          <div><strong>Address:</strong> {client.address}</div>
                        )}
                        <div><strong>Created:</strong> {new Date(client.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}