let selectedTag: Element;

function highlightTag(tag: Element) {
    if (selectedTag) {
        selectedTag.classList.remove('tag__active');
    }

    selectedTag = tag;
    tag.classList.add('tag__active');

}


export default highlightTag