import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../services/api";
import "./UpdateUserForm.css"; // Make sure this file exists

const UpdateUserForm = () => {
  const { id } = useParams();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    avatar: null,
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        const { name, email, role, avatar_url } = res.data;
        setUser({ name, email, role, avatar: null });
        setPreviewAvatar(avatar_url || null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setUser({ ...user, avatar: files[0] });
      setPreviewAvatar(URL.createObjectURL(files[0]));
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("user[name]", user.name);
    if (user.avatar) {
      data.append("user[avatar]", user.avatar);
    }

    try {
      await API.put(`/users/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="update-user-container">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="update-user-form"
      >
        <div className="avatar-preview">
          <img
            src={previewAvatar || "/default-avatar.png"}
            alt="Avatar"
            className="avatar-image"
          />
          <label className="avatar-upload-btn">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
            />
            +
          </label>
        </div>

        <h2>Update User</h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input type="email" name="email" value={user.email} disabled />

        <label>Role</label>
        <input type="text" name="role" value={user.role} disabled />

        <button type="submit">Update User</button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateUserForm;
