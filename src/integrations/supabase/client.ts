// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gklodicfgxhdjjlsgzmb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbG9kaWNmZ3hoZGpqbHNnem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4Nzc0NzgsImV4cCI6MjA1MDQ1MzQ3OH0._M3sMxoAYw-iXNkqvQIKZ9TdAR6vUdxRYCBQFvhZ8ys";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);