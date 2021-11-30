import '../assets/sass/feedback-detail.scss';
import { productRequests } from './server-response-interface';
import { getData } from './services/getData';




const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;

const fieldFeedback = document.querySelector('.nav') as HTMLDivElement;
const fieldComments = document.querySelector('.feedback-detail__total-comments') as HTMLDivElement;
const counterComments = document.querySelector('.feedback-detail-counter') as HTMLSpanElement;

window.addEventListener('DOMContentLoaded', (e) => {
    const chosenFeedback = localStorage.getItem('chosenFeedback');

    const imgs = require.context('../assets/images/user-images', false, /jpg$/);
    imgs.keys().forEach((key) => {
        imgs(key);
    });

    getData<productRequests>(`http://localhost:3000/productRequests/${chosenFeedback}`)
        .then(Response => {



            let commLength = 0;
            if (Response.comments) commLength += Response.comments.length;
            Response.comments?.forEach(repl => {
                if (repl.replies) commLength += repl.replies.length
            });

            counterComments.textContent = commLength.toString();


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

            const feedbackComments = document.createElement('div');

            feedbackComments.classList.add('.feedback-detail__comments');
            feedbackComments.classList.add('.mt-light');

            if (Response.comments) {

                Response.comments.forEach(comment => {

                    if (!comment.replies) {
                        let singleComment = document.createElement('div');
                        singleComment.classList.add('feedback-comment');
                        singleComment.setAttribute('data-commentId', comment.id.toString());

                        singleComment.innerHTML = `
                                <div class="feedback-comment__user-info">
                                    <div class="feedback-comment__avatar">
                                        <img src=${comment.user.image} alt="">
                                    </div>
                                    <div class="feedback-comment__title">
                                        <h3 class="heading-three">${comment.user.name}</h3>
                                        <p class="paragraph">@${comment.user.username}</p>
                                    </div>
                                    <div class="feedback__btn-reply" id ="reply-${comment.id}">Reply</div>
                                </div>
                                <div class="feedback-detail__content">
                                    <p class="paragraph">${comment.content}</p>
                                </div>
                                <div class="feedback-detail__input-reply-on-comment" id="input-${comment.id}">
                                    <input type="text" class="input-reply-on-comment">
                                    <a href="#" class="btn btn__magenta">Post Reply</a>
                                </div>
                            `;
                            fieldComments.append(singleComment);

                            let currentReply = document.querySelector(`#reply-${comment.id}`) as HTMLDivElement;
                            let currentInput = document.querySelector(`#input-${comment.id}`) as HTMLInputElement;
                            

                            currentReply.addEventListener('click', () => {
                                currentInput.classList.toggle('show');
                            });


                        
                    } else {

                        let multiComment = document.createElement('div');
                        multiComment.classList.add('feedback-comment');
                        multiComment.setAttribute('data-commentId', comment.id.toString());



                        multiComment.innerHTML = `
                                <div class="feedback-comment__user-info">
                                    <div class="feedback-comment__avatar">
                                        <img src=${comment.user.image} alt="">
                                    </div>
                                    <div class="feedback-comment__title">
                                        <h3 class="heading-three">${comment.user.name}</h3>
                                        <p class="paragraph">@${comment.user.username}</p>
                                    </div>
                                    <div class="feedback__btn-reply reply-${comment.id}">Reply</div>
                                </div>
                                <div class="feedback-detail__content">
                                    <p class="paragraph">${comment.content}</p>
                                </div>
                            `;

                        if (comment.replies) {
                            comment.replies.forEach(reply => {
                                let replyDiv = document.createElement('div');
                                replyDiv.classList.add('feedback-detail_comment-reply');


                                replyDiv.innerHTML = `
                                    <div class="feedback-reply__user-info">
                                        <div class="feedback-reply__avatar">
                                        <img src=${reply.user.image} alt="">
                                        </div>
                                        <div class="feedback-reply__title">
                                            <h3 class="heading-three">${reply.user.name}</h3>
                                            <p class="paragraph">@${reply.user.username}</p>
                                        </div>
                                        <div class="feedback__btn-reply reply-${comment.id}">Reply</div>
                                    </div>
                                    <div class="feedback-detail__reply-content">
                                        <p class="paragraph"><span class="reply-to"> @${reply.replyingTo}</span>  ${reply.content}</p>
                                    </div>
                                `;
                                multiComment.append(replyDiv);
                            });
                            let input = document.createElement('div');
                            input.classList.add('feedback-detail__input-reply');
                            input.id = `input-${comment.id}`;
                            input.innerHTML = `
                                <input type="text" class="input-reply">
                                <a href="#" class="btn btn__magenta">Post Reply</a>
                            `;
                            multiComment.append(input);
                            fieldComments.append(multiComment);

                            let currentReply = document.querySelectorAll(`.reply-${comment.id}`);
                            let currentInput = document.querySelector(`#input-${comment.id}`) as HTMLInputElement;
                            
                            currentReply.forEach(item => {
                                item.addEventListener('click', () => {
                                    currentInput.classList.toggle('show');
                                });
                            });

                            
                        }


                    }



                });






            }


        });

});