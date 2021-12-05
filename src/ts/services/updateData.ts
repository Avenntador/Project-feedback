export async function updateData(currentFeedbackId: string, title: string, category: string, description: string, status: string) {
 let Response =  fetch(`http://localhost:3000/productRequests/${currentFeedbackId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                title: title,
                category: category,
                status: status,
                description: description
            }
        )
    })

    return await Response;
}