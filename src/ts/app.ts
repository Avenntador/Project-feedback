import '../assets/sass/index.scss';
import { productRequests } from './server-response-interface';
import { currentUser } from './server-response-interface';
import { upvoteFeedback } from './services/upvote';
import { getData } from './services/getData';
import { renderCategory } from './renderCategory';


const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;


let currentFeedbacksCounter = 0;
const field = document.querySelector('.main-content__field')! as HTMLDivElement;
const msgBox = document.querySelector('.message-box')! as HTMLDivElement;
const suggestionCounterField = document.querySelector('.main-content__counter')! as HTMLSpanElement;
const sidePlanned = document.querySelector('.sidebar__planned-counter') as HTMLSpanElement;
const sideInProgress = document.querySelector('.sidebar__in-progress-counter') as HTMLSpanElement;
const sideLive = document.querySelector('.sidebar__live-counter') as HTMLSpanElement;

const sidebarTags = document.querySelector('.sidebar__tags') as HTMLDivElement;
let currenCategorySearch: string;

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
            if (Response.length > 0) {

                field.innerHTML = '';
                field.style.background = 'none';

                currentFeedbacksCounter = Response.length;

                let suggestionCounter = 0;
                let plannedCounter = 0;
                let inProgressCounter = 0;
                let liveCounter = 0;

                // msgBox.style.visibility = 'hidden';




                Response.forEach((item, i) => {

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




