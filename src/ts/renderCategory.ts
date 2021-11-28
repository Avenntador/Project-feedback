import { FeedbackObject } from "./feedback/feedback-interface";

export function renderCategory(field: HTMLElement, elem: HTMLElement, item: FeedbackObject, iconUp: string, iconComment: string, commLength: number) {

    elem.innerHTML = `
        <div class="feedback__raiting flex-center-column">
                <img inline src="${iconUp}" alt="">
                ${item.upvotes}
            </div>
            <div class="feedback__desc ml-md">
                <h1 class="heading-two">${item.title}</h1>
                <div class="feedback__comments">
                    <p class="paragraph">${item.description}</p>
                    <div class="feedback__icons flex-center-row">
                        <img inline src="${iconComment}" alt="">
                        <span class="feedback__count">${commLength}</span>
                    </div>
                </div>
                <a href="#" class="tag">${item.category}</a>
            </div>`;

    field.append(elem);
}