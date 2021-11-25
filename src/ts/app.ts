import '../assets/sass/index.scss';
import { serverResponse } from './server-response-interface';

const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;


async function getFeedbacks<T>(): Promise<T> {
    let result = fetch('http://localhost:3000/data');
    return (await result).json();
}



window.addEventListener('DOMContentLoaded', (e) => {
    getFeedbacks<serverResponse>()
        .then(Response => {
            localStorage.setItem('currentUser', JSON.stringify(Response.currentUser));

            if (Response.productRequests.length > 0) {
                const field = document.querySelector('.main-content__field')! as HTMLDivElement;
                const msgBox = document.querySelector('.message-box')! as HTMLDivElement;

                field.style.background = 'none';
                msgBox.style.visibility = 'hidden';


                Response.productRequests.forEach((item, i) => {
                    const div = document.createElement('div');
                    

                    if (i == 0) {
                        div.classList.add('feedback');
                    } else {
                        div.classList.add('feedback');
                        div.classList.add('mt-light');
                    }
                    

                    let commLength = 0;
                    if (item.comments) commLength = item.comments.length;

                    div.innerHTML = `
                        <div class="feedback__raiting flex-center-column">
                                <img inline src="${iconUp}" alt="">
                                <a href="#" class="raiting-button">${item.upvotes}</a>
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
                            </div>
                    `;
                    field.append(div);
                });
            }




        });
});

