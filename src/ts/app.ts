import '../assets/sass/index.scss';
import { productRequests } from './server-response-interface';
import { currentUser } from './server-response-interface';
import { upvoteFeedback } from './services/upvote';
import { getData } from './services/getData';
import { renderCategory } from './renderCategory';


const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;
const imgNoFeebacks = require('../assets/images/No-feedback.png');

let currentFeedbacksCounter = 0;
const field = document.querySelector('.main-content__field')! as HTMLDivElement;
const suggestionCounterField = document.querySelector('.main-content__counter')! as HTMLSpanElement;
const sidePlanned = document.querySelector('.sidebar__planned-counter') as HTMLSpanElement;
const sideInProgress = document.querySelector('.sidebar__in-progress-counter') as HTMLSpanElement;
const sideLive = document.querySelector('.sidebar__live-counter') as HTMLSpanElement;

const sidebarTags = document.querySelector('.sidebar__tags') as HTMLDivElement;
let currenCategorySearch: string;

let currentMaxCommentId: string;


let selectedTag: Element;

function highlightTag(tag: Element) {
    if (selectedTag) {
        selectedTag.classList.remove('tag__active');
    }

    selectedTag = tag;
    tag.classList.add('tag__active');

}

sidebarTags.addEventListener('click', (e) => {
    let target = e.target as HTMLElement;

    if (target.classList.contains('tag')) {
        e.preventDefault();
        currenCategorySearch = target.textContent!;
        highlightTag(target);
        localStorage.setItem('currentCategorySearch', currenCategorySearch);
        render(currenCategorySearch);
    }
});




function render(categorySearch: string) {
    getData<Array<productRequests>>('http://localhost:3000/productRequests')
        .then(Response => {

            let suggestionFeedbackLength = 0;
            let suggestionCounter = 0;
            let plannedCounter = 0;
            let inProgressCounter = 0;
            let liveCounter = 0;

            Response.forEach(item => {

                switch (item.status) {
                    case 'Suggestion': {
                        suggestionFeedbackLength++;
                        break;
                    }

                    case 'Planned': {
                        plannedCounter++;
                        break;
                    }

                    case 'In-progress': {
                        inProgressCounter++;
                        break;
                    }

                    case 'Live': {
                        liveCounter++;
                        break;
                    }
                }
            });

            suggestionCounterField.textContent = suggestionCounter.toString();
            sidePlanned.textContent = plannedCounter.toString();
            sideInProgress.textContent = inProgressCounter.toString();
            sideLive.textContent = liveCounter.toString();



            if (suggestionFeedbackLength > 0) {

                field.innerHTML = '';
                field.style.background = 'none';

                currentFeedbacksCounter = Response[0].id;
                Response.forEach(item => {
                    if (item.id > currentFeedbacksCounter) {
                        currentFeedbacksCounter = item.id;
                    }
                });

                Response.forEach((item, i) => {

                    if (item.comments) {
                        item.comments.forEach(comment => {
                            currentMaxCommentId = comment.id.toString();
                        });
                    }


                    switch (item.status) {
                        case 'Suggestion': {
                            const div = document.createElement('div');
                            suggestionCounter++;

                            div.classList.add('feedback');
                            div.setAttribute('data-id', item.id.toString());
                            div.classList.add('mb-light');



                            let commLength = 0;


                            if (item.comments) commLength += item.comments.length;
                            item.comments?.forEach(repl => {
                                if (repl.replies) commLength += repl.replies.length
                            });

                            switch (categorySearch) {
                                case 'All': {
                                    renderCategory(field, div, item, iconUp, iconComment, commLength);
                                    break;
                                }

                                case 'UI': {
                                    if (item.category == 'UI') {
                                        renderCategory(field, div, item, iconUp, iconComment, commLength);
                                    }
                                    break;
                                }

                                case 'UX': {
                                    if (item.category == 'UX') {
                                        renderCategory(field, div, item, iconUp, iconComment, commLength);
                                    }
                                    break;
                                }

                                case 'Feature': {
                                    if (item.category == 'Feature') {
                                        renderCategory(field, div, item, iconUp, iconComment, commLength);
                                    }
                                    break;
                                }

                                case 'Enhancement': {
                                    if (item.category == 'Enhancement') {
                                        renderCategory(field, div, item, iconUp, iconComment, commLength);
                                    }
                                    break;
                                }

                                case 'Bug': {
                                    if (item.category == 'Bug') {
                                        renderCategory(field, div, item, iconUp, iconComment, commLength);
                                    }
                                    break;
                                }
                            }

                            div.addEventListener('click', (e) => {
                                let target = e.target as HTMLDivElement;
                                let feedback = target.closest('.feedback');
                                if (!target.classList.contains('feedback__raiting')) {
                                    let chosenFeedback = feedback?.getAttribute('data-id');
                                    localStorage.setItem('chosenFeedback', chosenFeedback?.toString()!);
                                    window.location.assign('../feedback-detail.html');
                                }
                            });

                            break;
                        }

                    }
                });

                localStorage.setItem('currentMaxCommentId', currentMaxCommentId);


            } else {

                currentFeedbacksCounter = Response[0].id;
                Response.forEach(item => {
                    if (item.id > currentFeedbacksCounter) {
                        currentFeedbacksCounter = item.id;
                    }
                });

                localStorage.setItem('currentFeedbacksCounter', currentFeedbacksCounter.toString());


                let msgBoxDiv = document.createElement('div');
                msgBoxDiv.classList.add('message-box');
                msgBoxDiv.innerHTML = `
                    <div class="message-box__logo"><img class="main-message-img" src=${imgNoFeebacks} alt="No feedback's yet"></div>
                    <div class="message-box__tittle">
                    <h1 class="heading-one">There is no feedback yet.</h1>
                    </div>
                    <div class="message-box__text">
                    <p class="paragraph">Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
                    </div>
                    <div class="message-box__button">
                    <a href="./addfeedback.html" class="btn">Add feedback</a>
                    </div>
                `;

                field.style.background = 'white';
                field.append(msgBoxDiv);
            }



            localStorage.setItem('currentFeedbacksCounter', currentFeedbacksCounter.toString());

            const feedback = document.querySelectorAll('.feedback') as unknown as HTMLDivElement[];

            if (feedback) {
                feedback.forEach(item => {
                    item.addEventListener('click', (e) => {

                        e.preventDefault();
                        let target = e.target as HTMLElement;

                        let feedbackId = item.getAttribute('data-id');
                        let currentUpvote = 0;

                        if (target.classList.contains('feedback__raiting')) {

                            currentUpvote = +target.textContent!;

                            upvoteFeedback(feedbackId!, +currentUpvote)
                                .then((Response) => {
                                    if (Response.status == 200) {
                                        render(categorySearch);
                                    }
                                })
                        }
                    });
                });
            }
        });
}

window.addEventListener('DOMContentLoaded', (e) => {

    if (!localStorage.getItem('currentCategorySearch')) {
        currenCategorySearch = 'All';
        localStorage.setItem('currentCategorySearch', currenCategorySearch);
    }

    Array.from(sidebarTags.children).forEach(item => {
        if (item.textContent == localStorage.getItem('currentCategorySearch')) {
            highlightTag(item);
        }
    });

    getData<currentUser>('http://localhost:3000/currentUser')
        .then(Response => {
            localStorage.setItem('currentUser', JSON.stringify(Response));
        });

    currenCategorySearch = localStorage.getItem('currentCategorySearch')!;

    render(currenCategorySearch);

});




