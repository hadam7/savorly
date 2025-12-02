const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginResponse {
  token: string | null;
  userName: string;
  role: string;
}

export async function login(userName: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Invalid username or password');
  }

  return res.json();
}

export async function register(userName: string, email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, email, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Registration failed');
  }

  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Logout failed');
  }
}

export async function fetchMe() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json();
}


export interface Recipe {
  id: number;
  title: string;
  description?: string;
  instructions: string[];
  prepTimeMinutes?: number;
  difficulty?: string;
  imageUrl?: string;
  servings: number;
  isVegan: boolean;
  allergens: string[];
  ingredients: string[];
  authorName?: string;
  createdAt: string;
  categoryIds: number[];
  categories?: string[];
  likes: number;
}

export interface RecipeListItem {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  prepTimeMinutes?: number;
  difficulty?: string;
  authorName?: string;
  categories: string[];
  likes: number;
  servings?: number;
  isVegan?: boolean;
  allergens?: string[];
}

export type RecipeListItemDto = RecipeListItem;

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
}

export interface CreateRecipeDto {
  title: string;
  description?: string;
  instructions: string[];
  prepTimeMinutes?: number;
  difficulty?: string;
  imageUrl?: string;
  servings: number;
  isVegan: boolean;
  allergens: string[];
  ingredients: string[];
  categoryIds: number[];
}


export async function fetchRecipes(): Promise<RecipeListItem[]> {
  const res = await fetch(`${API_BASE_URL}/recipes`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export async function fetchRecipeById(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch recipe');
  return res.json();
}

export async function createRecipe(data: CreateRecipeDto): Promise<Recipe> {
  const res = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  return res.json();
}

export async function updateRecipe(id: number, data: CreateRecipeDto): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update recipe');
}

export async function deleteRecipe(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete recipe');
}


export async function fetchUsers() {
  const res = await fetch(`${API_BASE_URL}/users`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function toggleUserStatus(id: number) {
  const res = await fetch(`${API_BASE_URL}/users/${id}/toggle-status`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to toggle user status');
  return res.json();
}

export async function fetchUserRecipes(userId: number): Promise<RecipeListItemDto[]> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/recipes`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch user recipes');
  return res.json();
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(name: string): Promise<CategoryDto> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

export async function updateCategory(id: number, name: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update category');
}

export async function likeRecipe(id: number): Promise<{ likes: number }> {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}/like`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to like recipe');
  return res.json();
}

export async function unlikeRecipe(id: number): Promise<{ likes: number }> {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}/unlike`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to unlike recipe');
  return res.json();
}
