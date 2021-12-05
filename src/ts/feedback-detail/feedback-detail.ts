import '../../assets/sass/feedback-detail.scss';
import { render } from './render';


const mainContainer = document.querySelector('.feedback-detail__container') as HTMLDivElement;

window.addEventListener('DOMContentLoaded', (e) => {
    const chosenFeedback = localStorage.getItem('chosenFeedback');

    const imgs = require.context('../../assets/images/user-images', false, /jpg$/);
    imgs.keys().forEach((key) => {
        imgs(key);
    });

    render(mainContainer, chosenFeedback!);

});