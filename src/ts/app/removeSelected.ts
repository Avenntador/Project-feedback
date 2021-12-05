let lastSelect: HTMLOptionElement;

export function removeSelected(select: HTMLOptionElement) {
    if (lastSelect) {
        lastSelect.removeAttribute('selected');
    }
    lastSelect = select;
    lastSelect.setAttribute('selected', '');
}