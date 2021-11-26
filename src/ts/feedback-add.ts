import '../assets/sass/feedback-detailPage.scss';
import { FeedbackObject } from './feedback/feedback-interface';

const inputTitle = document.querySelector('#title')! as HTMLInputElement;
const selectCategory = document.querySelector('#category')! as HTMLSelectElement;
const inputDetail = document.querySelector('#detail')! as HTMLInputElement;
const submitBtn = document.querySelector('#submitAdd')! as HTMLLinkElement;

let feedbackId = 0;

window.addEventListener('DOMContentLoaded', (e) => {
    feedbackId = +localStorage.getItem('currentFeedbacksCounter')!;
});



async function addFeedback<T>(body: FeedbackObject): Promise<T> {
    let Response = fetch('http://localhost:3000/productRequests', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return (await Response).json();
}



submitBtn.addEventListener('click', (e) => {
    let feedback: FeedbackObject = {
        id: 0,
        title: '',
        category: '',
        upvotes: 0,
        status: 'suggestion',
        description: ''
    };


    feedbackId++;
    localStorage.setItem('currentFeedbacksCounter', feedbackId.toString());


    feedback.id = feedbackId;
    feedback.title = inputTitle.value;
    feedback.category = selectCategory.value;
    feedback.description = inputDetail.value;
    
    
    addFeedback(feedback)
        .then(Response => {
            console.log(Response);
        })

    window.location.assign('http://localhost:3100');

});

