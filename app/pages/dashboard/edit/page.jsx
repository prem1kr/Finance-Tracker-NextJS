'use client';

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useTheme } from "../../../../components/context/Themes.jsx";
import axios from "axios";

const EMOJIS = ["😊", "😂", "👍", "🚀", "💼", "🎉", "💰", "📈", "💸"];

function EmojiPicker({ onSelect }) {
  return (
    <div className="grid grid-cols-5 gap-2 p-2 bg-white dark:bg-gray-800 rounded shadow max-w-xs">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className="text-2xl hover:bg-purple-200 dark:hover:bg-purple-700 rounded transition"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

const EditIncome = ({ source, onClose, onUpdate, onSuccess }) => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date(),
    icon: "😊",
    type: "income",
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (source) {
      setFormData({
        name: source.title || "",
        amount: source.amount || "",
        date: source.date ? new Date(source.date) : new Date(),
        icon: source.icon || "😊",
        type: source.type || "income",
        id: source._id || "",
      });
    }
  }, [source]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmojiSelect = (emoji) => {
    setFormData((prev) => ({ ...prev, icon: emoji }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in");
      return;
    }

    const payload = {
      id: formData.id,
      title: formData.name,
      amount: Number(formData.amount),
      date: formData.date.toISOString(),
      icon: formData.icon,
      type: formData.type,
    };

    try {
      const res = await axios.put(`/api/controller/transaction/edit`, payload, {
        params: { userId },
      });

      if (res.status === 200) {
        alert(`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} updated successfully`);
        if (onUpdate) onUpdate(res.data);
        if (onSuccess) onSuccess();  
        onClose();
      } else {
        alert(`Failed to update: ${res.statusText}`);
      }
    } catch (error) {
      alert(`Error updating: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Transaction
          </h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
            <input
              type="text"
              name="name"
              className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white cursor-pointer"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount</label>
            <input
              type="number"
              name="amount"
              className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white cursor-pointer"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date</label>
            <input
              type="date"
              name="date"
              className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white cursor-pointer"
              value={formData.date.toISOString().substr(0, 10)}
              onChange={e => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
              required
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Type</label>
            <select
              name="type"
              className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white cursor-pointer"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Icon</label>
            <button
              type="button"
              className="text-3xl p-2 rounded cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {formData.icon}
            </button>
            {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncome;
