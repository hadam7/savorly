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
