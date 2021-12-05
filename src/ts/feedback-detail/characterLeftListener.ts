export function characterLeftListener(characterLeftField: HTMLDivElement, newSingleCommentInput: HTMLInputElement) {
    newSingleCommentInput.addEventListener('keyup', (e) => {
        let characterLeft = newSingleCommentInput.maxLength - newSingleCommentInput.value.length;
        characterLeftField.textContent = `${characterLeft} Character Left`;
    });
}