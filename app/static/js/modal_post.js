const modalPostOverlay = document.getElementById('modalPostOverlay');
const modalPostInput = document.getElementById('modalPostInput');
const modalPostCharacterCount = document.getElementById('modalPostCharacterCount');
const modalPostSubmitButton = document.getElementById('modalPostSubmitButton');
function openModalPost() {
    modalPostOverlay.classList.add('active');
    modalPostInput.focus();
    document.body.style.overflow = 'hidden';
}
function closeModalPost() {
    modalPostOverlay.classList.remove('active');
    modalPostInput.value = '';
    updatePostCharacterCount();
    document.body.style.overflow = 'auto';
}
function updatePostCharacterCount() {
    const length = modalPostInput.value.length;
    modalPostCharacterCount.textContent = `${length}/280`;
    
    // Меняем цвет при приближении к лимиту
    if (length > 260) {
        modalPostCharacterCount.style.color = '#e0245e';
    } else if (length > 220) {
        modalPostCharacterCount.style.color = '#ffad1f';
    } else {
        modalPostCharacterCount.style.color = '#657786';
    }
    
    // Активируем кнопку только если есть текст
    modalPostSubmitButton.disabled = length === 0 || length > 280;
}
async function handlePostSubmit(event) {
    event.preventDefault();
    
    const tweetText = modalPostInput.value.trim();
    
    if (tweetText && tweetText.length <= 280) {
        console.log('Отправка твита:', tweetText);
        // Здесь будет логика отправки твита
        const data = {'text': tweetText
        }

        try {
            const response = await fetch(`/api/new_post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    alert(`Твит отправлен: ${tweetText}`);

                }
                else {
                    alert(result.message); 
                }
                console.log('Результат:', result);

            } else {
                alert('Ошибка при сохранении: ' + response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке данных');
        }

        closeModalPost();
    }
}
// Закрытие модального окна по клику на overlay
modalPostOverlay.addEventListener('click', function(event) {
    if (event.target === modalPostOverlay) {
        closeModalPost();
    }
});
// Закрытие по ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModalPost();
    }
});