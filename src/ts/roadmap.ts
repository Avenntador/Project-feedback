import '../assets/sass/roadmap.scss'
import { getData } from './services/getData';
import { productRequests } from './interfaces/server-response-interface';
import { upvoteFeedback } from './services/upvote';

const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;


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

                let commLength = 0;
                if (item.comments) commLength += item.comments.length;
                item.comments?.forEach(repl => {
                    if (repl.replies) commLength += repl.replies.length
                });

                let color_shape = '';

                let div = document.createElement('div');
                div.classList.add('card');
                div.setAttribute('data-id', item.id.toString());

                switch (item.status) {
                    case 'Planned': {
                        div.classList.add('card__planned');
                        color_shape = 'color-shape__planned';
                        plannedCounter++;
                        break;
                    }

                    case 'In-progress': {
                        div.classList.add('card__in-progress');
                        color_shape = 'color-shape__in-progress';
                        inProgressCounter++;
                        break;
                    }

                    case 'Live': {
                        div.classList.add('card__live');
                        color_shape = 'color-shape__live';
                        liveCounter++;
                        break;
                    }
                }

                div.innerHTML =
                    `
                            <div class="card__status">
                                <span class="color-shape ${color_shape}"></span>
                                ${item.status}
                            </div>
                            <div class="card__title">
                                <h2 class="heading-two">${item.title}</h2>
                                <p class="paragraph">${item.description}</p>
                            </div>
                            <div class="tag mt-light">${item.category}</div>
                            <div class="card__social">
                                <div class="card__raiting">
                                    <img class="mr-light" inline src="${iconUp}" alt="2">
                                    <span class="card__raiting-counter">${item.upvotes}</span>     
                                </div>
                                <div class="card__comments">
                                    <img inline src="${iconComment}" alt="2">
                                    <span class="card__comments-counter">${commLength}</span>
                                </div>
                            </div>
                `;


                switch (item.status) {
                    case 'Planned': {
                        plannedField.append(div);
                        break;
                    }

                    case 'In-progress': {
                        inProgressField.append(div);
                        break;
                    }

                    case 'Live': {
                        liveField.append(div);
                        break;
                    }
                }
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