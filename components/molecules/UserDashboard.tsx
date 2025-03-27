"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchUserInfo } from '@/store/features/userSlice';
import { UserModel } from "@turbo-monorepo/shared";

// interface IUser {
//     id: string;
//     totalAverageWeightRatings: number;
//     numberOfRents: number;
//     recentlyActive: string;
// }

export const UserDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Running with Firebase Emulators');
    }
  }, [router]);

  const handleFetchUserInfo = () => {
    dispatch(fetchUserInfo());
  };

  const handleLogout = async () => {
    try {
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = userData?.length ? userData?.filter((user: UserModel) =>
    user.id.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Button variant="contained" onClick={handleFetchUserInfo} sx={{ mb: 3 }}>
          Fetch User Info
        </Button>
        <Button variant="outlined" onClick={handleLogout} sx={{ mb: 3, ml: 2 }}>
          Logout
        </Button>

        <TextField 
          label="Search by User ID"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <CircularProgress sx={{ display: 'block', my: 2 }} />}

        {error && (
          <Typography color="error" sx={{ my: 2 }}>
            {error}
          </Typography>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Average Rating</TableCell>
                <TableCell>Number of Rents</TableCell>
                <TableCell>Recently Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: UserModel, index: string) => (
                <TableRow key={index}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.totalAverageWeightRatings}</TableCell>
                  <TableCell>{user.numberOfRents}</TableCell>
                  <TableCell>{new Date(parseInt(user.recentlyActive) * 1000).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};
