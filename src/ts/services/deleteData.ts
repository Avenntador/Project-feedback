export async function deleteData(currentFeedbackId: string) {
    let Response = fetch(`http://localhost:3000/productRequests/${currentFeedbackId}`, {
        method: 'DELETE',
    })

    return await Response;
}