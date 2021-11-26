import '../assets/sass/index.scss';
import { productRequests } from './server-response-interface';
import { currentUser } from './server-response-interface';

const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;


async function getData<T>(query: string): Promise<T> {
    let result = fetch(query);
    return (await result).json();
}


async function upvoteFeedback(id: string, upvote: number) {
    upvote++;
   let Response = fetch(`http://localhost:3000/productRequests/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "upvotes": upvote
            }
        )
    });

    return await Response;
}

let currentFeedbacksCounter = 0;
const field = document.querySelector('.main-content__field')! as HTMLDivElement;
const msgBox = document.querySelector('.message-box')! as HTMLDivElement;
const suggestionCounterField = document.querySelector('.main-content__counter')! as HTMLSpanElement;


function render() {
    getData<Array<productRequests>>('http://localhost:3000/productRequests')
        .then(Response => {
            if (Response.length > 0) {

                field.innerHTML = '';
                field.style.background = 'none';

                currentFeedbacksCounter = Response.length;

                let suggestionCounter = 0;


                // msgBox.style.visibility = 'hidden';


                Response.forEach((item, i) => {

                    if (item.status == 'suggestion') {
                        const div = document.createElement('div');
                        suggestionCounter++;

                        div.classList.add('feedback');
                        div.setAttribute('data-id', item.id.toString());

                        if (i != 0) {
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
                    }


                });

                suggestionCounterField.textContent = suggestionCounter.toString();
            }

            localStorage.setItem('currentFeedbacksCounter', currentFeedbacksCounter.toString());

            const feedback = document.querySelectorAll('.feedback') as unknown as HTMLDivElement[];


            if (feedback) {
                feedback.forEach(item => {
                    item.addEventListener('click', (e) => {

                        e.preventDefault();
                        let target = e.target as HTMLElement;

                        let feedbackId = item.getAttribute('data-id');
                        let currentUpvote = '';

                        if (target.classList.contains('raiting-button')) {
                            console.log('btn clicked')
                            currentUpvote = target.textContent!;

                            upvoteFeedback(feedbackId!, +currentUpvote)
                                .then((Response) => {
                                    if (Response.status == 200) {
                                        render();
                                    }   
                                })

                        }

                    });
                });
            }
        });



}

window.addEventListener('DOMContentLoaded', (e) => {


    getData<currentUser>('http://localhost:3000/currentUser')
        .then(Response => {
            localStorage.setItem('currentUser', JSON.stringify(Response));
        });


    render();






});


