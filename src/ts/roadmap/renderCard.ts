import { productRequests } from "../interfaces/server-response-interface";

const iconUp = require("../../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../../assets/images/shared/icon-comments.svg") as string;


export function renderCard(feedback: productRequests, plannedField: HTMLDivElement, inProgressField: HTMLDivElement, liveField: HTMLDivElement) {
    let color_shape = '';

    let commLength = 0;
    if (feedback.comments) commLength += feedback.comments.length;
    feedback.comments?.forEach(repl => {
        if (repl.replies) commLength += repl.replies.length
    });

    let div = document.createElement('div');
    div.classList.add('card');
    div.setAttribute('data-id', feedback.id.toString());

    switch (feedback.status) {
        case 'Planned': {
            div.classList.add('card__planned');
            color_shape = 'color-shape__planned';
            break;
        }

        case 'In-progress': {
            div.classList.add('card__in-progress');
            color_shape = 'color-shape__in-progress';
            break;
        }

        case 'Live': {
            div.classList.add('card__live');
            color_shape = 'color-shape__live';
            break;
        }
    }

    div.innerHTML =
        `
        <div class="card__status">
            <span class="color-shape ${color_shape}"></span>
            ${feedback.status}
        </div>
        <div class="card__title">
            <h2 class="heading-two">${feedback.title}</h2>
            <p class="paragraph">${feedback.description}</p>
        </div>
        <div class="tag mt-light">${feedback.category}</div>
        <div class="card__social">
            <div class="card__raiting">
                <img class="mr-light" inline src="${iconUp}" alt="2">
                <span class="card__raiting-counter">${feedback.upvotes}</span>     
            </div>
            <div class="card__comments">
                <img inline src="${iconComment}" alt="2">
                <span class="card__comments-counter">${commLength}</span>
            </div>
        </div>
    `;


    switch (feedback.status) {
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


}