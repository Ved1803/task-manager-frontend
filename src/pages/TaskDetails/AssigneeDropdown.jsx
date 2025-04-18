import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from "../../services/api";

const AssigneeDropdown = ({ taskId, currentAssignee, onAssigneeChange }) => {
  const [selectedAssigned, setSelectedAssigned] = useState(null);
  const [allUser, setAllUsers] = useState([]);
  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await API.get("/users");
        const userOptions = response.data.map((user) => ({
          label: user.name, // Display name
          value: user.id, // Store ID
        }));
        setAllUsers(userOptions);

        // Set selected assignee after users are fetched
        if (currentAssignee) {
          const assignedUser = userOptions.find(
            (user) => user.label === currentAssignee
          );
          
          setSelectedAssigned(assignedUser?.label || null);
        }
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };

    fetchAllUsers();
  }, [currentAssignee]);

  // Handle assignee change
  const handleAssigneeChange = async (selectedOption) => {
    try {
      await API.patch(`/tasks/${taskId}`, {
        assigned_to: selectedOption.value,
      });
      setSelectedAssigned(selectedOption.label);
      onAssigneeChange(selectedOption.value);
      toast.success(<div style={{ fontSize: "14px" }}>Assignee updated successfully!</div>);
      setShowSelect(false);
    } catch (error) {
      console.log(error);
      toast.error(<div style={{ fontSize: "14px" }}>Failed to update assignee.</div>);
    }
  };

  return (
    <div onClick={() => setShowSelect(true)} style={{ cursor: "pointer" }}>
      {showSelect ? (
        <Select
          options={allUser}
          value={selectedAssigned}
          onChange={handleAssigneeChange}
          placeholder="Select assignee..."
          autoFocus
          onBlur={() => setShowSelect(false)}
          menuPlacement="auto"
        />
      ) : (
        <div>{selectedAssigned || "Not Set"}</div>
      )}
    </div>
  );
};

export default AssigneeDropdown;
