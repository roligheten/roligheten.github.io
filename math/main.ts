import { randFloat } from "three/src/math/MathUtils";

interface Question {
    num1: number;
    num2: number;
    answer: number;
 }
 
 let currentQuestion: Question = { num1: 0, num2: 0, answer: 0 };
 let skillMatrix: Record<number, Record<number, number>> = {}
 let correctAnswers: number = 0;
 let totalQuestions: number = 0;
 let lastQuestion: [number, number] = [0,0]
 let startTimeQuestion = 0


 function getSkillForQuestion(num1: number, num2: number): number {
    if (num1 < num2) {
        const oldNum1 = num1
        num1 = num2
        num2 = oldNum1
    }
    if (num1 in skillMatrix) {
        if (num2 in skillMatrix[num1]) {
            return skillMatrix[num1][num2]
        }
    }

    return 0.3
 }

 function setSkillForQuestion(num1: number, num2: number, value: number): void {
    if (num1 < num2) {
        const oldNum1 = num1
        num1 = num2
        num2 = oldNum1
    }
    if (!(num1 in skillMatrix)) {
        skillMatrix[num1] = {
            [num2]: value
        }
    }

    skillMatrix[num1][num2] = value
 }

 function getQuestionBasedOnSkill(): [number, number] {
    let firstNum = 2;
    let secondNum = 2;
    while (true) {
        const qChance = getSkillForQuestion(firstNum, secondNum)
        const isLastQuestion = (firstNum == lastQuestion[0] && secondNum == lastQuestion[1]) ||
            (secondNum == lastQuestion[0] && firstNum == lastQuestion[1])
        if (!isLastQuestion && randFloat(0, 1) < qChance) {
            break;
        }
        if (secondNum >= 10) {
            firstNum++;
            secondNum = 2
        } else {
            secondNum++;
        }
    }

    if (randFloat(0,1) > 0.5) {
        const oldFirstNum = firstNum
        firstNum = secondNum
        secondNum = oldFirstNum
    }

    return [firstNum, secondNum]
 } 
 
 function generateQuestion(): void {
    const [num1, num2] = getQuestionBasedOnSkill()
    
    currentQuestion = {
        num1: num1,
        num2: num2,
        answer: num1 * num2
    };
    lastQuestion = [num1, num2]
    startTimeQuestion = Date.now()
    
    const questionElement = document.getElementById('question') as HTMLElement;
    questionElement.textContent = `${num1} × ${num2} = ?`;
 }
 
 function checkAnswer(): void {
    const answerInput = document.getElementById('answer') as HTMLInputElement;
    const userAnswer: number = parseInt(answerInput.value);
    const feedback = document.getElementById('feedback') as HTMLElement;
    
    if (isNaN(userAnswer)) {
        return;
    }
        
    if (userAnswer === currentQuestion.answer) {
        feedback.textContent = '🎉 Correct! Well done!';
        feedback.className = 'feedback correct';

        const currentSkill = getSkillForQuestion(currentQuestion.num1, currentQuestion.num2)
        if (Date.now() - startTimeQuestion <= 5000) {
            const newSkill = Math.max(0.01, currentSkill - 0.1)
            setSkillForQuestion(currentQuestion.num1, currentQuestion.num2, newSkill)
        }
        const newSkill = Math.min(0.6, currentSkill + 0.1)
        setSkillForQuestion(currentQuestion.num1, currentQuestion.num2, newSkill)
        
        setTimeout(() => {
            generateQuestion();
            answerInput.value = '';
            feedback.textContent = '';
            feedback.className = 'feedback';
            answerInput.focus();
        }, 500);
    } else {
        feedback.textContent = `❌ Try again! The answer is ${currentQuestion.answer}`;
        feedback.className = 'feedback incorrect';

        const currentSkill = getSkillForQuestion(currentQuestion.num1, currentQuestion.num2)
        const newSkill = Math.min(0.6, currentSkill + 0.2)
        setSkillForQuestion(currentQuestion.num1, currentQuestion.num2, newSkill)
        
        setTimeout(() => {
            generateQuestion();
            answerInput.value = '';
            feedback.textContent = '';
            feedback.className = 'feedback';
            answerInput.focus();
        }, 2500);
    }
    
 }

 
 // Event listeners
 const answerInput = document.getElementById('answer') as HTMLInputElement;
 answerInput.addEventListener('keypress', function(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
        checkAnswer();
    }
 });
 
 // Initialize game
 generateQuestion();
 answerInput.focus();