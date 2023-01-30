function docReady(fn: any) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
} 

docReady(function() {
    // DOM is loaded and ready for manipulation here
    const inputA = document.querySelector('#a') as HTMLInputElement;
    const inputB = document.querySelector('#b') as HTMLInputElement;
    const inputC = document.querySelector('#c') as HTMLInputElement;
    const elementA = document.querySelector('.element-a')! as HTMLSpanElement;
    const elementB = document.querySelector('.element-b')! as HTMLSpanElement;
    const elementC = document.querySelector('.element-c')! as HTMLSpanElement;
    const partB = document.querySelector('.part-b')!;
    const resultNode = document.querySelector('.result')!;

    inputA?.addEventListener('input', function() {
        showElement(elementA, this.value, 'a', true);
    });
    
    inputB?.addEventListener('input', function() {
        showElement(elementB, this.value, '+ b', false, true);
    });
    
    inputC?.addEventListener('input', function() {
        showElement(elementC, this.value, '+ c', false, false, true);
    });
    

    /**
     * Если введено 1 для какого-либо из двух первых элементов, то убираем отображение этого элемента
     * 
     * @param {boolean} firstElement Является ли этот элемент первым в уравнении
     * @param {boolean} secondElement Является ли этот элемент вторым в уравнении
     * @param {number} value Значение элемента
     * @returns 
     */
    function checkFor1(firstElement: boolean, secondElement: boolean, value: number): number | string {

        if (firstElement || secondElement) {
            if (value == 1) {
                return '';
            }
        }

        return value;
    }


    /**
     * Показываем элемент который мы ввели в уравнение
     * 
     * @param {object} element нода с элементом в уравнении
     * @param {string} value введенное пользователем значение
     * @param {string} defaultValue значение по умолчанию
     * @param {boolean} firstElement является ли элемент первым в уравнении
     * @param {boolean} secondElement является ли элемент вторым в уравнении
     * @param {boolean} thirdElement является ли элемент третьим в уравнении
     */
    function showElement(element: HTMLSpanElement, value: string, defaultValue: string, firstElement: boolean = false, secondElement: boolean = false, thirdElement: boolean = false): void {   
        // Показываем часть уравнения если редактируется элемент из этой части
        if (secondElement) {
            partB.classList.remove('d-none');
        } else if (thirdElement) {
            elementC.classList.remove('d-none');
        } 

        let result = '';
        let returnedValue: string | number;

        if (value) {
            const parsedValue = parseFloat(value);
        
            if (parsedValue > 0) {
                returnedValue = checkFor1(firstElement, secondElement, parsedValue);

                if (!firstElement) {
                    result = `+ ${returnedValue}`;
                } else {
                    result = `${returnedValue}`;
                }               
            } else if (parsedValue == 0 ) {
                // Если ввели 0 - тогда скрываем всю часть, кроме первой части
                if (firstElement) {
                    result = defaultValue;
                } else if (secondElement) {
                    partB.classList.add('d-none');
                } else {
                    elementC.classList.add('d-none');
                }
            } else {
                returnedValue = checkFor1(firstElement, secondElement, Math.abs(parsedValue));
                result = `- ${returnedValue}`;
            }

            element.innerText = result;
        } else {
            element.innerText = defaultValue;
        }
    }

    /**
     * Делаем округление для дробных чисел
     * 
     * @param {number} number число для проверки
     * @returns 
     */
    function roundIfFloat(number: number): number | string {
        if (!Number.isInteger(number)) {
            return number.toFixed(3);
        }
        return number;
    }

    interface FormElements extends HTMLFormControlsCollection {
        a: HTMLInputElement;
        b: HTMLInputElement;
        c: HTMLInputElement;
    } 

    const form = document.querySelector('form');
    form?.addEventListener('submit', function(e) {
        e.preventDefault();

        const elements = this.elements as FormElements;

        const a = elements.a.valueAsNumber;
        const b = elements.b.valueAsNumber;
        const c = elements.c.valueAsNumber;
        let result = '';
        
        // Высчитываем дискриминант
        const discriminant = b*b - (4*a*c);

        if (discriminant < 0) {
            result = 'Корней нет';
        } else if (discriminant == 0) {
            const root = (-1*b)/(2*a);
            result = `Единственный корень = ${root}`;
        } else {
            const root1 = ((-1*b) + Math.sqrt(discriminant))/(2*a);
            const root2 = ((-1*b) - Math.sqrt(discriminant))/(2*a);

            const root1AfterRound = roundIfFloat(root1);
            const root2AfterRound = roundIfFloat(root2);

            result = `Первый корень = ${root1AfterRound}, второй корень = ${root2AfterRound}`;
        }

        // Если ввели 0 в качестве значения для "а", то сообщаем что тогда это уже не будет квадратным уравнением. 
        if (a == 0) {
            result = 'В квадратном уравнении "a" не может равняться 0, тогда это уже не квадратное уравнение';
        }

        resultNode.innerHTML = result;
    });
});