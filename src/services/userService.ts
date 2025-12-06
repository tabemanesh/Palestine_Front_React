import axios, { type AxiosInstance } from "axios";
import { API_CONFIG } from "./configuration/configApi";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// DTO Interfaces
export interface CreateUserDto {
  userName: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  password: string;
  imgId?: string | null;
}

export interface UpdateUserDto {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  imgId?: string | null;
}

export interface UserDto {
  id: string;
  userName: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  imgId?: string | null;
}

// User Service
const UserService = {
  async create(data: CreateUserDto): Promise<string> {
    const response = await apiClient.post("User/create-new-user", data);
    return response.data; // server returns generated id
  },

  async update(data: UpdateUserDto): Promise<void> {
    await apiClient.put("User", data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`User/${id}`);
  },

  async getById(id: string): Promise<UserDto> {
    const response = await apiClient.get(`User/${id}`);
    return response.data;
  },

  async getAll(): Promise<UserDto[]> {
    const response = await apiClient.get("User");
    return response.data;
  },
};

export default UserService;
