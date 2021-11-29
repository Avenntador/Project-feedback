
export interface productRequests {
    id: number;
    status: string;
    comments: [
        {
            id: number;
            content: string;
            user: {
                image: string;
                name: string;
                username: string;
            },
            replies: [
                {
                    content: string,
                    replyingTo: string,
                    user: {
                        image: string,
                        name: string,
                        username: string
                    }
                }
            ] | null
        }
    ] | null;
    upvotes: number;
    title: string;
    description: string;
    category: string;
}



export interface currentUser {
    image: string;
    name: string;
    username: string;
}

