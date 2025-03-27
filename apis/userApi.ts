import { auth, functions } from '@/config/firebase';
import { httpsCallable } from 'firebase/functions';

export const getUserInfo = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  try {
    // Using Firebase Functions instead of direct fetch
    const getUserInfoFn = httpsCallable(functions, 'getUserInfo');
    const result = await getUserInfoFn();
    
    return result.data;
  } catch (error: any) {
    console.error('Error fetching user info:', error);
    throw new Error(error.message || 'Failed to fetch user data');
  }
};

// Add more API functions as needed
export const updateUserInfo = async (data: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  try {
    const updateUserInfoFn = httpsCallable(functions, 'updateUserInfo');
    const result = await updateUserInfoFn(data);
    return result.data;
  } catch (error: any) {
    console.error('Error updating user info:', error);
    throw new Error(error.message || 'Failed to update user data');
  }
}; 