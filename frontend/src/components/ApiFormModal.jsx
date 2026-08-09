import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal.jsx';
import apiService from '../services/apiService';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const EMPTY_FORM = {
  name: '',
  url: '',
  method: 'GET',
  timeout: 10000,
  interval: 60000,
};

function ApiFormModal({ open, onClose, onSaved, editingApi }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!editingApi;

  useEffect(() => {
    if (open) {
      setForm(
        editingApi
          ? {
              name: editingApi.name,
              url: editingApi.url,
              method: editingApi.method,
              timeout: editingApi.timeout,
              interval: editingApi.interval,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, editingApi]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'timeout' || name === 'interval' ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.url.trim()) next.url = 'URL is required';
    else {
      try {
        const parsed = new URL(form.url);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
      } catch {
        next.url = 'Enter a full URL including https://';
      }
    }
    if (form.timeout < 1000 || form.timeout > 60000) next.timeout = 'Timeout must be 1000-60000 ms';
    if (form.interval < 5000) next.interval = 'Interval must be at least 5000 ms';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditMode) {
        await apiService.updateApi(editingApi._id, form);
        toast.success('API updated');
      } else {
        await apiService.createApi(form);
        toast.success('API created — monitoring will begin shortly');
      }
      onSaved();
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditMode ? 'Edit API' : 'Add API'}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="label-text" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Payment API"
          />
          {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="label-text" htmlFor="url">
            URL
          </label>
          <input
            id="url"
            name="url"
            value={form.url}
            onChange={handleChange}
            className="input-field"
            placeholder="https://api.example.com/health"
          />
          {errors.url && <p className="text-danger text-xs mt-1">{errors.url}</p>}
        </div>

        <div>
          <label className="label-text" htmlFor="method">
            Method
          </label>
          <select id="method" name="method" value={form.method} onChange={handleChange} className="input-field">
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-text" htmlFor="timeout">
              Timeout (ms)
            </label>
            <input
              id="timeout"
              name="timeout"
              type="number"
              value={form.timeout}
              onChange={handleChange}
              className="input-field"
            />
            {errors.timeout && <p className="text-danger text-xs mt-1">{errors.timeout}</p>}
          </div>
          <div>
            <label className="label-text" htmlFor="interval">
              Check interval (ms)
            </label>
            <input
              id="interval"
              name="interval"
              type="number"
              value={form.interval}
              onChange={handleChange}
              className="input-field"
            />
            {errors.interval && <p className="text-danger text-xs mt-1">{errors.interval}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Saving...' : isEditMode ? 'Save changes' : 'Add API'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ApiFormModal;
