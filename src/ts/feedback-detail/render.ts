import { productRequests } from '../interfaces/server-response-interface';
import { getData } from '../services/getData';
import { Replies } from '../interfaces/server-response-interface';
import { Comments } from '../interfaces/server-response-interface';
import { currentUser } from '../interfaces/server-response-interface';
import { sendComment } from '../services/sendComment';
import { renderNewSingleComment } from './renderNewSingleComment';
import { characterLeftListener } from './characterLeftListener';
import { renderFeedback } from './renderFeedback';
import { renderHeader } from './renderHeader';
import { renderSingleComment } from './renderSingleComment';
import { renderMultiComment } from './renderMultiComment';


export function render(mainContainer: HTMLDivElement, chosenFeedback: string) {

    getData<productRequests>(`http://localhost:3000/productRequests/${chosenFeedback}`)
        .then(Response => {

            mainContainer.innerHTML = '';

            let newCommentsArr: Comments[];

            if (Response.comments) {
                newCommentsArr = JSON.parse(JSON.stringify(Response.comments));
            } else {
                newCommentsArr = [];
            }

           
            renderHeader(mainContainer);
            
            const fieldFeedback = document.querySelector('.nav') as HTMLDivElement;
            const fieldComments = document.querySelector('.feedback-detail__total-comments') as HTMLDivElement;
            const counterComments = document.querySelector('.feedback-detail-counter') as HTMLSpanElement;

            renderNewSingleComment(mainContainer);

            const submitNewSingleComment = document.querySelector('#addNewSingleComment') as HTMLLinkElement;
            const newSingleCommentInput = document.querySelector('#addNewSingleCommentInput') as HTMLInputElement;
            const characterLeftField = document.querySelector('.feedback-detail__character-left') as HTMLDivElement;

            characterLeftListener(characterLeftField, newSingleCommentInput);



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

                sendComment(chosenFeedback, newCommentsArr)
                    .then(Response => {
                        if (Response.status == 200) {
                            render(mainContainer, chosenFeedback);
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

            renderFeedback(Response, fieldFeedback, commLength);

            if (Response.comments) {
                let replies: any[] = [];
                let reply: Replies;
                let replyTo: string;
                let replyContent: string;
                let currentComment: number;

                Response.comments.forEach((comment, i) => {

                    if (!comment.replies) {
                        
                        renderSingleComment(fieldComments, comment);

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


                            sendComment(chosenFeedback, newCommentsArr)
                                .then(Response => {
                                    if (Response.status == 200) {
                                        render(mainContainer, chosenFeedback);
                                    }

                                });

                        });

                    } else {

                        renderMultiComment(fieldComments, comment);

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

                            for (let i = 0; i < newCommentsArr.length; i++) {
                                if (currentComment == newCommentsArr[i].id) {
                                    newCommentsArr[i].replies!.push(reply);
                                    break;
                                }
                            }

                            sendComment(chosenFeedback, newCommentsArr)
                                .then(Response => {
                                    if (Response.status == 200) {
                                        render(mainContainer, chosenFeedback);
                                    }
                                });
                        });
                    }

                });



            }
        });

}
