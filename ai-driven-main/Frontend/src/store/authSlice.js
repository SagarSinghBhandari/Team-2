import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for login (will be integrated with backend later)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API call - replace with actual backend integration
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Mock successful login
          if (credentials.email && credentials.password) {
            resolve({
              user: {
                id: '1',
                name: 'Rohan Mehta',
                email: credentials.email,
                profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                riskProfile: 'Moderate',
                totalInvestment: 500000,
                currentValue: 612000,
                totalReturns: 112000,
                returnPercentage: 22.4,
                joinDate: '2023-01-15'
              },
              token: 'mock-jwt-token-' + Date.now()
            });
          } else {
            rejectWithValue('Invalid credentials');
          }
        }, 1000);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for register (will be integrated with backend later)
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Simulate API call - replace with actual backend integration
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Mock successful registration
          if (userData.email && userData.password && userData.name) {
            resolve({
              user: {
                id: Date.now().toString(),
                name: userData.name,
                email: userData.email,
                profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                riskProfile: userData.riskProfile || 'Moderate',
                totalInvestment: 0,
                currentValue: 0,
                totalReturns: 0,
                returnPercentage: 0,
                joinDate: new Date().toISOString().split('T')[0]
              },
              token: 'mock-jwt-token-' + Date.now()
            });
          } else {
            rejectWithValue('Invalid user data');
          }
        }, 1000);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isInitialized: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          state.user = JSON.parse(user);
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
      state.isInitialized = true;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user profile
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store in localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store in localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Logout failed';
      });
  }
});

export const { initializeAuth, clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
