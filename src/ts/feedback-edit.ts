import '../assets/sass/feedback-edit.scss';
import { productRequests } from './server-response-interface';
import { getData } from './services/getData';


const headerTitle = document.querySelector('.feedback-edit__name') as HTMLSpanElement;
const inputTitle = document.querySelector('#title') as HTMLInputElement;
const selectCategory = document.querySelector('#category') as HTMLSelectElement;
const selectState = document.querySelector('#state') as HTMLSelectElement;
const inputDetail = document.querySelector('#detail') as HTMLInputElement;

const submitBtn = document.querySelector('#submit');

window.addEventListener('DOMContentLoaded', (e) => {

    const currentFeedbackId = localStorage.getItem('chosenFeedback');

    getData<productRequests>(`http://localhost:3000/productRequests/${currentFeedbackId}`)
        .then(Response => {

            headerTitle.textContent = `'${Response.title}'`;
            inputTitle.value = Response.title;
            for (let i = 0; i < selectCategory.options.length; i++) {
                if (selectCategory.options[i].value === Response.category) {
                    selectCategory.options[i].setAttribute('selected', '');
                }
            }
            for (let i = 0; i < selectState.options.length; i++) {
                if (selectState.options[i].value === Response.status) {
                    selectState.options[i].setAttribute('selected', '');
                }
            }
            inputDetail.value = Response.description;
        });

        submitBtn?.addEventListener('click', (e) => {
            e.preventDefault();

            let title = inputTitle.value;
            let category = selectCategory.options[selectCategory.selectedIndex].value;
            let status = selectState.options[selectState.selectedIndex].value;
            let description = inputDetail.value;

            fetch(`http://localhost:3000/productRequests/${currentFeedbackId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        title: title,
                        category: category,
                        status: status,
                        description: description
                    }
                )
            })
            .then(Response => Response.json())
            .then(Response => {
                console.log(Response);
            })
            
           


        });

});