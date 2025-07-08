import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from "../../services/api";

const STATUS_OPTIOS = [
  { label: "Todo", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Review", value: "review" },
  { label: "Done", value: "done" }
];



const StatusDropdown = ({ taskId, currentStatus, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    const match = STATUS_OPTIOS.find(opt => opt.value === currentStatus);
    setSelectedStatus(match || null);
  }, [currentStatus]);

  const handleStatusChange = async (selectedOption) => {
    try {
      await API.patch(`/tasks/${taskId}`, { status: selectedOption.value });
      setSelectedStatus(selectedOption);
      onStatusChange(selectedOption.value);
      toast.success("Status updated successfully!");
      setShowSelect(false);
    } catch (error) {
      toast.error("Failed to update status. ");
    }
  };

  return (
    <div onClick={() => setShowSelect(true)} style={{ cursor: "pointer" }}>
      {showSelect ? (
        <Select
          options={STATUS_OPTIOS}
          value={selectedStatus}
          onChange={handleStatusChange}
          placeholder="Select status..."
          autoFocus
          onBlur={() => setShowSelect(false)}
          menuPlacement="auto"
        />
      ) : (
        <div>{selectedStatus?.label || "Not Set"}</div>
      )}
    </div>
  );
};

export default StatusDropdown;
