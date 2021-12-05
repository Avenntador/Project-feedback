export function renderHeader(mainContainer: HTMLDivElement) {

    const nav = document.createElement('div');
    nav.classList.add('nav');

    nav.innerHTML = `
        <a href="./index.html" class="link"> &nbsp; Go back</a>
        <a href="./feedback-edit.html" class="btn btn__blue">Edit feedback</a>
    `;
    mainContainer.insertAdjacentElement('afterbegin', nav);


    const commentsDetail = document.createElement('div') as HTMLDivElement;
    commentsDetail.classList.add('feedback-detail__comments');
    commentsDetail.classList.add('mt-light');

    commentsDetail.innerHTML = `
                <div class="feedback-detail__total-comments"><span class="feedback-detail-counter">4</span>&nbsp; Comments</div>
            `;

    nav.insertAdjacentElement('afterend', commentsDetail);
}