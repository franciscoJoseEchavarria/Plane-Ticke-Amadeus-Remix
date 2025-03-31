import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node';
import { useLoaderData, useSubmit, } from '@remix-run/react';
import { useState } from 'react';
// Import components
import QuestionCard from '../components/QuestionCard';
import Sidebar from '../components/Sidebar';
// Import services
import questionService from '~/services/questionService';
import questionOptionService from '~/services/questionOptionService';
import destinationService from '~/services/destinationService';
// Import interfaces
import type { Question } from '~/interfaces/questionInterface';
import { QuestionOption } from '../interfaces/questionOptionInterface';
import { commitSession, getSession } from '~/services/sesionService';
import { User } from '~/interfaces/userInterface';

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const question = await questionService.getQuestions();
        const questionOption = await questionOptionService.getQuestionOptions();

        const session = await getSession(request.headers.get('Cookie'));
        const userData = session.get('user') || { Full_name: 'Usuario', Email: "" };

        if (!question || !questionOption) {
            throw new Response("No se encontraron datos", { status: 404 });
        }

        return json({ 
            question, 
            questionOption, 
            user: userData 
        });
    } catch (error) {
        console.error("Error en el loader:", error);
        throw new Response("Error al cargar los datos", { status: 500 });
    }
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const answers = JSON.parse(formData.get('answers') as string);

    try {
        const answerTexts = answers.map((answer: { text: string }) => answer.text);
        console.log("Respuestas:", answerTexts);

        const cities = await destinationService.getCityByHash(answerTexts);

        const session = await getSession(request.headers.get('Cookie'));
        session.set('recommendedCities', JSON.stringify(cities));

        return redirect('/result', {
            headers: {
                'Set-Cookie': await commitSession(session)
            }
        });
    } catch (error) {
        console.error("Error al procesar respuestas:", error);
        return json({ error: 'No pudimos procesar tus respuestas. Por favor, intenta de nuevo.' }, { status: 500 });
    }
}

export default function Question() {

    const { question, questionOption, user } = useLoaderData<{ 
        question: Question[], 
        questionOption: QuestionOption[],
        user: User
    }>();

    const submit = useSubmit();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<Array<{ 
        questionId: number, 
        optionId: number,
        text: string,
        image: string
    }>>([]);

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer([]);
    }
    
    if (!question.length) {
        return <div className='text-center text-gray-800 text-2xl pt-10'>No hay preguntas disponible</div>
    }

    const currentQuestion = question[currentQuestionIndex];

    const optionsForCurrentQuestion = questionOption.filter(
        (option: QuestionOption) => option.questionId === currentQuestion.id
    );

    /* if (selectedAnswer.length >= question.length) {
        return;
    } */

    const handleOptionSelect = (option: QuestionOption) => {
        const newAnswer = {
            questionId: currentQuestion.id,
            optionId: option.id,
            text: option.text,
            image: option.image
        };

        setSelectedAnswer([...selectedAnswer, newAnswer]);

        if (currentQuestionIndex < question.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            console.log("Todas las preguntas respondidas", selectedAnswer);
        }
    }

    const handleSubmitAnswers = () => {
        submit(
            { answers: JSON.stringify(selectedAnswer) },
            { method: 'post', action: '/question' }
        );
    }

    return (
        <div className='bg-blue-200 min-h-screen flex'>
            <div className='flex-grow'>
                {/* Barra de progreso */}
                <div className="w-full bg-gray-300 h-2">
                    <div 
                        className="bg-blue-500 h-2" 
                        style={{ width: `${((currentQuestionIndex + 1) / question.length) * 100}%` }}
                    ></div>
                </div>

                {selectedAnswer.length >= question.length ? (
                    <div className="text-center mt-10 flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">¡Has completado todas las preguntas!</h2>
                        <p className="text-gray-700 mb-6">Revisa tus preferencias y haz click en <b>Ver mis resultados</b></p>
                        <button 
                            onClick={handleSubmitAnswers} 
                            className="w-80 block text-center py-3 rounded-lg text-white font-medium transition-colors bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        >
                            Ver mis resultados
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-center text-gray-800 text-4xl pt-8">{currentQuestion.text}</h2>

                        <div className="flex justify-center gap-6 pt-4 mt-6">
                            {optionsForCurrentQuestion.map((option: QuestionOption) => (
                                <div 
                                    key={option.id} 
                                    onClick={() => handleOptionSelect(option)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleOptionSelect(option)}
                                    role="button"
                                    tabIndex={0}
                                    className="cursor-pointer"
                                >
                                    <QuestionCard question_option={option} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Sidebar 
                userName={user.Full_name} 
                selectedAnswers={selectedAnswer} 
                onReset={handleReset}
            />
        </div>
    )
}