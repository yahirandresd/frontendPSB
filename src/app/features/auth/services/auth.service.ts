import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    signIn(email: string, password: string) {
        return this.supabase.auth.signInWithPassword({ email, password });
    }

    signOut() {
        return this.supabase.auth.signOut();
    }

    getSession() {
        return this.supabase.auth.getSession();
    }

    onAuthStateChange(callback: Parameters<SupabaseClient['auth']['onAuthStateChange']>[0]) {
        return this.supabase.auth.onAuthStateChange(callback);
    }
}
