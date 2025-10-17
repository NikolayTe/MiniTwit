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

function fill_modal(orig_post, comModal, post_id){
    comModal.style.display = 'block';
    comModal.setAttribute('data-post-id', post_id)
    document.getElementById('comModalOverlay').style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Нахожу оригинальный пост и повторяю его
    comModal.querySelector('.com-username').textContent = orig_post.querySelector('.tweet-username').textContent;
    comModal.querySelector('.com-user-handle').textContent = orig_post.querySelector('.tweet-usertag').textContent;
    comModal.querySelector('.com-post-time').textContent = orig_post.querySelector('.tweet-time').textContent;
    comModal.querySelector('.com-post-text').textContent = orig_post.querySelector('.tweet-content').textContent;
    comModal.querySelector('.fa-heart').className  = orig_post.querySelector('.fa-heart').className;
    comModal.querySelector('.fa-heart').style.color = orig_post.querySelector('.fa-heart').style.color;
    comModal.querySelector('.com-post-header').querySelector('a').href = orig_post.querySelector('.tweet-header').querySelector('a').href;
    const like = comModal.querySelector('.fa-heart');
    const like_count = parseInt(orig_post.querySelector('.fa-heart').closest('.tweet-action').querySelector('span').textContent);
    comModal.querySelector('.com-like-area').querySelector('.likes-count').textContent = like_count

    comModal.querySelector('.fa-bookmark').className  = orig_post.querySelector('.fa-bookmark').className;
    comModal.querySelector('.fa-bookmark').style.color = orig_post.querySelector('.fa-bookmark').style.color;


    let count_comments = parseInt(orig_post.querySelector('.fa-comment').closest('.tweet-action').querySelector('span').textContent);
    comModal.querySelector('.comments-count').textContent = count_comments;

}


