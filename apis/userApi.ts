import axios from 'axios';

export async function getUserInfo() {
  try {
    const response = await axios.get("http://localhost:5000/api/users");
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
