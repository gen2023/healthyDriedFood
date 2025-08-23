document.addEventListener('DOMContentLoaded', function () {
  const btn_review = document.querySelector('.openModalReviewsShop');
  if (btn_review) {
    const modal = document.querySelector('.modalReviewsShop');
    const closeBtn = modal.querySelector('.closeModal');
    const submitBtn = modal.querySelector('.submitReview');
    const stars = modal.querySelectorAll('.review_stars .star'); // звёзды внутри модалки
    const modalContent = modal.querySelector('.content-modalReviewsShop');

    let ratingValue = 0;

    // Открытие/закрытие модалки
    btn_review.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    // Выбор рейтинга
    stars.forEach((star, idx) => {
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => s.classList.toggle('hovered', i <= idx));
      });
      star.addEventListener('mouseleave', () => {
        stars.forEach((s, i) => s.classList.toggle('hovered', i < ratingValue));
      });
      star.addEventListener('click', () => {
        ratingValue = idx + 1;
        stars.forEach((s, i) => s.classList.toggle('active', i < ratingValue));
      });
    });

    // Отправка отзыва
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        console.log(submitBtn.disabled);

        if (submitBtn.disabled) return;

        submitBtn.disabled = true;

        const nameUser = document.querySelector('#nameUser').value.trim();

        const emailUser = document.querySelector('#emailUser').value.trim();
        const message = document.querySelector('#message').value.trim();
        const capthaModrteviw = document.querySelector('#capthaModrteviw').value.trim();
        const msg = document.querySelector('#msg');
        const formData = new FormData();
        formData.append('nameUser', nameUser);
        formData.append('emailUser', emailUser);
        formData.append('message', message);
        formData.append('capthaModrteviw', capthaModrteviw);
        formData.append('ratingValue', ratingValue);

        fetch('index.php?option=com_jshopping&controller=reviewshop&task=save', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);

            if (data.success) {
              // modal.classList.remove('active');
              document.querySelector('#nameUser').value = '';
              document.querySelector('#emailUser').value = '';
              document.querySelector('#message').value = '';
              ratingValue = 0;
              document.querySelector('#capthaModrteviw').value = '';
              stars.forEach(s => s.classList.remove('active'));
              msg.textContent = data.msg;
              msg.classList.add('success');
              modalContent.scrollTop = 0;

            } else {
              msg.textContent = data.msg;
              msg.classList.add('error');
              modalContent.scrollTop = 0;


            }
            setTimeout(() => {
              msg.textContent = '';
              msg.classList.remove('success', 'error');
              submitBtn.disabled = false;
            }, 5000);
          })
          .catch(err => alert(Joomla.Text._('MOD_REVIEW_REVIEW_MSG_ERROR_FETCH')));
        submitBtn.disabled = false;

      });
    }
  }
});