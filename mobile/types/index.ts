export interface User {
    id: string;
    clerkId: string;
    opid: string;
    opid_updated_at: string | null;

    language: string;
    username: string;
    country: string;
    currency: string;

    avatar_url: string | null;
    avatar_public_id: string | null;

    is_premium: Boolean;
    premium_expire_at: string | null;
    
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}