import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from "../../services/api";

const ReportedByDropdown = ({ taskId, currentReportedBy, onReportedByChange }) => {
  const [selectedReportedBy, setSelectedReportedBy] = useState(null);
  const [allUser, setAllUsers] = useState([]);
  const [showSelect, setShowSelect] = useState(false);

    useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await API.get("/users");
        const userOptions = response.data.map((user) => ({
          label: user.name,
          value: user.id,
        }));
        setAllUsers(userOptions);

        if (currentReportedBy) {
          const ReportedUser = userOptions.find(user => user.label === currentReportedBy);
          setSelectedReportedBy(ReportedUser?.label || null);
        }
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };

    fetchAllUsers();
  }, [currentReportedBy]);

  // Handle reported by change
  const handleReportedByChange = async (selectedOption) => {
    try {
      await API.patch(`/tasks/${taskId}`, { reported_by: selectedOption.value });
      setSelectedReportedBy(selectedOption.label);
      onReportedByChange(selectedOption?.value);
      toast.success("reported by updated successfully!");
    } catch (error) {
      console(error)
      toast.error("Failed to update reported by.");
    }
  };

  return (
    <div onClick={ () => setShowSelect(true)} style={{ cursor: "pointer" }}>
    { showSelect ? (
    <Select
      options={allUser}
      value={selectedReportedBy}
      onChange={handleReportedByChange}
      placeholder="Select reporter..."
      autoFocus
      onBlur={() => setShowSelect(false)}
      menuPlacement="auto"    />
    ) : (
     <div>{ selectedReportedBy || "Not Set"}</div>
    )}
    </div>
  );
};

export default ReportedByDropdown;
