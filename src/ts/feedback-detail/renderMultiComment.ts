import { Comments } from "../interfaces/server-response-interface";

export function renderMultiComment(fieldComments: HTMLDivElement, comment: Comments) {
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


    comment.replies!.forEach(reply => {
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
}