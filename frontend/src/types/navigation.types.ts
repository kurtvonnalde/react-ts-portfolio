export type HeaderList = 
    | "Home"
    | "About me"
    | "Contact"
    | "Projects";


export interface NavigationItem {
    key: HeaderList;
    label: string;
    path: string;
    isActive: boolean;
    requiredAuth?: boolean; // Optional: only show if user is authenticated
    icon?: React.ReactNode; // Optional: for future icon support
}

export interface HeaderConfig{
    logo?:{
        text?: string;
        imageUrl?: string;
        path?: string; // Optional: where the logo should link to

    };

    navigation: NavigationItem[];
    showAuthButtons?: boolean; // Optional: whether to show login/logout buttons    
}