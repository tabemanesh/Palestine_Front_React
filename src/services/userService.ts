
import apiClient from "../utilz/apiClient";



const UserService = {

  async getProfile(): Promise<UserDto> {
    const response = await apiClient.get("User/me");
    return response.data;
  },

  async login(data: LoginUserDto): Promise<AuthResponseDto> {

    const response = await apiClient.post<AuthResponseDto>(
      "user/login",
      data
    );

    localStorage.setItem("auth_token", response.data.token);

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("user/logout");
    } catch (_) {
    } finally {
      localStorage.removeItem("auth_token");
    }
  },

  async register(data: CreateUserDto): Promise<void> {
    await apiClient.post("user/register", data);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem("auth_token");
  },


  async create(data: CreateUserDto): Promise<string> {
    const response = await apiClient.post("User/create-new-user", data);
    return response.data;
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

export interface LoginUserDto {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  userId: string;
  userName: string;
  expiresAt?: string;
}
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
