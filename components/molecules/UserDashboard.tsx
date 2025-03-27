"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Typography, 
  Container, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchUserInfo } from '@/store/features/userSlice';
import { auth } from '@/config/firebase';

export const UserDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    // Show emulator warning in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Running with Firebase Emulators');
    }
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      } else if (process.env.NODE_ENV === 'development') {
        // In development, automatically fetch user info after login
        handleFetchUserInfo();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleFetchUserInfo = () => {
    dispatch(fetchUserInfo());
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Button 
          variant="contained" 
          onClick={handleFetchUserInfo}
          sx={{ mb: 3 }}
        >
          Fetch User Info
        </Button>

        <Button 
          variant="outlined" 
          onClick={handleLogout}
          sx={{ mb: 3, ml: 2 }}
        >
          Logout
        </Button>

        {loading && (
          <CircularProgress sx={{ display: 'block', my: 2 }} />
        )}

        {error && (
          <Typography color="error" sx={{ my: 2 }}>
            {error}
          </Typography>
        )}

        {userData && (
          <div>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Typography>
              Email: {userData.email}
            </Typography>
            {/* Add more user data fields as needed */}
          </div>
        )}
      </Paper>
    </Container>
  );
}; 