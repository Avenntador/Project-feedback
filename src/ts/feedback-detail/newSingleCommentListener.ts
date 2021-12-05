import { sendComment } from "../services/sendComment";
import { Comments } from "../interfaces/server-response-interface";
import { currentUser } from "../interfaces/server-response-interface";
import { render } from "./render";


export function newSingleCommentListener(mainContainer: HTMLDivElement, submitNewSingleComment: HTMLLinkElement, newSingleCommentInput: HTMLInputElement, currentUser: currentUser, newCommentsArr: Comments[], chosenFeedback: string) {
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
}