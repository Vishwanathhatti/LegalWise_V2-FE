const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    lawyerId?: any;
  };
}

interface UserResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

class ApiClient {
  private baseURL: string;
  private deviceId: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.deviceId = 'legalwise-device'; // Fixed device ID for simplicity
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'device-id': this.deviceId,
        ...options.headers,
      },
      ...options,
    };

    // Add token if available
    const token = localStorage.getItem('legalwise_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // User APIs
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, phone: string, password: string): Promise<User> {
    const response = await this.request<UserResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
    return response.user;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request('/users/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<User> {
    const response = await this.request<UserResponse>('/users/profile');
    return response.user;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await this.request<UserResponse>('/users/update', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.user;
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return this.request('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/users/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  }

  // Posts APIs
  async getAllPosts(): Promise<{ posts: any[] }> {
    const response = await this.request<{ posts: any[]; success: boolean }>('/community/posts/');
    return { posts: response.posts };
  }

  async getTrendingPosts(): Promise<any[]> {
    return this.request('/community/posts/trending');
  }

  async createPost(title: string, content: string, tags: string[]): Promise<{ post: any; success: boolean; message: string }> {
    return this.request('/community/posts/', {
      method: 'POST',
      body: JSON.stringify({ title, description: content, tags }),
    });
  }

  async getSinglePost(id: string): Promise<{ post: any; success: boolean }> {
    return this.request(`/community/posts/getpostbyid/${id}`);
  }

  async searchPosts(keyword: string): Promise<any[]> {
    return this.request(`/community/posts/search?keyword=${encodeURIComponent(keyword)}`);
  }

  async likePost(id: string): Promise<{ success: boolean; message: string; post: any }> {
    return this.request(`/community/posts/like/${id}`, {
      method: 'PUT',
    });
  }

  async unlikePost(id: string): Promise<{ success: boolean; message: string; post: any }> {
    return this.request(`/community/posts/unlike/${id}`, {
      method: 'PUT',
    });
  }

  async getUserPosts(userId: string): Promise<{ userPosts: any[]; success: boolean }> {
    return this.request(`/community/posts/get/${userId}`);
  }

  async getLikedPosts(): Promise<{ likedPosts: any[]; success: boolean }> {
    return this.request('/community/posts/likes/get');
  }

  // Comments APIs
  async getPostComments(postId: string): Promise<{ success: boolean; comments: any }> {
    return this.request(`/community/comments/${postId}`);
  }

  async addComment(postId: string, text: string): Promise<{ success: boolean; message: string; comment: any }> {
    return this.request(`/community/comments/add-comment/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async likeComment(commentId: string): Promise<{ success: boolean; message: string; comment: any }> {
    return this.request(`/community/comments/addLike-comment/${commentId}`, {
      method: 'PUT',
    });
  }

  async unlikeComment(commentId: string): Promise<{ success: boolean; message: string; comment: any }> {
    return this.request(`/community/comments/removeLike-comment/${commentId}`, {
      method: 'PUT',
    });
  }

  async deleteComment(commentId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/community/comments/remove-comment/${commentId}`, {
      method: 'DELETE',
    });
  }

  async getUserComments(): Promise<{ success: boolean; userComments: any[] }> {
    return this.request('/community/comments/user-comments/user');
  }

  // Lawyers APIs
  async registerLawyer(lawyerData: any): Promise<any> {
    return this.request('/lawyer/register', {
      method: 'POST',
      body: JSON.stringify(lawyerData),
    });
  }

  async getLawyerProfile(): Promise<any> {
    return this.request('/lawyer/profile');
  }

  async updateLawyerProfile(updates: any): Promise<any> {
    return this.request('/lawyer/update', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getAllLawyers(search?: string): Promise<{ success: boolean; lawyers: any[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/lawyer/all${query}`);
  }

  async searchLawyers(query: any): Promise<any[]> {
    return this.request('/lawyer/search', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  async checkSubscriptionStatus(): Promise<{ success: boolean; isActive: boolean; subscription: any }> {
    return this.request('/lawyer/subscription/status');
  }

  // DMs APIs
  async sendDMRequest(receiverId: string): Promise<any> {
    return this.request('/dm/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId }),
    });
  }

  async respondToDMRequest(requestId: string, status: 'accepted' | 'rejected'): Promise<any> {
    return this.request('/dm/request/respond', {
      method: 'POST',
      body: JSON.stringify({ requestId, status }),
    });
  }

  async sendMessage(dmId: string, message: string): Promise<any> {
    return this.request(`/dm/send/${dmId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getDMs(): Promise<{ success: boolean; dms: any[] }> {
    return this.request('/dm/dms');
  }

  async getDMMessages(dmId: string): Promise<any[]> {
    return this.request(`/dm/${dmId}/messages`);
  }

  // Documents APIs
  async uploadDocument(formData: FormData): Promise<any> {
    return this.request('/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  async getDocuments(): Promise<{ success: boolean; documents: any[] }> {
    return this.request('/documents/');
  }

  async deleteDocument(docId: string): Promise<any> {
    return this.request(`/documents/${docId}`, {
      method: 'DELETE',
    });
  }

  // Conversations (AI Chatbot) APIs
  async createConversation(title: string): Promise<any> {
    return this.request('/conversations/create', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async getConversations(): Promise<{ success: boolean; allConversation: any[] }> {
    return this.request('/conversations/get');
  }

  async addMessage(conversationId: string, content: string): Promise<any> {
    return this.request(`/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getMessages(conversationId: string): Promise<{ success: boolean; conversation: any }> {
    return this.request(`/conversations/get/${conversationId}`);
  }
}

export const api = new ApiClient(BASE_URL);
