import '../../assets/sass/index.scss';
import { productRequests } from '../interfaces/server-response-interface';
import { currentUser } from '../interfaces/server-response-interface';
import { upvoteFeedback } from '../services/upvote';
import { getData } from '../services/getData';
import { removeSelected } from './removeSelected';
import { getSortedResponse } from './getSortedResponse';
import { renderByTags } from './renderByTags';
import highlightTag from './highlightTag';
import { renderMsgBox } from './renderMsgBox';


const iconUp = require("../../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../../assets/images/shared/icon-comments.svg") as string;

const field = document.querySelector('.main-content__field')! as HTMLDivElement;
const suggestionCounterField = document.querySelector('.main-content__counter')! as HTMLSpanElement;
const sidePlanned = document.querySelector('.sidebar__planned-counter') as HTMLSpanElement;
const sideInProgress = document.querySelector('.sidebar__in-progress-counter') as HTMLSpanElement;
const sideLive = document.querySelector('.sidebar__live-counter') as HTMLSpanElement;

const sortTitle = document.querySelector('#sort') as HTMLSpanElement;
const sidebarTags = document.querySelector('.sidebar__tags') as HTMLDivElement;

let currentCategorySearch: string;
let currentCommentOrUpvotesSearch: string;
let sortSelect = document.querySelector('.main-content__select') as HTMLSelectElement;
let currentMaxCommentId: string;
let currentFeedbacksCounter = 0;


sidebarTags.addEventListener('click', (e) => {
    let target = e.target as HTMLElement;

    if (target.classList.contains('tag')) {
        e.preventDefault();
        currentCategorySearch = target.textContent!;
        highlightTag(target);
        localStorage.setItem('currentCategorySearch', currentCategorySearch);
        render(currentCategorySearch, currentCommentOrUpvotesSearch);
    }
});



function render(categorySearch: string, sortOrder: string) {
    getData<Array<productRequests>>('http://localhost:3000/productRequests')
        .then(Response => {

            let suggestionCounter = 0;
            let plannedCounter = 0;
            let inProgressCounter = 0;
            let liveCounter = 0;

            sortTitle.textContent = sortOrder;
            let sortedArr: any[] = getSortedResponse(sortOrder, Response);


            sortedArr.forEach(item => {

                switch (item.status) {
                    case 'Suggestion': {
                        suggestionCounter++;
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



            if (suggestionCounter > 0) {

                field.innerHTML = '';
                field.style.background = 'none';

                currentFeedbacksCounter = Response[0].id;
                Response.forEach(item => {
                    if (item.id > currentFeedbacksCounter) {
                        currentFeedbacksCounter = item.id;
                    }
                });

                Response.forEach((item) => {

                    if (item.comments) {
                        item.comments.forEach(comment => {
                            currentMaxCommentId = comment.id.toString();
                        });
                    }


                    if (item.status === 'Suggestion') {
                        suggestionCounter++;
                        let commLength = 0;
                        if (item.comments) commLength += item.comments.length;
                        item.comments?.forEach(repl => {
                            if (repl.replies) commLength += repl.replies.length
                        });

                        renderByTags(categorySearch, field, item, iconUp, iconComment, commLength);

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
                renderMsgBox(field);
            }

            localStorage.setItem('currentFeedbacksCounter', currentFeedbacksCounter.toString());

            const feedback = document.querySelectorAll('.feedback') as unknown as HTMLDivElement[];

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
                                    render(categorySearch, sortOrder);
                                }
                            })
                    }
                });
            });

        });
}



window.addEventListener('DOMContentLoaded', (e) => {

    if (!localStorage.getItem('currentCategorySearch')) {
        currentCategorySearch = 'All';
        localStorage.setItem('currentCategorySearch', currentCategorySearch);
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

    currentCategorySearch = localStorage.getItem('currentCategorySearch')!;


    if (!localStorage.getItem('currentCommentOrUpvotesSearch')) {
        currentCommentOrUpvotesSearch = sortSelect.options[0].value;
        localStorage.setItem('currentCommentOrUpvotesSearch', currentCommentOrUpvotesSearch)!;
    }

    currentCommentOrUpvotesSearch = localStorage.getItem('currentCommentOrUpvotesSearch')!;

    for (let i = 0; i < sortSelect.length; i++) {
        if (currentCommentOrUpvotesSearch === sortSelect.options[i].value) {
            removeSelected(sortSelect.options[i]);
        }
    }


    sortSelect.addEventListener('change', (e) => {
        let target = e.target as HTMLOptionElement;

        currentCommentOrUpvotesSearch = target.value;
        for (let i = 0; i < sortSelect.length; i++) {
            if (currentCommentOrUpvotesSearch === sortSelect.options[i].value) {
                removeSelected(sortSelect.options[i]);
            }
        }
        localStorage.setItem('currentCommentOrUpvotesSearch', currentCommentOrUpvotesSearch)!;

        render(currentCategorySearch, currentCommentOrUpvotesSearch);
    });

    render(currentCategorySearch, currentCommentOrUpvotesSearch);

});




