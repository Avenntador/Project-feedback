import '../assets/sass/roadmap.scss'
import { getData } from './services/getData';
import { productRequests } from './server-response-interface';

const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;


const plannedField = document.querySelector('.roadmap__planned') as HTMLDivElement,
    inProgressField = document.querySelector('.roadmap__in-progress') as HTMLDivElement,
    liveField = document.querySelector('.roadmap__live') as HTMLDivElement,
    plannedCounterField = plannedField.querySelector('.roadmap__planned-counter') as HTMLSpanElement,
    inProgressCounterField = inProgressField.querySelector('.roadmap__in-progress-counter') as HTMLSpanElement,
    liveCounterField = liveField.querySelector('.roadmap__live-counter') as HTMLSpanElement;



window.addEventListener('DOMContentLoaded', (e) => {
    let plannedCounter = 0,
        inProgressCounter = 0,
        liveCounter = 0;


    getData<Array<productRequests>>('http://localhost:3000/productRequests')
        .then(Response => {
            Response.forEach(item => {

                let commLength = 0;
                if (item.comments) commLength = item.comments.length;

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

                div.addEventListener('click', (e) => {
                    let target = e.target as HTMLDivElement;
                    let feedback = target.closest('.card');

                    let chosenFeedback = feedback?.getAttribute('data-id');
                    localStorage.setItem('chosenFeedback', chosenFeedback?.toString()!);
                    window.location.assign('../feedback-detail.html');
                });

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
            
        });
});