async function comOpenModal(post_id) {
    const comModal = document.getElementById('comModal');
    // comModal.style.display = 'block';
    // comModal.setAttribute('data-post-id', post_id)
    // document.getElementById('comModalOverlay').style.display = 'block';
    // document.body.style.overflow = 'hidden';

    // Нахожу оригинальный пост и повторяю его
    const orig_post = document.querySelector(`.tweet[id="${post_id}"]`);
    // comModal.querySelector('.com-username').textContent = orig_post.querySelector('.tweet-username').textContent;
    // comModal.querySelector('.com-user-handle').textContent = orig_post.querySelector('.tweet-usertag').textContent;
    // comModal.querySelector('.com-post-time').textContent = orig_post.querySelector('.tweet-time').textContent;
    // comModal.querySelector('.com-post-text').textContent = orig_post.querySelector('.tweet-content').textContent;
    // comModal.querySelector('.fa-heart').className  = orig_post.querySelector('.fa-heart').className;
    // comModal.querySelector('.fa-heart').style.color = orig_post.querySelector('.fa-heart').style.color;
    // comModal.querySelector('.com-post-header').querySelector('a').href = orig_post.querySelector('.tweet-header').querySelector('a').href;
    // const like = comModal.querySelector('.fa-heart');
    // const like_count = parseInt(orig_post.querySelector('.fa-heart').closest('.tweet-action').querySelector('span').textContent);
    // comModal.querySelector('.com-like-area').querySelector('.likes-count').textContent = like_count
    // // comModal.querySelector('.com-post-stats').querySelector('span').innerHTML = ''
    // // comModal.querySelector('.com-post-stats').querySelector('span').innerHTML.appendChild(like)
    // // comModal.querySelector('.com-post-stats').querySelector('span').innerHTML.appendChild(document.createTextNode(` ${like_count}`))
    
    fill_modal(orig_post, comModal, post_id);
    
    // Добавляю клик к лайку и привязываю к ориг посту
    const modal_like = comModal.querySelector('.com-like-area');
    modal_like.addEventListener('click', async function(){
        const orig_post = document.querySelector(`.tweet[id="${post_id}"]`);
        await orig_post.querySelector('.fa-heart').click();
        await new Promise(resolve => requestAnimationFrame(resolve));
        // Убираю возможность клика на время
        orig_post.querySelector('.fa-heart').style.pointerEvents = 'none';

        setTimeout(fill_modal, 100, orig_post, comModal, post_id);
        setTimeout(() => {
            // Разблокирую клик
            orig_post.querySelector('.fa-heart').style.pointerEvents = 'auto';
        }, 100);
    })
    // Тоже самое для избранного
    const modal_fovar = comModal.querySelector('.com-favor-area');
    modal_fovar.addEventListener('click', async function(){
        const orig_post = document.querySelector(`.tweet[id="${post_id}"]`);
        await orig_post.querySelector('.fa-bookmark').click();
        await new Promise(resolve => requestAnimationFrame(resolve));

        setTimeout(fill_modal, 100, orig_post, comModal, post_id);
    })


    const list = comModal.querySelector('.com-comments-section');

    // Красивый loading
    list.innerHTML = `
        <div class="ds-loading-spinner">
            <div class="ds-spinner"></div>
            <div class="ds-loading-text">Загружаем комментарии...<br></div>
        </div>
    `;
    try {
        const response = await fetch(`/api/get_comments/${post_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                const comments_list = result.comments_list
                // Тут отоброжение коментов
                list.innerHTML = comments_list.map(user =>`
                                <div class="com-comment">
                            <div class="com-comment-header id=${user.user_id}">

                                <a href="/user/${user.user_id}/profile_posts" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                                    <div class="com-comment-avatar">Г</div>
                                    <div>
                                        <span class="com-comment-user">${user.display_name}</span>
                                        <span class="com-comment-handle">@${user.user_name}</span>
                                        <span class="com-comment-time">· ${user.created_at}</span>
                                    </div>
                                </a>

                            </div>
                            <div class="com-comment-text">
                                ${user.comment_text}
                            </div>
                            <div class="com-comment-actions">
                                <button class="com-action-btn"  id="${user.comment_id}" onclick="btn_com_like(this)">
                                    <i class="far fa-heart"></i> 5
                                </button>
                                <button class="com-action-btn">
                                    <i class="far fa-comment"></i> Ответить
                                </button>
                            </div>
                        </div>
                    `).join('');
                
            }
            else {
                alert(result.message); 
            }
            console.log('Результат:', result);

        } else {
            alert('Ошибка при получении коментариев: ' + response.status);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при получении коментариев');
    }

}


function comCloseModal() {
    document.getElementById('comModal').style.display = 'none';
    document.getElementById('comModalOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}
function comToggleSendBtn() {
    const textInput = document.getElementById('comCommentInput');
    const sendBtn = document.getElementById('comSendBtn');
    sendBtn.disabled = textInput.value.trim() === '';
}

async function comSendComment(button) {
    const comModal = button.closest('.com-modal');
    const post_id = comModal.getAttribute('data-post-id');
    console.log('post_id:', post_id);

    const user_id = button.getAttribute('data-user-id');
    console.log('user_id:', user_id);


    const textInput = document.getElementById('comCommentInput');
    const commentText = textInput.value.trim();
    
    if (commentText) {
        const list = comModal.querySelector('.com-comments-section');
        try {
            const response = await fetch(`/api/set_comment/${post_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                comment: commentText,
                user_id: parseInt(user_id)
            })

            });
        
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // alert(result.message);
                    textInput.value = '';

                    list.innerHTML += `
                                <div class="com-comment">
                            <div class="com-comment-header id=${result.comment_data.user_id}">
                                <a href="/user/${result.comment_data.user_id}/profile_posts" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                                    <div class="com-comment-avatar">Г</div>
                                    <div>
                                        <span class="com-comment-user">${result.comment_data.display_name}</span>
                                        <span class="com-comment-handle">@${result.comment_data.user_name}</span>
                                        <span class="com-comment-time">· ${result.comment_data.created_at}</span>
                                    </div>
                                </a>
                            </div>
                            <div class="com-comment-text">
                                ${result.comment_data.comment_text}
                            </div>
                            <div class="com-comment-actions">
                                <button class="com-action-btn">
                                    <i class="far fa-heart"></i> 5
                                </button>
                                <button class="com-action-btn">
                                    <i class="far fa-comment"></i> Ответить
                                </button>
                            </div>
                        </div>
                    `
                    const scrol_div = comModal.querySelector('.com-modal-content');
                    scrol_div.scrollTo({
                                    top: scrol_div.scrollHeight,
                                    behavior: 'smooth'
                                });
                    // И добавлю счетчик +1 на ориг посте
                    const orig_post = document.querySelector(`.tweet[id="${post_id}"]`);
                    let count_comments = parseInt(orig_post.querySelector('.fa-comment').closest('.tweet-action').querySelector('span').textContent)
                    orig_post.querySelector('.fa-comment').closest('.tweet-action').querySelector('span').textContent = count_comments + 1
                    comModal.querySelector('.comments-count').textContent = count_comments + 1
                }
                else {
                    alert(result.message); 
                }
                console.log('Результат:', result);

            } else {
                alert('Ошибка при получении коментариев: ' + response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при получении коментариев');
        }
    }
}
// Отправка по Enter (Ctrl+Enter или Cmd+Enter)
document.getElementById('comCommentInput').addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        comSendComment();
    }
});
// Закрытие по ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        comCloseModal();
    }
});

function btn_com_like(btn){
    alert(`Лайки комментариев будут позже, comment_id: ${btn.id}`)
}