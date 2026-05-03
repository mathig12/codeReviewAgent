/**
 * API Client for fetching data.
 */
import axios from 'axios';

export async function fetchUserData(userId: string) {
  const response = await axios.get("https://api.example.com/users/" + userId);
  const data = response.data;
  data.processedAt = new Date().toISOString();
  return data;
}

fetchUserData("123");