export interface productRequests {
    id: number;
    status: string;
    comments: Comments []
    upvotes: number;
    title: string;
    description: string;
    category: string;
}

export interface Comments {
    id: number;
    content: string;
    user: {
        image: string;
        name: string;
        username: string;
    }
    replies: Replies[] | null;
}

export interface Replies {
    content: string;
    replyingTo: string;
    user: {
        image: string;
        name: string;
        username: string;
    }
}

export interface currentUser {
    image: string;
    name: string;
    username: string;
}

