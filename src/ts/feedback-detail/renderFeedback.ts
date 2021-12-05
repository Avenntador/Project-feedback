import { productRequests } from "../interfaces/server-response-interface";
const iconUp = require("../../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../../assets/images/shared/icon-comments.svg") as string;


export function renderFeedback(Response: productRequests, fieldFeedback: HTMLDivElement, commLength: number) {
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
                            <span class="feedback__count">${commLength}</span>
                        </div>
                    </div>
                    <a href="#" class="tag">${Response.category}</a>
                </div>`;

    fieldFeedback.insertAdjacentElement('afterend', feedbackElem);


}