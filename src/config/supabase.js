import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qdpaaxcnooondnykrobk.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcGFheGNub29vbmRueWtyb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjkzMDIsImV4cCI6MjA3MDIwNTMwMn0.u0dG3xlRYTBq1kFc_5gKf_2nhkZpj5smgHDWyeMbr3U'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
