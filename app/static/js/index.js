function update_page(){
    console.log('update_page')
    // ВЫНЕС ИЗ modal_comments.js 
    btn_comments = document.querySelectorAll('.fa-comment')

    btn_comments.forEach(btn_in => {
        const btn = btn_in.closest('.tweet-action')
        if (btn === null) return;

        btn.addEventListener('click', function(){

            const tweet = btn.closest('.tweet');
            if (!tweet || !tweet.id) {
                return;
            }
            const post_id = tweet.id;

            // const post_id = btn.closest('.tweet').id;
            console.log('post_id', post_id)
            comOpenModal(post_id)
        })
    });
    // 

    btn_likes = document.querySelectorAll('.fa-heart')
    btn_subscribe = document.querySelector('.subscribe-btn')
    btn_favour = document.querySelectorAll('.fa-bookmark')

    document.querySelectorAll('.fa-heart').forEach(btn => {

        btn.addEventListener('click', async function() {

            // Нахожу id поста
            const tweet = btn.closest('.tweet');
            if (!tweet || !tweet.id) {
                return;
            }
            console.log('Сердечко нажато!', this);
            const post_id = tweet.id;
            // const post_id = this.closest('.tweet').id;

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
            const tweet = btn.closest('.tweet');
            if (!tweet || !tweet.id) {
                return;
            }
            const post_id = tweet.id;

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
    btns_subscribe = document.querySelectorAll('.subscribe-btn')

    btns_subscribe.forEach(btn_subscribe => {

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

    })

    // Функционал репоста
    const btns_retweet = document.querySelectorAll('.fa-retweet');

    btns_retweet.forEach(btn_retweet => {
        let btn = btn_retweet.parentElement;
        let tweet = btn.closest('.tweet');
        let post_id = parseInt(tweet.id);
        
        btn.addEventListener('click', function(){
            let tweet_copy = tweet.cloneNode(true);

            console.log('Click retweet, post_id = ', post_id, tweet_copy);
            open_modal_retweet(post_id, tweet_copy);
            
        });
    });

    // Для выпадающего списка
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        let btn_delete = dropdown.querySelector('[data-action="delete"]');
        btn_delete.addEventListener('click', function(){
            let post = btn_delete.closest('.tweet')
            const post_id = post.id;
            delete_post(post_id, post);

        })

        let btn_report = dropdown.querySelector('[data-action="report"]');
        btn_report.addEventListener('click', function(){
            alert('Чуть позже будет')

        })
        
    })
};



async function delete_post(post_id, post) {
    try {
        const response = await fetch(`/api/delete_post/${post_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                console.log(post_id, 'Удален')

                post.style.transition = 'all 0.3s ease';
                post.style.opacity = '0';
                post.style.transform = 'translateX(100px)';
                
                setTimeout(() => {
                    post.remove();
                }, 300);

            }

            else {
                alert(result.message); 
            }
        } else {
            alert('Ошибка при удалении поста. Вы точно авторизованы? ' + response.status);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при удалении поста');
    }
    
}






update_page();

async function comLoadMorePosts(btn){

    const posts_list = document.querySelector('.twitter-style-posts');
    let page_number = parseInt(btn.getAttribute('data-page-number'));


    if (btn.getAttribute('data-active-page') == 'main'){
        try {
            const response = await fetch(`/api/get_main_posts/${page_number}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Изменяю дата атрибут для счета страниц  
                    page_number += 1
                    btn.setAttribute('data-page-number', page_number)
                    const new_posts = result.posts;

                    if (new_posts.length  < 10 ){
                        btn.style.display = 'none';
                    }

                    posts_list.innerHTML += new_posts.map(post => `
                        
                        
                        <div class="tweet" id="${post.post_id}">
                            <div class="tweet-header">
                            <a href="/user/${post.user_id}/profile_posts" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                                <img src="${post.avatar_url}" alt="User" class="tweet-avatar">
                                <div class="tweet-user-info">
                                <span class="tweet-username">${post.displayName}</span>
                                <span class="tweet-usertag">@${post.username}</span>
                                <span class="tweet-time">· ${ post.created_at }</span>
                                </div>
                            </a>
                            <div class="dropdown">
                                <div class="tweet-more-options">···</div>
                                <div class="dropdown-content">
                                <!-- <button class="dropdown-item data-action="pin"">
                                    <span>📌</span> Закрепить
                                </button> -->
                                <button class="dropdown-item" data-action="delete">
                                    <span>🗑️</span> Удалить
                                </button>
                                <button class="dropdown-item" data-action="report">
                                    <span>🚩</span> Пожаловаться
                                </button>
                                </div>
                            </div>
                            </div>
                            <div class="tweet-content">
                            <p>${ post.content }</p>
                            <!-- <div class="tweet-image">
                                <img src="https://source.unsplash.com/random/600x300/?coding" alt="Tweet image">
                            </div> -->
                            </div>
                            <div class="tweet-footer">
                            <div class="tweet-action">
                                <i class="far fa-comment"></i>
                                <span>${post.count_comments}</span>
                            </div>
                            <div class="tweet-action">
                                <i class="fas fa-retweet"></i>
                                <span>${post.count_retweets}</span>
                            </div>
                            <div class="tweet-action">
                                <i class="${post.user_like ? 'fas fa-heart' : 'far fa-heart'}" style="${post.user_like ? 'color: red;' : ''}"></i>
                                <span class="likes-count">${post.count_likes}</span>
                            </div>
                            <div class="tweet-action">
                                <i class="${post.is_favourite ? 'fas fa-bookmark' : 'far fa-bookmark'}" 
                                style="${post.is_favourite ? 'color: orange;' : ''}"></i>
                            </div>
                            </div>
                        </div>


                        `).join('');
                        update_page();
                }
                else {
                    alert(result.message); 
                }
                console.log('Результат:', result);

            } else {
                alert('Ошибка при загрузки страницы: ' + response.message);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при загрузки страницы');
        }

    }
}


