import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yyygqmqofwuoybhgyxym.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eWdxbXFvZnd1b3liaGd5eHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTkxNTIsImV4cCI6MjA3MDYzNTE1Mn0.MZbRIs2uWmQwXvwM6dzOyhRjP8b8DHfXjeCkHUWBvIw'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
