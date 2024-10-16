import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Switch,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
});

const StyledSelect = styled(Select)({
  borderRadius: "8px",
});

const EditProfile = ({ onClose }) => {
  const [firstName, setFirstName] = useState("Anupam");
  const [lastName, setLastName] = useState("Raj");
  const [email, setEmail] = useState("engranupam@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("0098 4654 554");
  const [country, setCountry] = useState("India");
  const [googleAccount, setGoogleAccount] = useState(true);
  const [facebookAccount, setFacebookAccount] = useState(false);

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
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          Personal Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
          Edit Your personal info
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <StyledTextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <StyledTextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="body1">
            Main Email{" "}
            <span style={{ color: "green", fontSize: "0.8rem" }}>Verified</span>
          </Typography>
          <Button color="primary" size="small">
            Add Email
          </Button>
        </Box>
        <StyledTextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled
          sx={{ bgcolor: "#f0f0f0", mb: 1 }}
        />
        <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
          You need to have at least one email connected with your account
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <StyledTextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <StyledSelect
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="UK">UK</MenuItem>
          </StyledSelect>
        </Box>
        <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: "bold" }}>
          Sign-in Method
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
          Edit Your sign-in methods
        </Typography>
        <Box
          sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", p: 2, mb: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "#ea4335",
                  borderRadius: "8px",
                  width: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "bold" }}>
                  G
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Google Account
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Your google account is connected.
                </Typography>
              </Box>
            </Box>
            <Switch
              checked={googleAccount}
              onChange={(e) => setGoogleAccount(e.target.checked)}
              color="primary"
            />
          </Box>
        </Box>
        <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "#1877f2",
                  borderRadius: "8px",
                  width: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "bold" }}>
                  f
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Facebook Account
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  You can connect with your facebook account.
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFacebookAccount(true)}
              sx={{ bgcolor: "#00897b", "&:hover": { bgcolor: "#00695c" } }}
            >
              Connect
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
