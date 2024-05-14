const btnsNext = document.querySelectorAll('[data-nav="next"]');
const btnsPrev = document.querySelectorAll('[data-nav="prev"]');
const radioGroups = document.querySelectorAll('.radio-group');
const checkboxGroups = document.querySelectorAll('.checkbox-group');

// Объект с ответами
let answers = {
	2: null,
	3: null,
	4: null,
	5: null,
};

// Перебираем все кнопки вперед
btnsNext.forEach(function (el) {
	el.addEventListener('click', function () {
		const thisCard = el.closest('[data-card]');
		const thisCardNumber = parseInt(thisCard.dataset.card);
		if (thisCard.dataset.validate == 'novalidate') {
			navigate('next', thisCard)
			updateProgressBar('next', thisCardNumber)
		} else {
			saveAnswers(thisCardNumber, gatherCardData(thisCardNumber))
			if (isValidate(thisCardNumber) && checkRequired(thisCardNumber)) {
				navigate('next', thisCard)
				updateProgressBar('next', thisCardNumber)
			} else {
				alert('Введите ответ что бы продолжить')
			}
		};
	})
});

// Перебираем все кнопки назад
btnsPrev.forEach(function (el) {
	el.addEventListener('click', function (e) {
		const thisCard = el.closest('[data-card]');
		const thisCardNumber = parseInt(thisCard.dataset.card)
		navigate('prev', thisCard);
		updateProgressBar('prev', thisCardNumber)
	})
})

// Функция навигации по карточкам
function navigate(direction, thisCard) {
	const thisCardNumber = parseInt(thisCard.dataset.card);
	let nextCard;
	if (direction == 'next') {
		nextCard = thisCardNumber + 1
	} else {
		nextCard = thisCardNumber - 1
	}
	document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden');
	thisCard.classList.add('hidden');
}

// Получаем данные ответов и записываем их в массив result, получаем вопросы и записываем их в question. Проводим эти операции со всеми используемыми типами вводимых данных
function gatherCardData(number) {
	let question;
	let result = [];

	const currentCard = document.querySelector(`[data-card="${number}"]`);
	question = currentCard.querySelector('.title-main').innerText;

	const radioValues = currentCard.querySelectorAll('[type="radio"]');

	radioValues.forEach(function (item) {
		if (item.checked) {
			result.push({
				name: item.name,
				value: item.value,
			})
		}
	})

	const checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
	checkBoxValues.forEach(function (item) {
		if (item.checked) {
			result.push({
				name: item.name,
				value: item.value,
			})
		}
	})

	const inputValues = currentCard.querySelectorAll(
		'[type="email"], [type="text"]'
	);
	inputValues.forEach(function (item) {
		const itemValue = item.value;
		if (itemValue.trim() != '') {
			result.push({
				name: item.name,
				value: item.value,
			})
		}
	})

	// Создаем объект data что бы возвращать данные из функции
	const data = {
		question: question,
		answers: result,
	}

	return data
}

// Функция для сохранения ответов в объект answers
function saveAnswers(numberCard, dataCard) {
	answers[numberCard] = dataCard;
}

// Валидация для карточек. Если возвращает false, значит ответа не было
function isValidate(cardNumber) {
	if (answers[cardNumber].answers.length > 0) {
		return true
	} else {
		return false
	}
}

// Функция валидации email 
function validateEmail(email) {
	const pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
	return pattern.test(email);
}

// Функция определяет для каких карточек нужна валидация
function checkRequired(number) {
	const currentCard = document.querySelector(`[data-card="${number}"]`);
	const requiredFields = currentCard.querySelectorAll('[required]');

	let isValidArray = [];

	requiredFields.forEach(function (item) {
		if (item.type == 'checkbox' && item.checked == false) {
			isValidArray.push(false);
		} else if (item.type == 'email') {
			if (validateEmail(item.value)) {
				isValidArray.push(true);
			} else {
				isValidArray.push(false);
			}
		}
	})

	if (isValidArray.indexOf(false) == -1) {
		return true
	} else {
		return false
	}
}

// Добавляем активные классы на радио-кнопки
radioGroups.forEach(function (item) {
	item.addEventListener('click', function (e) {
		const target = e.target.closest('.radio-block');
		if (target != null) {
			target
				.closest('.radio-group')
				.querySelectorAll('.radio-block')
				.forEach(function (el) {
					el.classList.remove('radio-block--active')
				})
			target.classList.add('radio-block--active');
		}
	})
})

// Добавляем активные классы на чекбоксы
checkboxGroups.forEach(function (el) {
	el.addEventListener('change', function (e) {
		const target = e.target;
		if (target.checked) {
			target.closest('.checkbox-block').classList.add('checkbox-block--active');
		} else {
			target
				.closest('.checkbox-block')
				.classList.remove('checkbox-block--active');
		}
	})
})


// Функция организует работу прогресс бара
function updateProgressBar(direction, thisCardNumber) {
	const cards = document.querySelectorAll('[data-card]');
	if(direction == 'next') {
		thisCardNumber += 1;
	} else {
		thisCardNumber -= 1;
	}

	const percent = ((thisCardNumber * 100) / cards.length).toFixed();
	
	const currentCard = document.querySelector(`[data-card="${thisCardNumber}"]`);
	const progress = currentCard.querySelector('.progress');
	
	if(progress) {
		progress.querySelector('#progress-value').innerText = percent + '%';
		progress.querySelector('.progress__line-bar').style.width = percent + '%';
	}
}
