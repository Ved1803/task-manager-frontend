import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from "../../services/api";

const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" }
];

const PriorityDropdown = ({ taskId, currentPriority, onPriorityChange }) => {
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    const match = PRIORITY_OPTIONS.find(opt => opt.value === currentPriority);
    setSelectedPriority(match || null);
  }, [currentPriority]);

  const handlePriorityChange = async (selectedOption) => {
    try {
      await API.patch(`/tasks/${taskId}`, { priority: selectedOption.value });
      setSelectedPriority(selectedOption);
      onPriorityChange(selectedOption.value);
      toast.success("Priority updated successfully!");
      setShowSelect(false);
    } catch (error) {
      toast.error("Failed to update priority.");
    }
  };

  return (
    <div onClick={() => setShowSelect(true)} style={{ cursor: "pointer" }}>
      {showSelect ? (
        <Select
          options={PRIORITY_OPTIONS}
          value={selectedPriority}
          onChange={handlePriorityChange}
          placeholder="Select priority..."
          autoFocus
          onBlur={() => setShowSelect(false)}
          menuPlacement="auto"
        />
      ) : (
        <div>{selectedPriority?.label || "Not Set"}</div>
      )}
    </div>
  );
};

export default PriorityDropdown;
