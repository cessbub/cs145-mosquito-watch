// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bvplsaquxudymznelagm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxzYXF1eHVkeW16bmVsYWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NDUyODEsImV4cCI6MjA1ODMyMTI4MX0.ikjbkCdRizOJaPEu3mY2ACDKReuNPnQSTaAHkTUC5ww";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);