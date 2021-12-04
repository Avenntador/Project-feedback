import '../assets/sass/feedback-detail.scss';
import { productRequests } from './server-response-interface';
import { getData } from './services/getData';
import { Replies } from './server-response-interface';
import { Comments } from './server-response-interface';
import { currentUser } from './server-response-interface';


const iconUp = require("../assets/images/shared/icon-arrow-up.svg") as string;
const iconComment = require("../assets/images/shared/icon-comments.svg") as string;

const mainContainer = document.querySelector('.feedback-detail__container') as HTMLDivElement;

window.addEventListener('DOMContentLoaded', (e) => {
    const chosenFeedback = localStorage.getItem('chosenFeedback');

    const imgs = require.context('../assets/images/user-images', false, /jpg$/);
    imgs.keys().forEach((key) => {
        imgs(key);
    });

    function render() {
        getData<productRequests>(`http://localhost:3000/productRequests/${chosenFeedback}`)
            .then(Response => {

                mainContainer.innerHTML = '';

                let newCommentsArr: Comments[];

                if (Response.comments) {
                    newCommentsArr =  JSON.parse(JSON.stringify(Response.comments));
                } else {
                    newCommentsArr = [];
                }

                const nav = document.createElement('div');
                nav.classList.add('nav');

                nav.innerHTML = `
                    <a href="./index.html" class="link"> &nbsp; Go back</a>
                    <a href="./feedback-edit.html" class="btn btn__blue">Edit feedback</a>
                `;
                mainContainer.insertAdjacentElement('afterbegin', nav);


                const fieldFeedback = document.querySelector('.nav') as HTMLDivElement;


                const commentsDetail = document.createElement('div') as HTMLDivElement;
                commentsDetail.classList.add('feedback-detail__comments');
                commentsDetail.classList.add('mt-light');

                commentsDetail.innerHTML = `
                    <div class="feedback-detail__total-comments"><span class="feedback-detail-counter">4</span>&nbsp; Comments</div>
                `;

                nav.insertAdjacentElement('afterend', commentsDetail);


                const fieldComments = document.querySelector('.feedback-detail__total-comments') as HTMLDivElement;
                const counterComments = document.querySelector('.feedback-detail-counter') as HTMLSpanElement;



                const addNewSingleCommentInput = document.createElement('div');
                addNewSingleCommentInput.classList.add('feedback-detail__add-comment');
                addNewSingleCommentInput.classList.add('mt-light');

                addNewSingleCommentInput.innerHTML = `
                    <h1 class="heading-one">Add comment</h1>
                    <input type="text" class="input input__add" id="addNewSingleCommentInput" placeholder="Type your comment here">
                    <div class="feedback-detail__input-info mt-hard">
                    <div class="feedback-detail__character-left">
                        250 Character left
                    </div>
                    <div class="feedback-detail__btn ">
                        <a href="#" class="btn btn__magenta" id="addNewSingleComment">Post Comment</a>
                    </div>
                    </div>
                `;

                mainContainer.insertAdjacentElement('beforeend', addNewSingleCommentInput);
              
                const submitNewSingleComment = document.querySelector('#addNewSingleComment') as HTMLLinkElement;
                const newSingleCommentInput = document.querySelector('#addNewSingleCommentInput') as HTMLInputElement;

                submitNewSingleComment.addEventListener('click', (e) => {
                    e.preventDefault();

                    let currentMaxCommentId = parseInt(localStorage.getItem('currentMaxCommentId')!);
                    currentMaxCommentId++;
                    localStorage.setItem('currentMaxCommentId', currentMaxCommentId.toString());

                    let newComment: Comments = {
                        id: currentMaxCommentId,
                        content: newSingleCommentInput.value,
                        user: {
                            image: currentUser.image,
                            name: currentUser.name,
                            username: currentUser.username
                        },
                        replies: null
                    }

                    
                        newCommentsArr.push(newComment);

                        fetch(`http://localhost:3000/productRequests/${chosenFeedback}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(
                            {
                                "comments": newCommentsArr
                            }
                        )
                    })
                        .then(Response => {
                            if (Response.status == 200) {
                                render();
                            }

                        });
                    
                        
                    
                });







                let currentUser: currentUser = JSON.parse(localStorage.getItem('currentUser')!);
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


                if (Response.comments) {

                    
                    
                    let replies: any[] = [];
                    let reply: Replies;
                    let replyTo: string;
                    let replyContent: string;
                    let currentComment: number;


                    Response.comments.forEach((comment, i) => {

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
                                    <a href="#" id="submitSingleComment${comment.id}" class="btn btn__magenta">Post Reply</a>
                                </div>
                            `;
                            fieldComments.append(singleComment);

                            let currentReply = document.querySelector(`#reply-${comment.id}`) as HTMLDivElement;
                            let currentInput = document.querySelector(`#input-${comment.id}`) as HTMLInputElement;
                            let input = currentInput.querySelector('input') as HTMLInputElement;



                            currentReply.addEventListener('click', (e) => {
                                let target = e.target as HTMLElement;
                                replyTo = target.previousElementSibling?.querySelector('p')?.textContent!;
                                replyTo = replyTo.slice(1, replyTo.length);
                                input.value = '';
                                currentInput.classList.toggle('show');
                            })

                            let submitSingleComment = document.querySelector(`#submitSingleComment${comment.id}`) as HTMLLinkElement;

                            submitSingleComment.addEventListener('click', (e) => {
                                e.preventDefault();

                                let target = e.target as HTMLElement;

                                currentComment = parseInt(target.closest('.feedback-comment')?.getAttribute('data-commentId')!);
                                console.log(`submiting ${currentComment} comment`);
                                replyContent = ` ${input.value}`;
                                reply = {
                                    content: replyContent,
                                    replyingTo: replyTo,
                                    user: {
                                        image: currentUser.image,
                                        name: currentUser.name,
                                        username: currentUser.username
                                    }
                                }
                                replies.push(reply)


                                for (let i = 0; i < newCommentsArr.length; i++) {
                                    if (currentComment == newCommentsArr[i].id) {
                                        newCommentsArr[i].replies = replies;
                                        break;
                                    }
                                }


                                fetch(`http://localhost:3000/productRequests/${chosenFeedback}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(
                                        {
                                            "comments": newCommentsArr
                                        }
                                    )
                                })
                                    .then(Response => {
                                        if (Response.status == 200) {
                                            render();
                                        }

                                    });

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
                                    <a href="#" class="btn btn__magenta " id="submitMultiComment${comment.id}">Post Reply</a>
                                `;
                            multiComment.append(input);
                            fieldComments.append(multiComment);

                            let currentReply = document.querySelectorAll(`.reply-${comment.id}`);
                            let currentInput = document.querySelector(`#input-${comment.id}`) as HTMLInputElement;
                            let inputMulti = currentInput.querySelector('.input-reply') as HTMLInputElement;


                            currentReply.forEach(item => {

                                item.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    let target = e.target as HTMLElement;

                                    replyTo = target.previousElementSibling?.querySelector('p')?.textContent!;
                                    replyTo = replyTo.slice(1, replyTo.length);

                                    inputMulti.value = '';
                                    currentInput.classList.toggle('show');
                                });
                            });

                            let submitMultiComment = document.querySelector(`#submitMultiComment${comment.id}`) as HTMLLinkElement;

                            submitMultiComment.addEventListener('click', (e) => {
                                e.preventDefault();
                                let target = e.target as HTMLElement;

                                currentComment = parseInt(target.closest('.feedback-comment')?.getAttribute('data-commentId')!);
                                console.log(`submiting ${currentComment} comment`);

                                replyContent = `${inputMulti.value}`;
                                reply = {
                                    content: replyContent,
                                    replyingTo: replyTo,
                                    user: {
                                        image: currentUser.image,
                                        name: currentUser.name,
                                        username: currentUser.username
                                    }
                                }
                                console.log(reply);

                                for (let i = 0; i < newCommentsArr.length; i++) {
                                    if (currentComment == newCommentsArr[i].id) {
                                        newCommentsArr[i].replies!.push(reply);
                                        break;
                                    }
                                }

                                fetch(`http://localhost:3000/productRequests/${chosenFeedback}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(
                                        {
                                            "comments": newCommentsArr
                                        }
                                    )
                                })
                                    .then(Response => {
                                        if (Response.status == 200) {
                                            render();
                                        }
                                    });
                            });
                        }

                    });


                   
                } 
            });

    }

    render();

});