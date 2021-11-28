import '../assets/sass/feedback-detail.scss';
import { productRequests } from './server-response-interface';
import { getData } from './services/getData';


const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;

const field = document.querySelector('.nav') as HTMLDivElement;


window.addEventListener('DOMContentLoaded', (e) => {
    const chosenFeedback = localStorage.getItem('chosenFeedback');

    getData<productRequests>(`http://localhost:3000/productRequests/${chosenFeedback}`)
        .then(Response => {

            let totalComments = 0;
            if (Response.comments) totalComments = Response.comments.length;

            const feedbackElem = document.createElement('div');
            feedbackElem.classList.add('feedback');
            feedbackElem.classList.add('mt-light');

            feedbackElem.innerHTML = `
                <div class="feedback__raiting flex-center-column">
                        <img inline src="${iconUp}" alt="">
                        ${Response.upvotes}
                    </div>
                    <div class="feedback__desc ml-md">
                        <h1 class="heading-two">${Response.title}</h1>
                        <div class="feedback__comments">
                            <p class="paragraph">${Response.description}</p>
                            <div class="feedback__icons flex-center-row">
                                <img inline src="${iconComment}" alt="">
                                <span class="feedback__count">${totalComments}</span>
                            </div>
                        </div>
                        <a href="#" class="tag">${Response.category}</a>
                    </div>`;

            field.insertAdjacentElement('afterend', feedbackElem);

            const feedbackComments = document.createElement('div');

            feedbackComments.classList.add('.feedback-detail__comments');
            feedbackComments.classList.add('.mt-light');

            // ПОЗЖЕ СДЕЛАТЬ


        });

});