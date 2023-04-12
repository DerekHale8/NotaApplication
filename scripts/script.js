// Get elements from the DOM
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
const fontFamilySelect = document.getElementById('font-family-select');
const fontSizeSelect = document.getElementById('font-size-select');
const linkBtn = document.getElementById('link-btn');
const imageInput = document.getElementById('image-input');
const imageBtn = document.getElementById('image-btn');
const editor = document.getElementById('editor');

// Add event listeners to the toolbar buttons and selects
boldBtn.addEventListener('click', () => {
    document.execCommand('bold');
});

italicBtn.addEventListener('click', () => {
    document.execCommand('italic');
});

underlineBtn.addEventListener('click', () => {
    document.execCommand('underline');
});

fontFamilySelect.addEventListener('change', (event) => {
    document.execCommand('fontName', false, event.target.value);
});

fontSizeSelect.addEventListener('change', (event) => {
    document.execCommand('fontSize', false, event.target.value);
});

linkBtn.addEventListener('click', () => {
    const url = prompt('Enter the URL:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            editor.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

imageBtn.addEventListener('click', () => {
    imageInput.click();
});

// Add event listeners to the image element to allow resizing
editor.addEventListener('mousedown', (event) => {
    const resizeHandle = event.target.closest('img');
    if (resizeHandle) {
        event.preventDefault();
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = parseInt(window.getComputedStyle(resizeHandle).width, 10);
        const startHeight = parseInt(window.getComputedStyle(resizeHandle).height, 10);
        const handleResize = (event) => {
            const width = Math.max(startWidth + event.clientX - startX, 20);
            const height = Math.max(startHeight + event.clientY - startY, 20);
            resizeHandle.style.width = `${width}px`;
            resizeHandle.style.height = `${height}px`;
        };
        const stopResize = () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        };
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    }
});

const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
  const content = editor.innerHTML;
  saveContent(content);
});

