const imgNoFeebacks = require('../../assets/images/No-feedback.png');


export function renderMsgBox(field: HTMLDivElement) {
    let msgBoxDiv = document.createElement('div');
    msgBoxDiv.classList.add('message-box');
    msgBoxDiv.innerHTML = `
        <div class="message-box__logo"><img class="main-message-img" src=${imgNoFeebacks} alt="No feedback's yet"></div>
        <div class="message-box__tittle">
        <h1 class="heading-one">There is no feedback yet.</h1>
        </div>
        <div class="message-box__text">
        <p class="paragraph">Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
        </div>
        <div class="message-box__button">
        <a href="./addfeedback.html" class="btn">Add feedback</a>
        </div>
    `;

    field.style.background = 'white';
    field.append(msgBoxDiv);
}