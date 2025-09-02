import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AddSchool = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Append all form data
      Object.keys(data).forEach(key => {
        if (key === 'image' && data.image[0]) {
          formData.append('image', data.image[0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      await axios.post('/schools', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('School added successfully!');
      reset();
    } catch (error) {
      console.error('Error adding school:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert('Error: ' + error.response.data.error);
      } else {
        alert('Failed to add school. Please try again.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New School</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">School Name *</label>
          <input
            type="text"
            id="name"
            className="form-input"
            {...register('name', { required: 'School name is required' })}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">Address *</label>
          <input
            type="text"
            id="address"
            className="form-input"
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && <p className="error-message">{errors.address.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="city" className="form-label">City *</label>
          <input
            type="text"
            id="city"
            className="form-input"
            {...register('city', { required: 'City is required' })}
          />
          {errors.city && <p className="error-message">{errors.city.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="state" className="form-label">State *</label>
          <input
            type="text"
            id="state"
            className="form-input"
            {...register('state', { required: 'State is required' })}
          />
          {errors.state && <p className="error-message">{errors.state.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="contact" className="form-label">Contact Number *</label>
          <input
            type="tel"
            id="contact"
            className="form-input"
            placeholder="10-digit number"
            {...register('contact', { 
              required: 'Contact number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Please enter a valid 10-digit phone number'
              }
            })}
          />
          {errors.contact && <p className="error-message">{errors.contact.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address *</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="example@school.edu"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">School Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="form-input"
            {...register('image')}
          />
          <small>Optional: JPEG, PNG, or GIF (max 2MB)</small>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding School...' : 'Add School'}
        </button>
      </form>
    </div>
  );
};

export default AddSchool;