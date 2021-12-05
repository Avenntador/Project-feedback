import { renderCategory } from "./renderCategory";
import { FeedbackObject } from "../interfaces/feedback-interface";


export function renderByTags(categorySearch: string, field: HTMLElement, item: FeedbackObject, iconUp: string, iconComment: string, commLength: number) {


    const div = document.createElement('div');
    

    div.classList.add('feedback');
    div.setAttribute('data-id', item.id.toString());
    div.classList.add('mb-light');

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
}