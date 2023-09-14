// curriculumService.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // Substitua pela URL real do seu back-end

export async function getProfileComponents() {
  try {
    const response = await axios.get(`${BASE_URL}/curriculum/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getComponentTypes() {
  try {
    const response = await axios.get(`${BASE_URL}/componentType`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
