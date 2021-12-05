import '../../assets/sass/feedback-detailPage.scss';
import { FeedbackObject } from '../interfaces/feedback-interface';
import validator from 'validator';
import { addFeedback } from '../services/addFeedback';

const inputTitle = document.querySelector('#title')! as HTMLInputElement;
const selectCategory = document.querySelector('#category')! as HTMLSelectElement;
const inputDetail = document.querySelector('#detail')! as HTMLInputElement;
const submitBtn = document.querySelector('#submitAdd')! as HTMLLinkElement;

let feedbackId = 0;

window.addEventListener('DOMContentLoaded', (e) => {
    feedbackId = +localStorage.getItem('currentFeedbacksCounter')!;
});



submitBtn.addEventListener('click', (e) => {
    let feedback: FeedbackObject = {
        id: 0,
        title: '',
        category: '',
        upvotes: 0,
        status: 'Suggestion',
        description: ''
    };

    feedbackId++;
    localStorage.setItem('currentFeedbacksCounter', feedbackId.toString());

    feedback.id = feedbackId;
    feedback.category = selectCategory.value;
    feedback.title = inputTitle.value;
    feedback.description = inputDetail.value;

    if ((!validator.isEmpty(feedback.title)) && (!validator.isEmpty(feedback.description))) {
        addFeedback(feedback)
            .then(Response => {
                if (Response.status == 201) {
                    window.location.assign('http://localhost:3100');
                    // window.history.back();
                }
            })
    }
});

