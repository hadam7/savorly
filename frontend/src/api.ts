const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginResponse {
  token: string;
  userName: string;
  role: string;
}

export async function login(userName: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
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
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Registration failed');
  }

  return res.json();
}

export async function fetchMe(token: string) {
  const cleanToken = token.replace(/"/g, '').trim();
  console.log('Sending token for fetchMe:', cleanToken);
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json();
}

// Recipe Types
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

// Recipe API
export async function fetchRecipes(): Promise<RecipeListItem[]> {
  const res = await fetch(`${API_BASE_URL}/recipes`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export async function fetchRecipeById(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch recipe');
  return res.json();
}

export async function createRecipe(token: string, data: CreateRecipeDto): Promise<Recipe> {
  const cleanToken = token.replace(/"/g, '').trim();
  console.log('Sending token for createRecipe:', cleanToken);
  const res = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanToken}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  return res.json();
}

export async function updateRecipe(token: string, id: number, data: CreateRecipeDto): Promise<void> {
  const cleanToken = token.replace(/"/g, '');
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanToken}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update recipe');
}

export async function deleteRecipe(token: string, id: number): Promise<void> {
  const cleanToken = token.replace(/"/g, '');
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${cleanToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to delete recipe');
}

// User Management API
export async function fetchUsers(token: string) {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${cleanToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function deleteUser(token: string, id: number) {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${cleanToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function toggleUserStatus(token: string, id: number) {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/users/${id}/toggle-status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${cleanToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to toggle user status');
  return res.json();
}

export async function fetchUserRecipes(token: string, userId: number): Promise<RecipeListItemDto[]> {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/users/${userId}/recipes`, {
    headers: {
      'Authorization': `Bearer ${cleanToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch user recipes');
  return res.json();
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(token: string, name: string): Promise<CategoryDto> {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanToken}`
    },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(token: string, id: number): Promise<void> {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${cleanToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

export async function updateCategory(token: string, id: number, name: string): Promise<void> {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanToken}`
    },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to update category');
}

export async function likeRecipe(token: string, id: number): Promise<{ likes: number }> {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/recipes/${id}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cleanToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to like recipe');
  return res.json();
}

export async function unlikeRecipe(token: string, id: number): Promise<{ likes: number }> {
  const cleanToken = token.replace(/"/g, '').trim();
  const res = await fetch(`${API_BASE_URL}/recipes/${id}/unlike`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cleanToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to unlike recipe');
  return res.json();
}
