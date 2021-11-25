import { FeedbackObject } from './feedback-interface'


class Feedback implements FeedbackObject {
    id: number;
    title: string;
    category: string;
    upvotes: number;
    status: string;
    description: string;
    // comments: [{ id: number; content: string; user: { image: string; name: string; username: string; }; }];

    constructor(id: number, title: string, category: string, upvotes: number, status: string, description: string) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.upvotes = upvotes;
        this.status = status;
        this.description = description;
       
    }
}
