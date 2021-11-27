export async function upvoteFeedback(id: string, upvote: number) {
    upvote++;
    let Response = fetch(`http://localhost:3000/productRequests/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "upvotes": upvote
            }
        )
    });

    return await Response;
}