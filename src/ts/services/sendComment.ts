import { Comments } from '../interfaces/server-response-interface';

export async function sendComment(chosenFeedback: string, comment: Comments[]) {
   let Response = fetch(`http://localhost:3000/productRequests/${chosenFeedback}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "comments": comment
            }
        )
    })

    return await Response;
}