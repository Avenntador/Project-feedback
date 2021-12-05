import { Comments } from "../interfaces/server-response-interface";

export function renderSingleComment(fieldComments: HTMLDivElement, comment: Comments) {
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
}