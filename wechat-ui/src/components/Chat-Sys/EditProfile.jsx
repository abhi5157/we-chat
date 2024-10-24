// import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   Switch,
//   styled,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const StyledTextField = styled(TextField)({
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "8px",
//   },
// });

// const StyledSelect = styled(Select)({
//   borderRadius: "8px",
// });

// const EditProfile = ({ onClose }) => {
//   const [firstName, setFirstName] = useState("Anupam");
//   const [lastName, setLastName] = useState("Raj");
//   const [email, setEmail] = useState("engranupam@gmail.com");
//   const [phoneNumber, setPhoneNumber] = useState("0098 4654 554");
//   const [country, setCountry] = useState("India");
//   const [googleAccount, setGoogleAccount] = useState(true);
//   const [facebookAccount, setFacebookAccount] = useState(false);

//   return (
//     <Box sx={{ bgcolor: "#f0f9f9", minHeight: "100vh", width: "100%", p: 4 }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={onClose}
//           sx={{ color: "#00796B", fontWeight: "bold" }}
//         >
//           Edit Profile
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           bgcolor: "white",
//           p: 4,
//           borderRadius: 2,
//           maxWidth: "800px",
//           margin: "0 auto",
//         }}
//       >
//         <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
//           Personal Information
//         </Typography>
//         <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
//           Edit Your personal info
//         </Typography>
//         <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
//           <StyledTextField
//             label="First Name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             fullWidth
//             variant="outlined"
//           />
//           <StyledTextField
//             label="Last Name"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             fullWidth
//             variant="outlined"
//           />
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 1,
//           }}
//         >
//           <Typography variant="body1">
//             Main Email{" "}
//             <span style={{ color: "green", fontSize: "0.8rem" }}>Verified</span>
//           </Typography>
//           <Button color="primary" size="small">
//             Add Email
//           </Button>
//         </Box>
//         <StyledTextField
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           fullWidth
//           margin="normal"
//           variant="outlined"
//           disabled
//           sx={{ bgcolor: "#f0f0f0", mb: 1 }}
//         />
//         <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
//           You need to have at least one email connected with your account
//         </Typography>
//         <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
//           <StyledTextField
//             label="Phone Number"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             fullWidth
//             variant="outlined"
//           />
//           <StyledSelect
//             value={country}
//             onChange={(e) => setCountry(e.target.value)}
//             fullWidth
//             variant="outlined"
//           >
//             <MenuItem value="India">India</MenuItem>
//             <MenuItem value="USA">USA</MenuItem>
//             <MenuItem value="UK">UK</MenuItem>
//           </StyledSelect>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default EditProfile;

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Switch,
  styled,
  Avatar,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
});

const StyledSelect = styled(Select)({
  borderRadius: "8px",
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const EditProfile = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "India",
    avatar: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.mobile,
          country: userData.country || "India",
          avatar: userData.avatar,
        });
        if (userData.avatar) {
          setPreviewImage(`http://localhost:5000${userData.avatar}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again.");
      }
    };
    fetchUserData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size should not exceed 5MB");
        return;
      }
      setFormData({ ...formData, avatar: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "avatar" && formData[key] instanceof File) {
          formDataToSend.append("avatar", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.put("/api/users/profile", formDataToSend);

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          "Error updating profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f0f9f9", minHeight: "100vh", width: "100%", p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onClose}
          sx={{ color: "#00796B", fontWeight: "bold" }}
        >
          Edit Profile
        </Button>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <StyledAvatar src={previewImage} alt={formData.firstName} />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="icon-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          Personal Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
          Edit your personal info
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <StyledTextField
            label="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            fullWidth
            variant="outlined"
            required
          />
          <StyledTextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            fullWidth
            variant="outlined"
            required
          />
        </Box>

        <StyledTextField
          label="Email"
          value={formData.email}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled
          sx={{ bgcolor: "#f0f0f0", mb: 3 }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <StyledTextField
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            fullWidth
            variant="outlined"
            required
          />
          <StyledSelect
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            fullWidth
            variant="outlined"
          >
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="UK">UK</MenuItem>
          </StyledSelect>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 4,
              bgcolor: "#00796B",
              "&:hover": { bgcolor: "#00695C" },
            }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
