export function renderNewSingleComment(mainContainer: HTMLDivElement) {
    const addNewSingleCommentInput = document.createElement('div');
    addNewSingleCommentInput.classList.add('feedback-detail__add-comment');
    addNewSingleCommentInput.classList.add('mt-light');

    addNewSingleCommentInput.innerHTML = `
        <h1 class="heading-one">Add comment</h1>
        <input type="text" maxlength="250" class="input input__add" id="addNewSingleCommentInput" placeholder="Type your comment here">
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


}