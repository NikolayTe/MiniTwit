btn_likes = document.querySelectorAll('.fa-heart')

btn_likes.forEach(btn => {
    btn.addEventListener('click', async function() {
        console.log('Сердечко нажато!', this);

        // Нахожу id поста
        const post_id = this.closest('.tweet').id;

        try {
            const response = await fetch(`/api/post/${post_id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    if(result.is_like){
                        this.classList.remove('far');
                        this.classList.add('fas');
                        this.style.color = 'red';
                    }
                    else {
                        this.classList.remove('fas');
                        this.classList.add('far');
                        this.style.color = '';
                    }

                    const count_span = this.closest('.tweet-action').querySelector('span');
                    console.log(count_span, result.count_likes)
                    count_span.textContent = result.count_likes;

                }
                else {
                    alert(result.message); 
                }
                console.log('Результат:', result);

            } else {
                alert('Ошибка при лайке: ' + response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при лайке');
        }

    });
});