btn_likes = document.querySelectorAll('.fa-heart')
btn_subscribe = document.querySelector('.subscribe-btn')
btn_favour = document.querySelectorAll('.fa-bookmark')

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
                alert('Ошибка при лайке: ' + response.message);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при лайке');
        }

    });
});

// Избранное
btn_favour.forEach(btn => {
    btn.addEventListener('click', async function() {

        // Нахожу id поста
        const post_id = btn.closest('.tweet').id;

        try {
           const response = await fetch(`/api/post/${post_id}/favourite`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               }
           });
           
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                   if(result.is_favourite){
                        btn.classList.remove('far');
                        btn.classList.add('fas');
                        btn.style.color = 'orange'
                   }
                   else {
                        btn.classList.remove('fas');
                        btn.classList.add('far');
                        btn.style.color = ''
                   }

               }
               else {
                   alert(result.message); 
               }
               console.log('Результат:', result);

            } else {
                alert('Ошибка при добавлении в избранное: ' + response.message);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении в избранное');
        }





        
    });
})

// Подписка / отписка
if (btn_subscribe){
    btn_subscribe.addEventListener('click', async function() { 

        user_id = btn_subscribe.closest('.user-profile-card').id;
        
        try {
            const response = await fetch(`/api/subscribe/${user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    if(result.subscribed){
                        btn_subscribe.classList.add('subscribed');
                        btn_subscribe.textContent = 'Подписан';

                    }else{
                        btn_subscribe.classList.remove('subscribed');
                        btn_subscribe.textContent = 'Подписаться';
                    }
                    label_subscribers = btn_subscribe.closest('.user-profile-card').querySelector('[name="count_subscribers"]');
                    label_subscribers.textContent = result.count_subscribers
                }
                
                else {
                    alert(result.message); 
                }
                console.log('Результат:', result);

            } else {
                alert('Ошибка при подписке. Вы точно авторизованы? ' + response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при подписке');
        }


    });
}
