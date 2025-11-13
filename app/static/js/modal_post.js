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

    // Удаляю пост для ретвита при закрытии 
    let tweet = modalPostOverlay.querySelector('.tweet');
    if (tweet){
        tweet.remove();
    }
    // А так же удаляю дата атрибут
    let content_area = modalPostOverlay.querySelector('.modal-post-input-container');
    content_area.removeAttribute('data-parent-post-id');

    

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


async function creteNewPost(data) {

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
                    alert(`Твит отправлен: ${data.text}`);
                }
                else {
                    alert(result.message); 
                }
                console.log('Результат:', result);
            } else {
                alert('Вы точно авторизованы? ' + response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке данных');
        }
    }


async function handlePostSubmit(event) {
    event.preventDefault();
    
    const tweetText = modalPostInput.value.trim();
    const content_area = modalPostOverlay.querySelector('.modal-post-input-container');
    const parent_post_id = content_area.getAttribute('data-parent-post-id');
    const data = {'text': tweetText,
                'parent_post_id': parent_post_id
                    }
    
    if (tweetText && tweetText.length <= 280) {
        console.log('Отправка твита:', tweetText);
        // Здесь будет логика отправки твита
        

        try{
            await creteNewPost(data)
        }
        catch(error) {
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


function open_modal_retweet(post_id, tweet){
    modalPostOverlay.classList.add('active');
    modalPostInput.focus();
    document.body.style.overflow = 'hidden';

    let content_area = modalPostOverlay.querySelector('.modal-post-input-container');
    content_area.appendChild(tweet);

    content_area.setAttribute('data-parent-post-id', post_id);

}