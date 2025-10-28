import React, { useState, useEffect } from 'react';
import { Chat } from '../../types';
import './CreateChatDialog.css';

interface CreateChatDialogProps {
  isOpen: boolean;
  chat?: Chat; // For editing existing chat
  onClose: () => void;
  onSubmit: (firstName: string, lastName: string) => void;
}

const CreateChatDialog: React.FC<CreateChatDialogProps> = ({
  isOpen,
  chat,
  onClose,
  onSubmit
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (chat) {
        // Editing existing chat
        setFirstName(chat.firstName);
        setLastName(chat.lastName);
      } else {
        // Creating new chat
        setFirstName('');
        setLastName('');
      }
      setErrors({});
    }
  }, [isOpen, chat]);

  const validateForm = () => {
    const newErrors: { firstName?: string; lastName?: string } = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(firstName.trim(), lastName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{chat ? 'Edit Chat' : 'Create New Chat'}</h2>
          <button 
            className="close-button" 
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dialog-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={errors.firstName ? 'error' : ''}
              placeholder="Enter first name"
              autoFocus
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={errors.lastName ? 'error' : ''}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
            >
              {chat ? 'Save Changes' : 'Create Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatDialog;