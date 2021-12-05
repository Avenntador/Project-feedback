import { FeedbackObject } from "../interfaces/feedback-interface";

export async function addFeedback(body: FeedbackObject) {
    let Response = fetch('http://localhost:3000/productRequests', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return (await Response);
}