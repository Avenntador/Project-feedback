import '../../assets/sass/roadmap.scss'
import { getData } from '../services/getData';
import { productRequests } from '../interfaces/server-response-interface';
import { upvoteFeedback } from '../services/upvote';
import { renderCard } from './renderCard';

const iconUp = require("../../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../../assets/images/shared/icon-comments.svg") as string;


const plannedField = document.querySelector('.roadmap__planned-field') as HTMLDivElement,
    inProgressField = document.querySelector('.roadmap__in-progress-field') as HTMLDivElement,
    liveField = document.querySelector('.roadmap__live-field') as HTMLDivElement,
    plannedCounterField = document.querySelector('.roadmap__planned-counter') as HTMLSpanElement,
    inProgressCounterField = document.querySelector('.roadmap__in-progress-counter') as HTMLSpanElement,
    liveCounterField = document.querySelector('.roadmap__live-counter') as HTMLSpanElement;



function render() {
    let plannedCounter = 0,
        inProgressCounter = 0,
        liveCounter = 0;

    getData<Array<productRequests>>('http://localhost:3000/productRequests')
        .then(Response => {

            plannedField.innerHTML = '';
            inProgressField.innerHTML = '';
            liveField.innerHTML = '';

            Response.forEach(item => {

                switch (item.status) {
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

                renderCard(item, plannedField, inProgressField, liveField);
            });

            plannedCounterField.textContent = `(${plannedCounter.toString()})`;
            inProgressCounterField.textContent = `(${inProgressCounter.toString()})`;
            liveCounterField.textContent = `(${liveCounter.toString()})`;


            let cardTitle = document.querySelectorAll('.card__title h2');


            cardTitle.forEach(title => {
                title?.addEventListener('click', (e) => {
                    let target = e.target as HTMLDivElement;
                    let feedback = target.closest('.card');

                    if (target.classList.contains('heading-two')) {
                        let chosenFeedback = feedback?.getAttribute('data-id');
                        localStorage.setItem('chosenFeedback', chosenFeedback?.toString()!);
                        window.location.assign('../feedback-detail.html');
                    }
                });
            });


            let cardRaiting = document.querySelectorAll('.card__raiting') as unknown as HTMLDivElement[];

            cardRaiting.forEach(card => {
                card?.addEventListener('click', (e) => {
                    let currentUpvote = 0;
                    let target = e.target as HTMLDivElement;
                    let feedback = target.closest('.card');

                    if (target.classList.contains('card__raiting')) {
                        currentUpvote = +target.querySelector('span')?.textContent!;
                        let cardId = feedback?.getAttribute('data-id');
                        upvoteFeedback(cardId!, +currentUpvote)
                            .then((Response) => {
                                if (Response.status == 200) {
                                    render();
                                }
                            })
                    }
                });
            });
        });
}


window.addEventListener('DOMContentLoaded', (e) => {
    render();
});