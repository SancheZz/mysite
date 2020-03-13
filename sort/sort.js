// регистрируем функцию обработчик события готовности DOM
window.addEventListener("DOMContentLoaded", function(){
	// Находим элементы для ввода/вывода информации
	var form = document.forms.array;
	var input = form["array-input"],
		random = form["random"],
		sort = form["sort"],
		outputs = document.getElementsByTagName("output"),
		canvas = document.getElementsByTagName("canvas")[0];

		// создаем объект сортировки
		var arr = arraySort();
		// указываем HTMLElement'ы для генерации случайных 15 значений и их отображения
		arr.random(input, random, "click", 15);
		// указываем HTMLElement'ы для сортировки и вывода информации
		arr.sort(input, "bubbleSort", sort, "click", {
			originalArray: outputs[0],
			sortedArray: outputs[1],
			numberOfComparisons: outputs[2],
			numberOfPermutations: outputs[3],
			totalTime: outputs[4],
			canvas: canvas,
			delay: 500
		});
}, false);

/**
* Создает объект с методом генерации случайных значений
* и методом сортировки массива
*
* @return {Object}
*/
function arraySort(){
	// сортируемый массив
	var arr = [],
	// буферный массив, где каждый элемент является массивом,
	// копией сортируемого массива в момент перестановки элементов,
	// используется для отрисовки canvas
		buffArr = [],
	// id для setTimeout, дабы была возможность вызвать clearTimeout,
	// используется для отрисовки canvas
		timeId;

	/**
	* Создает объект, где каждый метод является
	* функцией сортировки массива arr
	*
	* @see arr
	* @return {Object}
	*/
	function sortFunctions(){
		// количество сравнений
		var numberOfComparisons = 0,
		// количество перестановок
			numberOfPermutations = 0,
		// время сортировки
			totalTime = 0;

		return {
			/**
			* Сортирует массив arr пузырьком и возвращает результаты
			*
			* @see arr
			* @see http://ru.wikipedia.org/wiki/Сортировка_пузырьком
			* @return {Object}
			*/
			bubbleSort: function(){
				// обнуляем счетчики
				numberOfComparisons = 0,
				numberOfPermutations = 0;
				var currentTime = new Date();
				for(var i=0; i<arr.length; i++)
					for(var j=0; j<arr.length-1-i; j++){
						if(arr[j] > arr[j+1]){
							// копия массива arr при перестановке элементов
							// используется для анимации
							var iterationArray = arr.slice(0);
							// индекс элемента слева
							iterationArray.leftIndex = j;
							// индекс элемента справа
							iterationArray.rightIndex = j+1;
							buffArr.push(iterationArray);
							// сам обмен элементами
							var temp = arr[j];
							arr[j] = arr[j+1];
							arr[j+1] = temp;
							// увеличиваем количество перестановок
							numberOfPermutations++;
						}
						// увеличиваем количество сравнений
						numberOfComparisons++;
					}
				// время сортировки
				totalTime = new Date() - currentTime;
				buffArr.push(arr.slice(0));
				return {
					numberOfComparisons: numberOfComparisons,
					numberOfPermutations: numberOfPermutations,
					totalTime: totalTime
				};
			}
		};
	};

	/**
	* Возвращает массив со случайными числами
	*
	* @param {number} count количество элементов в массиве
	* @return {Array} массив со случайными числами [0; 100)
	*/
	function setRandomValues(count){
		var arr = [];
		var count = count || 10;
		for(var i=0; i<count; i++)
			arr.push(Math.floor(Math.random()*100));
		return arr;
	};

	/**
	* Получение 2d контекста canvas и анимация
	*
	* @param {HTMLCanvasElement} canvas
	*/
	function getCvs(canvas){
		var cvs = canvas.getContext("2d");
		if(!cvs)
			return;
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		/**
		* Анимация
		*
		* @param {number} delay задержка в миллисекундах между кадрами
		*/
		return function(delay){
			var delay = delay || 100;
			var max = Math.max.apply(null, arr);
			var min = Math.min.apply(null, arr);
			var i = 0;
			/**
			* Отрисовка одного кадра
			*
			* @see bufArr
			*/
			function draw(){
				canvas.width = canvas.width;
				cvs.lineWidth = 3;
				var arr = buffArr[i];
				if(!arr)
					return;
				var leftIndex = arr.leftIndex,
					rightIndex = arr.rightIndex;
				for(var j=0; j<arr.length; j++){
					cvs.beginPath();
					// обмениваемые элементы рисуем красным
					if(j == leftIndex || j == rightIndex)
						cvs.strokeStyle = "red";
					else
						cvs.strokeStyle = "black";
					var x = (j+1)*10;
					cvs.moveTo(x, canvas.height);
					cvs.lineTo(x, canvas.height - arr[j]);
					cvs.stroke();
				}
				if(++i == buffArr.length)
					return;
				timeId = setTimeout(draw, delay);
			}
			draw();
		}
	}

	return {
		/**
		* Генерирует случайные числа в input type="text"
		*
		* @param {HTMLInputElement} arrayInput текстовый input
		* @param {HTMLInputElement} randomButton где будем ловить событие
		* @param {string} type тип события
		* @param {count} number количество случаных элементов
		*/
		random: function(arrayInput, randomButton, type, count){
			var count = isFinite(count) ? Number(count) : 10;
			randomButton.addEventListener(type, function(){
				var arr = setRandomValues(count);
				arrayInput.value = arr.join(" ");
			}, false);
		},
		/**
		* Сортирует массив arr
		*
		* @see arr
		* @param {HTMLInputElement} arrayInput текстовый input
		* @param {string} sortType тип сортировки
		* @param {HTMLInputElement} sortButton где будем ловить событие
		* @param {string} type тип события
		* @param {Object} outputs объект HTML элементов для вывода информации
		* @throws {Error} неподдерживаемый тип сортировки
		*/
		sort: function(arrayInput, sortType, sortButton, type, outputs){
			var cvs = getCvs(outputs.canvas);
			sortButton.addEventListener(type, function(){
				arr = [], buffArr = [];
				if(timeId)
					clearTimeout(timeId);
				var inputArr = arrayInput.value.trim().split(" ");
				for(var i=0; i<inputArr.length; i++){
					if(inputArr[i] == "")
						continue;
					if(isFinite(inputArr[i]))
						arr.push(Number(inputArr[i]));
				}
				arrayInput.value = arr.join(" ");
				outputs.originalArray.textContent = arr.join(", ");
				var sorts = sortFunctions();
				if(sortType in sorts)
					var results = sorts[sortType]();
				else
					throw new Error(sortType+" is not supported");
				outputs.sortedArray.textContent = arr.join(", ");
				outputs.numberOfComparisons.textContent = results.numberOfComparisons;
				outputs.numberOfPermutations.textContent = results.numberOfPermutations;
				outputs.totalTime.textContent = results.totalTime/1000+" с";
				if(cvs)
					cvs(outputs.delay);
			}, false);
		}
	}
}
